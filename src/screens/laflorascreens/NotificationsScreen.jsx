import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderComponent from './HeaderComponent';

const notifications = [
  {
    id: '1',
    title: 'Order Shipped',
    message: 'Your order #ORD1234 has been shipped.',
  },
  {
    id: '2',
    title: 'New Offer',
    message: 'Get 20% off on your next purchase!',
  },
  {
    id: '3',
    title: 'Delivery Scheduled',
    message: 'Your item will be delivered tomorrow.',
  },
  {
    id: '4',
    title: 'Order Delivered',
    message: 'Order #ORD1200 was successfully delivered.',
  },
];

const NotificationsScreen = () => {
  const renderItem = ({item}) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.iconContainer}>
        <Icon name="notifications" size={20} color="#D45A8C" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.message}>{item.message}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderComponent title="Notifications" />

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fde6ee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});

export default NotificationsScreen;
