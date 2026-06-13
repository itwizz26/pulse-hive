import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const envApiUrl = Constants.expoConfig?.extra?.apiUrl;
const defaultApiUrl = Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';
const API_BASE = Platform.OS === 'android' && envApiUrl === 'http://localhost:4000'
  ? defaultApiUrl
  : (envApiUrl || defaultApiUrl);

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
});

export async function fetchOrders(tenantId) {
  const res = await api.get('/orders?tenantId=' + tenantId);
  return res.data;
}

export async function fetchPayments(tenantId) {
  const res = await api.get('/payments?tenantId=' + tenantId);
  return res.data;
}

export async function createOrder(tenantId, payload) {
  const res = await api.post('/orders', { tenantId, ...payload });
  return res.data;
}

export async function createPayment(tenantId, payload) {
  const res = await api.post('/payments', { tenantId, ...payload });
  return res.data;
}

export async function matchPayment(paymentId, orderId) {
  const res = await api.post(`/payments/${paymentId}/match/${orderId}`);
  return res.data;
}
