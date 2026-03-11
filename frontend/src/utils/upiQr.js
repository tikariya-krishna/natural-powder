import { useEffect, useState } from 'react';
import { api } from '../services/api.js';

/** Build UPI payment URL for QR code. Amount in rupees. */
export const buildUpiUrl = (upiId, payeeName, amount, orderNote) => {
  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName || 'Merchant',
    am: amount.toFixed(2),
    cu: 'INR',
    tn: orderNote || 'Order payment',
  });
  return `upi://pay?${params.toString()}`;
};

/**
 * React hook to fetch UPI config from backend.
 * Falls back to Vite env vars if API fails.
 */
export const useUpiConfig = () => {
  const [state, setState] = useState({
    upiId: '',
    upiName: import.meta.env.VITE_UPI_NAME || 'Prkriti Organics',
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    api
      .get('/credentials/upi')
      .then((res) => {
        if (cancelled) return;
        const data = res.data || {};
        setState({
          upiId: data.upiId || import.meta.env.VITE_UPI_ID || '',
          upiName: data.upiName || import.meta.env.VITE_UPI_NAME || 'Prkriti Organics',
          loading: false,
          error: null,
        });
      })
      .catch(() => {
        if (cancelled) return;
        setState({
          upiId: import.meta.env.VITE_UPI_ID || '',
          upiName: import.meta.env.VITE_UPI_NAME || 'Prkriti Organics',
          loading: false,
          error: 'Could not load UPI settings from server.',
        });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
};

