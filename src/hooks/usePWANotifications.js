import { useState, useEffect, useCallback } from 'react';

export const usePWANotifications = () => {
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    if ('Notification' in window) setPermission(Notification.permission);
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return 'unsupported';
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  const sendNotification = useCallback((title, options = {}) => {
    if (permission !== 'granted') return;
    new Notification(title, { icon: '/logo192.png', ...options });
  }, [permission]);

  const sendOrderNotification = useCallback((orderNumber, estimatedTime) => {
    sendNotification('Ordine Confermato! 🍣', {
      body: `Ordine ${orderNumber} in preparazione. Consegna stimata: ${estimatedTime} minuti.`,
      tag: 'order-confirmed'
    });
  }, [sendNotification]);

  return { permission, requestPermission, sendNotification, sendOrderNotification };
};
