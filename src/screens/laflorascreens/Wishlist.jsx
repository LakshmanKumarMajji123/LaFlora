import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderComponent from './HeaderComponent';

const Wishlist = ({navigation}) => {
  const handleExploreProducts = () => {
    navigation.navigate('Home'); // Replace with actual home or product screen route
  };

  return (
    <>
      <HeaderComponent title="My Wishlist" />
      <View style={styles.container}>
        <Icon name="heart-off-outline" size={100} color="#D45A8C" />
        <Text style={styles.title}>Your Wishlist is Empty</Text>
        <Text style={styles.subtitle}>
          Looks like you haven’t added anything to your wishlist yet.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HomeScreen')}>
          <Text style={styles.buttonText}>Explore Products</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Wishlist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    color: '#666',
    textAlign: 'center',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#D45A8C',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
