import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export const useCoupon = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateCoupon = useCallback(async (code, applyCoupon) => {
    if (!code.trim()) { setError('Inserisci un codice coupon'); return; }
    setLoading(true);
    setError('');

    const { data, error: dbError } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase().trim())
      .eq('active', true)
      .single();

    if (dbError || !data) {
      setError('Coupon non valido o scaduto');
    } else if (data.used_count >= data.max_uses) {
      setError('Coupon esaurito');
    } else {
      applyCoupon(data.code, data.discount_percent);
      setError('');
    }
    setLoading(false);
  }, []);

  const incrementCouponUsage = useCallback(async (code) => {
    const { data } = await supabase
      .from('coupons')
      .select('used_count')
      .eq('code', code)
      .single();
    if (data) {
      await supabase
        .from('coupons')
        .update({ used_count: data.used_count + 1 })
        .eq('code', code);
    }
  }, []);

  return { loading, error, validateCoupon, incrementCouponUsage };
};
