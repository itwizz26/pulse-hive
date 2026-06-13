import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { fetchOrders, fetchPayments } from '../api';
import { theme } from '../theme';

export default function DashboardScreen({ tenantId }) {
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [o, p] = await Promise.all([fetchOrders(tenantId), fetchPayments(tenantId)]);
        if (mounted) {
          setOrders(o || []);
          setPayments(p || []);
        }
      } catch (e) {
        console.warn(e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [tenantId]);

  const summary = useMemo(() => {
    const revenue = payments.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const matched = payments.filter(item => item.matched).length;
    const unmatched = payments.length - matched;
    const pending = orders.filter(item => item.status === 'Pending Payment').length;
    const ready = orders.filter(item => item.status === 'Ready to Ship').length;

    return { revenue, matched, unmatched, pending, ready, totalOrders: orders.length, totalPayments: payments.length };
  }, [orders, payments]);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>PulseHive Command Center</Text>
          <Text style={styles.title}>Premium field operations, in one glance.</Text>
          <Text style={styles.subtitle}>Track orders, reconcile payments, and stay ahead of every delivery window.</Text>
          <View style={styles.pillRow}>
            <View style={styles.pill}><Text style={styles.pillText}>Live tenant: {tenantId}</Text></View>
            <View style={styles.pill}><Text style={styles.pillText}>Sync ready</Text></View>
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.metricCard}><Text style={styles.metricLabel}>Orders</Text><Text style={styles.metricValue}>{summary.totalOrders}</Text><Text style={styles.metricHint}>Active records</Text></View>
          <View style={styles.metricCard}><Text style={styles.metricLabel}>Payments</Text><Text style={styles.metricValue}>{summary.totalPayments}</Text><Text style={styles.metricHint}>Captured this week</Text></View>
          <View style={styles.metricCard}><Text style={styles.metricLabel}>Matched</Text><Text style={styles.metricValue}>{summary.matched}</Text><Text style={styles.metricHint}>Fully reconciled</Text></View>
          <View style={styles.metricCard}><Text style={styles.metricLabel}>Revenue</Text><Text style={styles.metricValue}>R {summary.revenue.toFixed(2)}</Text><Text style={styles.metricHint}>Across all payments</Text></View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Operational pulse</Text>
          <View style={styles.rowStat}><Text style={styles.rowLabel}>Pending payment orders</Text><Text style={styles.rowValue}>{summary.pending}</Text></View>
          <View style={styles.rowStat}><Text style={styles.rowLabel}>Ready to ship</Text><Text style={styles.rowValue}>{summary.ready}</Text></View>
          <View style={styles.rowStat}><Text style={styles.rowLabel}>Unmatched payments</Text><Text style={styles.rowValue}>{summary.unmatched}</Text></View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Highlights</Text>
          <View style={styles.highlightChip}><Text style={styles.highlightText}>• AI-style matching signals are ready for your next reconciliation pass.</Text></View>
          <View style={styles.highlightChip}><Text style={styles.highlightText}>• Offline-first workflows are primed for field teams moving between sites.</Text></View>
          <View style={styles.highlightChip}><Text style={styles.highlightText}>• Premium glassmorphic cards keep every critical action within reach.</Text></View>
        </View>

        {loading ? <ActivityIndicator style={{ marginTop: 12 }} /> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 16, paddingBottom: 28 },
  heroCard: { backgroundColor: theme.colors.surface, borderRadius: 28, padding: 18, borderWidth: 1, borderColor: theme.colors.border, shadowColor: theme.colors.accent, shadowOpacity: 0.16, shadowRadius: 18, elevation: 4 },
  eyebrow: { color: theme.colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.5, fontSize: 11 },
  title: { color: theme.colors.text, fontSize: 28, fontWeight: '800', marginTop: 6 },
  subtitle: { color: theme.colors.textMuted, marginTop: 8, lineHeight: 20 },
  pillRow: { flexDirection: 'row', gap: 8, marginTop: 14, flexWrap: 'wrap' },
  pill: { backgroundColor: theme.colors.accentSoft, borderColor: theme.colors.borderStrong, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 999 },
  pillText: { color: theme.colors.text, fontSize: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 14 },
  metricCard: { width: '48%', backgroundColor: theme.colors.surfaceElevated, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 22, padding: 14, marginBottom: 12 },
  metricLabel: { color: theme.colors.textSoft, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  metricValue: { color: theme.colors.text, fontSize: 24, fontWeight: '800', marginTop: 6 },
  metricHint: { color: theme.colors.textMuted, marginTop: 4, fontSize: 12 },
  sectionCard: { backgroundColor: theme.colors.surfaceElevated, borderRadius: 24, borderWidth: 1, borderColor: theme.colors.border, padding: 14, marginTop: 12 },
  sectionTitle: { color: theme.colors.text, fontSize: 16, fontWeight: '700', marginBottom: 8 },
  rowStat: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(148, 163, 184, 0.12)' },
  rowLabel: { color: theme.colors.textMuted },
  rowValue: { color: '#c4b5fd', fontWeight: '700' },
  highlightChip: { backgroundColor: theme.colors.accentSoft, borderWidth: 1, borderColor: theme.colors.borderStrong, borderRadius: 14, padding: 10, marginBottom: 8 },
  highlightText: { color: theme.colors.text, fontSize: 13, lineHeight: 18 },
});
