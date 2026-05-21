import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

import california from '../images/california.png';
import dragon from '../images/dragon.png';
import dynamite from '../images/dynamite.png';
import whitey from '../images/philadelphia.png';
import rainbow from '../images/rainbow.png';
import fungi from '../images/shrimp.png';

const IMAGE_FALLBACK = { california, dragon, dynamite, whitey, rainbow, fungi };

// Usati se la tabella products è vuota o Supabase non è raggiungibile
const FALLBACK_PRODUCTS = [
  { id: 0, name: 'California', prezzo: 2.50, img: california, categoria: 'roll',   description: 'Granchio, avocado, cetriolo, tobiko',        allergeni: ['crostacei', 'pesce'] },
  { id: 1, name: 'Dragon',     prezzo: 4.20, img: dragon,     categoria: 'special', description: 'Anguilla, avocado, salsa teriyaki',            allergeni: ['pesce', 'soia', 'glutine'] },
  { id: 2, name: 'Dynamite',   prezzo: 2.10, img: dynamite,   categoria: 'roll',   description: 'Gambero in tempura, maionese piccante',        allergeni: ['crostacei', 'uova', 'glutine'] },
  { id: 3, name: 'Whitey',     prezzo: 1.50, img: whitey,     categoria: 'roll',   description: 'Salmone, philadelphia, erba cipollina',        allergeni: ['pesce', 'latticini'] },
  { id: 4, name: 'Rainbow',    prezzo: 3.40, img: rainbow,    categoria: 'special', description: 'Mix di pesce fresco, avocado',                allergeni: ['pesce', 'crostacei'] },
  { id: 5, name: 'Fungi',      prezzo: 2.80, img: fungi,      categoria: 'nigiri', description: 'Gambero, riso, salsa speciale',               allergeni: ['crostacei', 'soia'] },
];

const mapProduct = (p) => {
  const nameKey = p.name?.toLowerCase();
  return {
    id: p.id,
    name: p.name,
    prezzo: parseFloat(p.price),
    img: IMAGE_FALLBACK[nameKey] || p.image_url || california,
    categoria: p.category || 'roll',
    description: p.description || '',
    allergeni: p.allergeni || [],
  };
};

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: true });

      if (error) {
        setIsError(error.message);
        setProducts(FALLBACK_PRODUCTS);
      } else if (!data || data.length === 0) {
        setProducts(FALLBACK_PRODUCTS);
      } else {
        setProducts(data.map(mapProduct));
      }
      setIsLoading(false);
    };

    fetch();
  }, []);

  return { products, isLoading, isError };
};
