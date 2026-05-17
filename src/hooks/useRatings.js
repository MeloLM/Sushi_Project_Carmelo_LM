import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const RATED_KEY = 'sushiRated';

export const useRatings = (productId) => {
  const [averageRating, setAverageRating] = useState(null);
  const [ratingCount, setRatingCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const hasRated = useCallback(() => {
    try {
      const rated = JSON.parse(localStorage.getItem(RATED_KEY) || '{}');
      return !!rated[productId];
    } catch { return false; }
  }, [productId]);

  const fetchRating = useCallback(async () => {
    const { data } = await supabase
      .from('ratings')
      .select('stars')
      .eq('product_id', String(productId));
    if (data?.length > 0) {
      const avg = data.reduce((sum, r) => sum + r.stars, 0) / data.length;
      setAverageRating(Math.round(avg * 10) / 10);
      setRatingCount(data.length);
    }
  }, [productId]);

  useEffect(() => { fetchRating(); }, [fetchRating]);

  const submitRating = useCallback(async (stars, comment = '') => {
    if (hasRated()) return { error: 'already_rated' };
    setLoading(true);
    const { error } = await supabase
      .from('ratings')
      .insert({ product_id: String(productId), stars, comment });
    if (!error) {
      const rated = JSON.parse(localStorage.getItem(RATED_KEY) || '{}');
      rated[productId] = stars;
      localStorage.setItem(RATED_KEY, JSON.stringify(rated));
      await fetchRating();
    }
    setLoading(false);
    return { error };
  }, [productId, hasRated, fetchRating]);

  return { averageRating, ratingCount, loading, submitRating, hasRated };
};

// Fetcha tutti i rating in un'unica query (usato in HomePage)
export const useAllRatings = () => {
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    supabase.from('ratings').select('product_id, stars').then(({ data }) => {
      if (!data) return;
      const grouped = {};
      data.forEach(r => {
        if (!grouped[r.product_id]) grouped[r.product_id] = [];
        grouped[r.product_id].push(r.stars);
      });
      const result = {};
      Object.entries(grouped).forEach(([pid, stars]) => {
        result[pid] = {
          avg: Math.round((stars.reduce((a, b) => a + b, 0) / stars.length) * 10) / 10,
          count: stars.length
        };
      });
      setRatings(result);
    });
  }, []);

  return ratings;
};
