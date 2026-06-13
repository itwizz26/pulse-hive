import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { theme } from '../theme';

export default function LoginScreen({ navigation }) {
  const [tenantId, setTenantId] = useState('demo-tenant');

  const handleContinue = () => {
    navigation.replace('Main', { tenantId });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.backgroundGlow} />
      <View style={styles.backgroundGlow2} />
      <View style={styles.content}>
        <View style={styles.brandRow}>
          <View style={styles.brandBadge}><Text style={styles.brandBadgeText}>PH</Text></View>
          <Text style={styles.brandLabel}>PulseHive</Text>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>Premium operations</Text>
          <Text style={styles.title}>A beautiful command center for field teams.</Text>
          <Text style={styles.subtitle}>Capture orders, log payment proofs, and reconcile performance with a premium glassmorphic workspace designed to feel effortless.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Enter your tenant</Text>
          <Text style={styles.cardCopy}>Demo mode is ready to use — just tap continue to enter the dashboard.</Text>
          <TextInput
            value={tenantId}
            onChangeText={setTenantId}
            style={styles.input}
            placeholder="demo-tenant"
            placeholderTextColor="#94a3b8"
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
            <Text style={styles.primaryButtonText}>Continue to dashboard</Text>
          </TouchableOpacity>
          <View style={styles.infoPill}><Text style={styles.infoPillText}>Secure, elegant, fast — no real auth required for the demo journey.</Text></View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  backgroundGlow: { position: 'absolute', top: -50, right: -60, width: 180, height: 180, borderRadius: 90, backgroundColor: theme.colors.accentSoft },
  backgroundGlow2: { position: 'absolute', left: -80, bottom: 80, width: 200, height: 200, borderRadius: 100, backgroundColor: theme.colors.accentGlow },
  content: { flex: 1, padding: 18, justifyContent: 'center' },
  brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  brandBadge: { width: 42, height: 42, borderRadius: 12, backgroundColor: 'rgba(139, 92, 246, 0.22)', borderWidth: 1, borderColor: 'rgba(192, 132, 252, 0.35)', alignItems: 'center', justifyContent: 'center' },
  brandBadgeText: { color: '#ede9fe', fontWeight: '800', letterSpacing: 1 },
  brandLabel: { color: '#fff', fontSize: 18, fontWeight: '700', marginLeft: 10 },
  heroCard: { backgroundColor: theme.colors.surface, borderRadius: 28, borderWidth: 1, borderColor: theme.colors.border, padding: 18, marginBottom: 14 },
  eyebrow: { color: theme.colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.4, fontSize: 11 },
  title: { color: theme.colors.text, fontSize: 30, fontWeight: '800', marginTop: 6 },
  subtitle: { color: theme.colors.textMuted, marginTop: 8, lineHeight: 20 },
  card: { backgroundColor: theme.colors.surfaceElevated, borderRadius: 28, borderWidth: 1, borderColor: theme.colors.border, padding: 16 },
  cardTitle: { color: theme.colors.text, fontSize: 18, fontWeight: '700', marginBottom: 4 },
  cardCopy: { color: theme.colors.textSoft, fontSize: 13, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, color: theme.colors.text, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 12, marginBottom: 10 },
  primaryButton: { backgroundColor: theme.colors.accent, borderRadius: 16, paddingVertical: 12, alignItems: 'center' },
  primaryButtonText: { color: theme.colors.text, fontWeight: '800', fontSize: 15 },
  infoPill: { marginTop: 10, backgroundColor: theme.colors.accentSoft, borderRadius: 14, borderWidth: 1, borderColor: theme.colors.borderStrong, padding: 10 },
  infoPillText: { color: theme.colors.text, fontSize: 12 },
});
