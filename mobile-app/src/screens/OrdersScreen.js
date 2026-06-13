import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { fetchOrders, createOrder } from '../api';
import { theme } from '../theme';

export default function OrdersScreen({ tenantId }) {
  const [orders, setOrders] = useState([]);
  const [customerName, setCustomerName] = useState('Demo Customer');
  const [phone, setPhone] = useState('0812345678');
  const [address, setAddress] = useState('12 Main Road');
  const [quantity, setQuantity] = useState('1');
  const [totalAmount, setTotalAmount] = useState('150');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await fetchOrders(tenantId);
      setOrders(data);
    } catch (e) {
      console.warn(e.message);
    }
  }

  async function handleCreateOrder() {
    if (!customerName.trim()) {
      Alert.alert('Missing customer name');
      return;
    }

    try {
      const created = await createOrder(tenantId, {
        customerName,
        phone,
        address,
        quantity: Number(quantity) || 1,
        totalAmount: Number(totalAmount) || 0,
        status: 'Pending Payment',
      });
      setOrders(prev => [created, ...prev]);
      Alert.alert('Order created', `Reference: ${created.reference}`);
    } catch (e) {
      Alert.alert('Could not create order', e.message || 'Please try again');
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <View>
        <Text style={styles.ref}>{item.reference}</Text>
        <Text style={styles.name}>{item.customerName}</Text>
      </View>
      <View>
        <Text style={styles.amount}>R {item.totalAmount}</Text>
        <Text style={styles.status}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Text style={styles.eyebrow}>Tenant</Text>
          <Text style={styles.tenantId}>{tenantId}</Text>
          <Text style={styles.helper}>Create an order directly from the mobile app.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>New order</Text>
          <TextInput style={styles.input} value={customerName} onChangeText={setCustomerName} placeholder="Customer name" />
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Phone" />
          <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Address" />
          <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} keyboardType="numeric" placeholder="Quantity" />
          <TextInput style={styles.input} value={totalAmount} onChangeText={setTotalAmount} keyboardType="decimal-pad" placeholder="Total amount" />
          <Button title="Create order" onPress={handleCreateOrder} />
        </View>

        <View style={styles.toolbar}>
          <Text style={styles.sectionTitle}>Recent orders</Text>
          <Button title="Refresh" onPress={load} />
        </View>

        <FlatList
          data={orders}
          keyExtractor={o => o.id}
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
  ref: { color: theme.colors.text, fontWeight: '700' },
  name: { color: theme.colors.textMuted },
  amount: { color: theme.colors.text, fontWeight: '700' },
  status: { color: '#c4b5fd' },
});
