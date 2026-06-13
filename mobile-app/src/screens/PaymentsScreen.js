import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { fetchPayments, createPayment } from '../api';
import { theme } from '../theme';

export default function PaymentsScreen({ tenantId }) {
  const [payments, setPayments] = useState([]);
  const [customerName, setCustomerName] = useState('Demo Customer');
  const [amount, setAmount] = useState('100');
  const [reference, setReference] = useState('PAY-001');

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const data = await fetchPayments(tenantId);
      setPayments(data);
    } catch (e) {
      console.warn(e.message);
    }
  }

  async function handleCreatePayment() {
    if (!customerName.trim()) {
      Alert.alert('Missing customer name');
      return;
    }

    try {
      const created = await createPayment(tenantId, {
        customerName,
        amount: Number(amount) || 0,
        reference,
      });
      setPayments(prev => [created, ...prev]);
      Alert.alert('Payment logged', `Reference: ${created.reference || '—'}`);
    } catch (e) {
      Alert.alert('Could not log payment', e.message || 'Please try again');
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <View>
        <Text style={styles.cust}>{item.customerName}</Text>
        <Text style={styles.ref}>Ref: {item.reference || '—'}</Text>
      </View>
      <View>
        <Text style={styles.amount}>R {item.amount}</Text>
        <Text style={{ color: item.matched ? '#10b981' : '#f59e0b' }}>{item.matched ? 'Matched' : 'Unmatched'}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Text style={styles.eyebrow}>Tenant</Text>
          <Text style={styles.tenantId}>{tenantId}</Text>
          <Text style={styles.helper}>Log payment proofs and reconcile them in the field.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>New payment</Text>
          <TextInput style={styles.input} value={customerName} onChangeText={setCustomerName} placeholder="Customer name" />
          <TextInput style={styles.input} value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="Amount" />
          <TextInput style={styles.input} value={reference} onChangeText={setReference} placeholder="Reference" />
          <Button title="Log payment" onPress={handleCreatePayment} />
        </View>

        <View style={styles.toolbar}>
          <Text style={styles.sectionTitle}>Recent payments</Text>
          <Button title="Refresh" onPress={load} />
        </View>

        <FlatList
          data={payments}
          keyExtractor={p => p.id}
          renderItem={renderItem}
          scrollEnabled={false}
          contentContainerStyle={styles.list}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 12, paddingBottom: 24 },
  headerCard: { backgroundColor: theme.colors.surfaceElevated, borderRadius: 18, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: theme.colors.border },
  eyebrow: { color: theme.colors.textMuted, textTransform: 'uppercase', fontSize: 11, letterSpacing: 1 },
  tenantId: { color: theme.colors.text, fontSize: 18, fontWeight: '700', marginTop: 4 },
  helper: { color: theme.colors.textMuted, marginTop: 6 },
  card: { backgroundColor: theme.colors.surface, borderRadius: 18, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: theme.colors.border, shadowColor: theme.colors.accent, shadowOpacity: 0.12, shadowRadius: 8, elevation: 3 },
  cardTitle: { color: theme.colors.text, fontSize: 16, fontWeight: '700', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceElevated, color: theme.colors.text, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 8 },
  toolbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  sectionTitle: { color: theme.colors.text, fontSize: 16, fontWeight: '700' },
  list: { paddingBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1, borderColor: 'rgba(148, 163, 184, 0.12)', backgroundColor: theme.colors.surfaceElevated, borderRadius: 12, marginBottom: 6 },
  cust: { color: theme.colors.text, fontWeight: '700' },
  ref: { color: theme.colors.textMuted },
  amount: { color: theme.colors.text, fontWeight: '700' },
});
