import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from './DashboardScreen';
import OrdersScreen from './OrdersScreen';
import PaymentsScreen from './PaymentsScreen';
import ReconciliationScreen from './ReconciliationScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs({ navigation, route }) {
  const { tenantId } = route.params || { tenantId: 'demo-tenant' };

  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: '#08111f', shadowColor: 'transparent' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
            style={styles.logoutButton}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        ),
        tabBarStyle: {
          backgroundColor: 'rgba(8, 15, 28, 0.95)',
          borderTopColor: 'rgba(148, 163, 184, 0.12)',
          paddingTop: 6,
          height: 68,
        },
        tabBarActiveTintColor: '#8b5cf6',
        tabBarInactiveTintColor: '#cbd5e1',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      })}
    >
      <Tab.Screen name="Dashboard" options={{ title: 'Dashboard' }}>
        {props => <DashboardScreen {...props} tenantId={tenantId} />}
      </Tab.Screen>
      <Tab.Screen name="Orders" options={{ title: 'Orders' }}>
        {props => <OrdersScreen {...props} tenantId={tenantId} />}
      </Tab.Screen>
      <Tab.Screen name="Payments" options={{ title: 'Payments' }}>
        {props => <PaymentsScreen {...props} tenantId={tenantId} />}
      </Tab.Screen>
      <Tab.Screen name="Reconciliation" options={{ title: 'Reconcile' }}>
        {props => <ReconciliationScreen {...props} tenantId={tenantId} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  logoutButton: { marginRight: 12, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: 'rgba(139, 92, 246, 0.16)', borderWidth: 1, borderColor: 'rgba(192, 132, 252, 0.22)' },
  logoutText: { color: '#efe6ff', fontWeight: '700', fontSize: 12 },
});
