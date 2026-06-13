import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, ScrollView } from 'react-native';
import { fetchOrders, fetchPayments } from '../api';
import { theme } from '../theme';

export default function ReconciliationScreen({ tenantId }) {
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const [o, p] = await Promise.all([fetchOrders(tenantId), fetchPayments(tenantId)]);
      setOrders(o);
      setPayments(p);
    } catch (e) { console.warn(e.message); }
  }

  const unmatchedPayments = payments.filter(x => !x.matched);
  const pendingOrders = orders.filter(x => x.status === 'Pending Payment');

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>Reconciliation</Text>
          <Text style={styles.title}>Keep payment proof and order flow aligned.</Text>
          <Text style={styles.helper}>Use the live queue to spot unmatched payments and pending orders quickly.</Text>
        </View>

        <View style={styles.card}>
          <Button title="Refresh" onPress={load} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Unmatched Payments ({unmatchedPayments.length})</Text>
          <FlatList data={unmatchedPayments} keyExtractor={p => p.id} scrollEnabled={false} renderItem={({item}) => (
            <View style={styles.row}>
              <Text style={styles.rowText}>{item.customerName} — R {item.amount}</Text>
            </View>
          )} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Pending Orders ({pendingOrders.length})</Text>
          <FlatList data={pendingOrders} keyExtractor={o => o.id} scrollEnabled={false} renderItem={({item}) => (
            <View style={styles.row}>
              <Text style={styles.rowText}>{item.reference} — {item.customerName} — R {item.totalAmount}</Text>
            </View>
          )} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 12, paddingBottom: 24 },
  heroCard: { backgroundColor: theme.colors.surfaceElevated, borderRadius: 18, borderWidth: 1, borderColor: theme.colors.border, padding: 14, marginBottom: 12 },
  eyebrow: { color: theme.colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, fontSize: 11 },
  title: { color: theme.colors.text, fontSize: 18, fontWeight: '700', marginTop: 4 },
  helper: { color: theme.colors.textMuted, marginTop: 6 },
  card: { backgroundColor: theme.colors.surface, borderRadius: 18, borderWidth: 1, borderColor: theme.colors.border, padding: 12, marginBottom: 12 },
  sectionTitle: { color: theme.colors.text, fontSize: 16, fontWeight: '700', marginBottom: 6 },
  row: { paddingVertical: 10, borderBottomWidth: 1, borderColor: 'rgba(148, 163, 184, 0.12)' },
  rowText: { color: theme.colors.text, fontWeight: '600' },
});
