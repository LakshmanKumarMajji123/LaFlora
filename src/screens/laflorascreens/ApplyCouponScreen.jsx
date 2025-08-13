import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert
} from 'react-native';
import HeaderComponent from './HeaderComponent';


const ApplyCouponScreen = () => {
  const [couponCode, setCouponCode] = useState('');
  const [message, setMessage] = useState('');
  const [isValid, setIsValid] = useState(null);

  const dummyCoupons = [
    { id: '1', code: 'SAVE5', description: 'Get 5% off on your order' },
    { id: '2', code: 'SAVE10', description: 'Get 10% off on your order'},
    { id: '3', code: 'SAVE15', description: 'Get 15% off on your order' },
  ]; 
  const handleApplyCoupon = () => {
    // Simulated coupon validation
    const matchedCoupon = dummyCoupons.find(c => c.code.toLowerCase() === couponCode.toLowerCase());
    if (matchedCoupon) {
      setIsValid(true);
      setMessage(`Coupon "${matchedCoupon.code}" applied successfully!`);
    } else {
      setIsValid(false);
      setMessage('Invalid coupon code. Please try again.');
    }
  };

  const handleSelectCoupon = (code) => {
    setCouponCode(code);
  };

  return (  
    <>
    <HeaderComponent title="Apply Coupon" />

    <View style={styles.container}>
      
      <Text style={styles.title}>Apply Coupon</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter coupon code" 
        value={couponCode}
        onChangeText={setCouponCode}
      />

      <TouchableOpacity style={styles.applyButton} onPress={handleApplyCoupon}>
        <Text style={styles.applyButtonText}>Apply</Text>
      </TouchableOpacity>

      {message !== '' && (
        <Text style={[styles.message, isValid ? styles.success : styles.error]}>
          {message}
        </Text>
      )}

      <Text style={styles.availableText}>Available Coupons:</Text>

      <FlatList
        data={dummyCoupons}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.couponCard} onPress={() => handleSelectCoupon(item.code)}>
            <Text style={styles.couponCode}>{item.code}</Text>
            <Text style={styles.couponDesc}>{item.description}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
    </>
  );
};

export default ApplyCouponScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 25,
  },
  applyButton: {
    backgroundColor: '#D45A8C',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  success: {
    color: 'green',
  },
  error: {
    color: 'red',
  },
  availableText: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 10,
  },
  couponCard: {
    backgroundColor: '#f8f8f8ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  couponCode: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  couponDesc: {
    fontSize: 14,
    color: '#555',
  },
});
