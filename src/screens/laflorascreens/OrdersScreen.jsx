import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import HeaderComponent from './HeaderComponent';

const orders = [
  {
    id: 'ORD123456-A',
    date: '2025-07-04',
    total: 1299,
    image: require('../laflorascreens/assets/product1.png'),
  },
  {
    id: 'ORD123457-B',
    date: '2025-07-06',
    total: 699,
    image: require('../laflorascreens/assets/product2.png'),
  },
  {
    id: 'ORD123458-C',
    date: '2025-07-01',
    total: 999,
    image: require('../laflorascreens/assets/product3.png'),
  },
  {
    id: 'ORD123459-D',
    date: '2025-07-04',
    total: 1299,
    image: require('../laflorascreens/assets/product1.png'),
  },
  {
    id: 'ORD123460-E',
    date: '2025-07-06',
    total: 699,
    image: require('../laflorascreens/assets/product2.png'),
  },
  {
    id: 'ORD123461-F',
    date: '2025-07-01',
    total: 999,
    image: require('../laflorascreens/assets/product3.png'),
  },
];

const OrdersScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <HeaderComponent title="Orders" />

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {orders.length === 0 ? (
          <Text style={styles.emptyText}>You have no orders yet.</Text>
        ) : (
          orders.map((order, index) => (
            <View key={index} style={styles.card}>
              <TouchableOpacity
                onPress={() => navigation.navigate('OrderDetailsScreen')}>
                <View style={styles.row}>
                  <Image source={order.image} style={styles.image} />
                  <View style={styles.info}>
                    <Text style={styles.orderId}>Order ID: {order.id}</Text>
                    <Text style={styles.orderDate}>Date: {order.date}</Text>
                    <Text style={styles.orderTotal}>Total: ₹{order.total}</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.trackBtn}
                onPress={() => navigation.navigate('OrderDetailsScreen')}>
                <Text style={styles.trackText}>View Details</Text>
                <Icon name="chevron-right" size={18} color="#D45A8C" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    backgroundColor: '#f3f3f3',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  image: {
    width: 80,
    height: 100,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  orderDate: {
    fontSize: 13,
    color: '#777',
    marginVertical: 4,
  },
  orderTotal: {
    fontSize: 14,
    color: '#000',
    marginBottom: 4,
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trackText: {
    color: '#D45A8C',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#888',
  },
});

export default OrdersScreen;
