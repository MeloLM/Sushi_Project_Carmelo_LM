import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const DEVICE_ID_KEY = 'sushiDeviceId';

export const getDeviceId = () => {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
};

export const getLevel = (points) => {
  if (points >= 500) return { name: 'Gold', emoji: '🥇', color: '#FFD700', next: null };
  if (points >= 100) return { name: 'Silver', emoji: '🥈', color: '#C0C0C0', next: 500 };
  return { name: 'Bronze', emoji: '🥉', color: '#CD7F32', next: 100 };
};

export const useSushiPoints = () => {
  const [points, setPoints] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const deviceId = getDeviceId();

  useEffect(() => {
    supabase
      .from('user_points')
      .select('total_points, total_orders')
      .eq('device_id', deviceId)
      .single()
      .then(({ data }) => {
        if (data) {
          setPoints(data.total_points);
          setTotalOrders(data.total_orders);
        }
      });
  }, [deviceId]);

  const addPoints = useCallback(async (earned) => {
    const { data: existing } = await supabase
      .from('user_points')
      .select('total_points, total_orders')
      .eq('device_id', deviceId)
      .single();

    if (existing) {
      const newPoints = existing.total_points + earned;
      const newOrders = existing.total_orders + 1;
      await supabase
        .from('user_points')
        .update({ total_points: newPoints, total_orders: newOrders, updated_at: new Date().toISOString() })
        .eq('device_id', deviceId);
      setPoints(newPoints);
      setTotalOrders(newOrders);
    } else {
      await supabase
        .from('user_points')
        .insert({ device_id: deviceId, total_points: earned, total_orders: 1 });
      setPoints(earned);
      setTotalOrders(1);
    }
  }, [deviceId]);

  return { points, totalOrders, addPoints, level: getLevel(points) };
};
