import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { feeService } from '../features/services/index';
import client from '../api/index';
import { IndianRupee, CreditCard, Smartphone, Building2, CheckCircle2, X } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthUseContext';
import type { Payment } from '../types/feeInterface';
import FlightLoader from '../components/FlightLoader';

export default function FeesScreen() {
  const { studentUuid } = useAuth();
  const [totalFees, setTotalFees] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [admissionFees, setAdmissionFees] = useState(0);
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const fetchFeesData = async (isRefresh = false) => {
    if (!studentUuid) return;
    if (isRefresh) {
      setRefreshing(true);
    }
    try {
      const data = await feeService(studentUuid);
      if (data) {
        setTotalFees(data.total_fees || 0);
        setPaidAmount(data.paid_amount || 0);
        setPendingAmount(data.pending_amount || 0);
        setAdmissionFees(data.admission_fees || 0);
        setPaymentHistory(data.records || []);
      }
    } catch (err) {
      console.log('Error fetching fees:', err);
      Alert.alert('Load Error', 'Unable to retrieve fees details.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (studentUuid) {
      fetchFeesData();
    }
  }, [studentUuid]);

  const handleRefresh = () => {
    fetchFeesData(true);
  };

  const handleSimulatePayment = async (method: string) => {
    setPaymentProcessing(true);
    try {
      const order = await client.payment.create({ amount: 500 });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockResponse = {
        razorpay_order_id: order.id,
        razorpay_payment_id: `pay_${Math.random().toString(36).substring(2, 11)}`,
        razorpay_signature: 'simulated_sig_verification_success_2026',
        success: true
      };

      const verifyRes = await client.payment.verify(mockResponse);

      if (verifyRes.success) {
        setPaidAmount((prev) => prev + pendingAmount);
        setPendingAmount(0);

        const newRecord: Payment = {
          amount: verifyRes.data?.amount || pendingAmount,
          date: verifyRes.data?.createdAt || new Date().toISOString(),
          paymentpurpose: verifyRes.data?.paymentPerpose || 'Tuition Fee Payment',
          transaction_id: verifyRes.data?.receiptNumber || mockResponse.razorpay_payment_id
        };
        setPaymentHistory((prev) => [newRecord, ...prev]);

        Alert.alert('Payment Successful', `Your fees of Rs. ${pendingAmount.toLocaleString('en-IN')} has been received!`);
        setCheckoutVisible(false);
      } else {
        Alert.alert('Payment Failed', 'Verification failed on backend.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Payment Error', 'Unable to complete checkout simulation.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]} edges={['bottom']}>
        <FlightLoader size="large" message="Loading balance sheet..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#2563eb']}
            tintColor="#2563eb"
            title="Refreshing fees..."
            titleColor="#64748b"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Fees Management</Text>
          <Text style={styles.subtitle}>View your tuition logs, outstanding dues, and ledger receipts.</Text>
        </View>

        {/* Balance Overview Grid */}
        <View style={styles.grid}>
          <View style={styles.gridRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Total Tuition</Text>
              <Text style={styles.metricValue}>₹{totalFees.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Admission Fees</Text>
              <Text style={styles.metricValue}>₹{admissionFees.toLocaleString('en-IN')}</Text>
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={[styles.metricCard, styles.paidCard]}>
              <Text style={[styles.metricLabel, styles.paidLabel]}>Amount Paid</Text>
              <Text style={[styles.metricValue, styles.paidValue]}>₹{paidAmount.toLocaleString('en-IN')}</Text>
            </View>
            <View style={[styles.metricCard, pendingAmount > 0 ? styles.dueCard : {}]}>
              <Text style={[styles.metricLabel, pendingAmount > 0 ? styles.dueLabel : {}]}>Outstanding</Text>
              <Text style={[styles.metricValue, pendingAmount > 0 ? styles.dueValue : {}]}>₹{pendingAmount.toLocaleString('en-IN')}</Text>
            </View>
          </View>
        </View>

        {/* Due Warning Panel */}
        {pendingAmount > 0 && (
          <View style={styles.alertPanel}>
            <View style={styles.alertInfo}>
              <Text style={styles.alertTitle}>Tuition Dues Outstanding</Text>
              <Text style={styles.alertDesc}>
                You have a pending balance of <Text style={{ fontWeight: '800' }}>₹{pendingAmount.toLocaleString('en-IN')}</Text>. Please clear it to avoid account locking.
              </Text>
            </View>
            <TouchableOpacity style={styles.payButton} onPress={() => setCheckoutVisible(true)}>
              <IndianRupee size={12} color="#ffffff" style={{ marginRight: 4 }} />
              <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Payment History */}
        <Text style={styles.sectionTitle}>Transaction History</Text>
        {paymentHistory && paymentHistory.length > 0 ? (
          paymentHistory.map((item, index) => (
            <View key={item.transaction_id || index} style={styles.historyCard}>
              <View style={styles.historyMeta}>
                <View style={styles.receiptIcon}>
                  <CheckCircle2 size={16} color="#059669" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.receiptPurpose}>{item.paymentpurpose || 'Tution Fee'}</Text>
                  <Text style={styles.receiptDate}>Date: {new Date(item.date).toLocaleDateString('en-IN')}</Text>
                  <Text style={styles.receiptId}>TXN: {item.transaction_id}</Text>
                </View>
              </View>
              <Text style={styles.receiptAmount}>+₹{item.amount.toLocaleString('en-IN')}</Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No transactions found.</Text>
          </View>
        )}
      </ScrollView>

      {/* Checkout Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={checkoutVisible}
        onRequestClose={() => {
          if (!paymentProcessing) setCheckoutVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Choose Payment Method</Text>
                <Text style={styles.modalSubtitle}>Settle outstanding fee of ₹{pendingAmount.toLocaleString('en-IN')}</Text>
              </View>
              {!paymentProcessing && (
                <TouchableOpacity onPress={() => setCheckoutVisible(false)}>
                  <X size={20} color="#64748b" />
                </TouchableOpacity>
              )}
            </View>

            {paymentProcessing ? (
              <View style={styles.processingContainer}>
                <FlightLoader size="medium" message="Processing transaction securely..." />
              </View>
            ) : (
              <View style={styles.methodsList}>
                <TouchableOpacity style={styles.methodButton} onPress={() => handleSimulatePayment('card')}>
                  <View style={[styles.methodIconBg, { backgroundColor: '#e0e7ff' }]}>
                    <CreditCard size={20} color="#4f46e5" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.methodTitle}>Credit / Debit Card</Text>
                    <Text style={styles.methodSubtitle}>Visa, MasterCard, or RuPay</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.methodButton} onPress={() => handleSimulatePayment('upi')}>
                  <View style={[styles.methodIconBg, { backgroundColor: '#ccfbf1' }]}>
                    <Smartphone size={20} color="#0d9488" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.methodTitle}>UPI Transfer</Text>
                    <Text style={styles.methodSubtitle}>Google Pay, PhonePe, Paytm</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.methodButton} onPress={() => handleSimulatePayment('bank')}>
                  <View style={[styles.methodIconBg, { backgroundColor: '#dcfce7' }]}>
                    <Building2 size={20} color="#16a34a" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.methodTitle}>Net Banking</Text>
                    <Text style={styles.methodSubtitle}>Direct bank NEFT/RTGS transfer</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 20,
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 4,
    lineHeight: 16,
  },
  grid: {
    gap: 12,
    marginBottom: 20,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.01,
    shadowRadius: 6,
    elevation: 1,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    marginTop: 6,
  },
  paidCard: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  paidLabel: {
    color: '#166534',
  },
  paidValue: {
    color: '#15803d',
  },
  dueCard: {
    backgroundColor: '#fef2f2',
    borderColor: '#fee2e2',
  },
  dueLabel: {
    color: '#991b1b',
  },
  dueValue: {
    color: '#b91c1c',
  },
  alertPanel: {
    backgroundColor: '#fff5f5',
    borderColor: '#fee2e2',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  alertInfo: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#991b1b',
    marginBottom: 2,
  },
  alertDesc: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '600',
    lineHeight: 15,
  },
  payButton: {
    backgroundColor: '#e11d48',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#e11d48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  payButtonText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 12,
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.01,
    shadowRadius: 4,
    elevation: 1,
  },
  historyMeta: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
    marginRight: 12,
  },
  receiptIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiptPurpose: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  receiptDate: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 2,
  },
  receiptId: {
    fontSize: 9,
    color: '#94a3b8',
    fontWeight: '500',
    marginTop: 1,
  },
  receiptAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#15803d',
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    minHeight: 280,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 2,
  },
  processingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  methodsList: {
    gap: 12,
  },
  methodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    gap: 14,
  },
  methodIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  methodSubtitle: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: 1,
  },
});
