import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import CartPageProductCard from './CartPageProductCard'; 
import HeaderComponent from './HeaderComponent'; 


const PaymentScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Header */}
      <HeaderComponent title="Payment" />

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Info Card 1 */}
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Shipping Address</Text>
            <Text style={styles.cardText}>
              Magadi Main Rd, next to Prasanna Theatre, Cholourpalya, Bengaluru, Karnataka 560023
            </Text>
          </View>
          <TouchableOpacity>
            <Icon name="edit-2" size={20} color="#D45A8C" />
          </TouchableOpacity>
        </View>

        {/* Info Card 2 */}
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Contact Information</Text>
            <Text style={styles.cardText}>+91987654321</Text>
            <Text style={styles.cardText}>gmail@example.com</Text>
          </View>
          <TouchableOpacity>
            <Icon name="edit-2" size={20} color="#D45A8C" />
          </TouchableOpacity>
        </View>

        {/* Product Card */}
        <CartPageProductCard />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.deliveryBanner}>
          <Icon name="truck" size={20} color="#1E40AF" style={{ marginRight: 8 }} />
          <Text style={styles.deliveryText}>Yayy! FREE delivery on this order!</Text>
        </View>
        <View style={styles.paymentBar}>
          <View>
            <Text style={styles.totalPrice}>₹699 <Text style={styles.shippingFee}>+99</Text></Text>
            <TouchableOpacity>
              <Text style={styles.viewDetails}>VIEW DETAILS</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.payButton}>
            <Text style={styles.payButtonText}>PAY</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#d13b83',
    paddingHorizontal: 16,
    paddingVertical: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    paddingTop: 60,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginHorizontal: 8,
  },
  scrollView: {
    backgroundColor: '#F3F4F6',
  },
  scrollViewContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 0,
  },
  cardContent: {
    flex: 1,
    marginRight: 16,
  },
  cardTitle: {
    fontSize: 16,
    color: '#D45A8C',
    fontWeight: '700',
  },
  cardText: {
    fontSize: 12,
    color: '#6E6E6E',
    marginTop: 4,
  },
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  deliveryBanner: {
    backgroundColor: '#EFF6FF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  deliveryText: {
    color: '#1E40AF',
    fontSize: 14,
  },
  paymentBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  shippingFee: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#6B7280',
  },
  viewDetails: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d13b83',
    marginTop: 2,
  },
  payButton: {
    backgroundColor: '#d13b83',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
