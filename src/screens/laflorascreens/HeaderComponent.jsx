import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const Header = ({ title }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const currentScreen = route.name;
  const [cartCount, setCartCount] = useState(0);


  // useEffect(() => {
  //   const fetchCartCount = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem('authToken'); // if using auth
  //       const response = await axios.get('http://192.168.0.107:8080/users/cartCount', {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       const count = response.data?.count || 0;
  //       setCartCount(count);
  //     } catch (error) {
  //       console.error('Failed to fetch cart count:', error);
  //       setCartCount(1); // fallback to 0
  //     }
  //   };

  //   fetchCartCount();
  // }, []);




  return (
    <View style={styles.header}>
      <View style={styles.headerTitleContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-left"
            size={24}
            color="#fff"
            style={styles.arrowicon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      <View style={styles.headerIcons}>
        {currentScreen !== 'NotificationsScreen' && (
          <TouchableOpacity onPress={() => navigation.navigate('NotificationsScreen')}>
            <Icon name="bell" size={24} color="#2C2C2C" style={styles.icon} />
          </TouchableOpacity>
        )}

        {currentScreen !== 'CartScreen' && (
          <TouchableOpacity onPress={() => navigation.navigate('CartScreen')}>
            <View style={styles.iconWithBadge}>
              <Icon name="cart" size={24} color="#2C2C2C" style={styles.icon} />
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}


        {currentScreen !== 'Wishlist' && (
          <TouchableOpacity onPress={() => navigation.navigate('Wishlist')}>
            <Icon name="heart-outline" size={24} color="#2C2C2C" style={styles.icon} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    backgroundColor: '#D45A8C',
    height: 118,
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  icon: {
    backgroundColor: '#FAFAFA',
    borderRadius: 28,
    padding: 4.5,
  },
  iconWithBadge: {
    position: 'relative',
  },

  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },

  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },

});
