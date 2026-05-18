-- ============================================================
-- supabase_migration_01.sql
-- Sushi Project – Schema iniziale + RLS
-- Esegui questo file nel pannello SQL di Supabase (SQL Editor)
-- ============================================================

-- ============================================================
-- 1. TABELLA: profiles
--    Estende auth.users con il campo role
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id        UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role      TEXT NOT NULL DEFAULT 'user',
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT profiles_role_check CHECK (role IN ('user', 'admin'))
);

-- Trigger: crea automaticamente un profilo quando un nuovo utente si registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ============================================================
-- 2. TABELLA: products
--    Catalogo prodotti del menu
-- ============================================================
CREATE TABLE IF NOT EXISTS public.products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  price       NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image_url   TEXT,
  category    TEXT,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 3. TABELLA: orders
--    Ordine principale (testata)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount  NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  status        TEXT NOT NULL DEFAULT 'pending',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT orders_status_check CHECK (status IN ('pending', 'confirmed', 'preparing', 'delivered', 'cancelled'))
);


-- ============================================================
-- 4. TABELLA: order_items
--    Righe di dettaglio per ciascun ordine
-- ============================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id       UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id     UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity       INTEGER NOT NULL CHECK (quantity > 0),
  price_at_time  NUMERIC(10, 2) NOT NULL CHECK (price_at_time >= 0)
);


-- ============================================================
-- 5. TABELLA: ratings
--    Recensioni dei prodotti legate a products e auth.users
--    DROP + CREATE per garantire integrità relazionale corretta
--    (se esiste già una versione senza FK, questa la sostituisce)
-- ============================================================
DROP TABLE IF EXISTS public.ratings CASCADE;

CREATE TABLE public.ratings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES auth.users(id)    ON DELETE CASCADE,
  stars      INTEGER NOT NULL CHECK (stars BETWEEN 1 AND 5),
  comment    TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- un utente può recensire lo stesso prodotto una sola volta
  CONSTRAINT ratings_unique_user_product UNIQUE (user_id, product_id)
);


-- ============================================================
-- 6. ROW LEVEL SECURITY – Abilitazione
-- ============================================================
ALTER TABLE public.profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings     ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- 7. HELPER FUNCTION: is_admin()
--    Evita subquery ripetute nelle policy
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;


-- ============================================================
-- 8. RLS POLICIES – profiles
-- ============================================================

-- Ogni utente può leggere solo il proprio profilo; gli admin vedono tutti
CREATE POLICY "profiles: owner or admin can select"
  ON public.profiles FOR SELECT
  USING (id = auth.uid() OR public.is_admin());

-- Ogni utente può aggiornare solo il proprio profilo (non il campo role)
CREATE POLICY "profiles: owner can update"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND role = 'user'); -- impedisce auto-promozione

-- Solo admin può promuovere/degradare ruoli
CREATE POLICY "profiles: admin can update role"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());


-- ============================================================
-- 9. RLS POLICIES – products
-- ============================================================

-- Chiunque (anche anonimo) può leggere i prodotti attivi
CREATE POLICY "products: public read active"
  ON public.products FOR SELECT
  USING (active = TRUE OR public.is_admin());

-- Solo admin può inserire prodotti
CREATE POLICY "products: admin insert"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin());

-- Solo admin può aggiornare prodotti
CREATE POLICY "products: admin update"
  ON public.products FOR UPDATE
  USING (public.is_admin());

-- Solo admin può eliminare prodotti
CREATE POLICY "products: admin delete"
  ON public.products FOR DELETE
  USING (public.is_admin());


-- ============================================================
-- 10. RLS POLICIES – orders
-- ============================================================

-- L'utente può vedere solo i propri ordini; l'admin vede tutti
CREATE POLICY "orders: owner or admin can select"
  ON public.orders FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

-- L'utente autenticato può creare ordini intestati a se stesso
CREATE POLICY "orders: owner can insert"
  ON public.orders FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Solo admin può aggiornare lo status di un ordine
CREATE POLICY "orders: admin can update"
  ON public.orders FOR UPDATE
  USING (public.is_admin());


-- ============================================================
-- 11. RLS POLICIES – order_items
-- ============================================================

-- L'utente può vedere i dettagli dei propri ordini; admin vede tutto
CREATE POLICY "order_items: owner or admin can select"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
        AND (o.user_id = auth.uid() OR public.is_admin())
    )
  );

-- L'utente può inserire righe solo su ordini di sua proprietà
CREATE POLICY "order_items: owner can insert"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
        AND o.user_id = auth.uid()
    )
  );


-- ============================================================
-- 12. RLS POLICIES – ratings
-- ============================================================

-- Chiunque (anche anonimo) può leggere le recensioni
CREATE POLICY "ratings: public read"
  ON public.ratings FOR SELECT
  USING (TRUE);

-- Solo utenti autenticati possono inserire, e solo per se stessi
CREATE POLICY "ratings: authenticated insert"
  ON public.ratings FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Il proprietario può modificare la propria recensione
CREATE POLICY "ratings: owner can update"
  ON public.ratings FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Il proprietario o un admin può eliminare una recensione
CREATE POLICY "ratings: owner or admin can delete"
  ON public.ratings FOR DELETE
  USING (user_id = auth.uid() OR public.is_admin());


-- ============================================================
-- FINE MIGRAZIONE
-- ============================================================
