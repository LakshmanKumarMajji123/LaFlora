import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CartPageProductCard from './CartPageProductCard';
import HeaderComponent from './HeaderComponent';
import { API_BASE_URL } from '@env';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

const CartScreen = ({ navigation }) => {

  const route = useRoute();
  const userId = route.params?.captureUserId;
  console.log("userID in cart:", userId);

  const api = axios.create({
    baseURL: API_BASE_URL || "http://192.168.0.114:8080"
  });

  api.interceptors.request.use(config => {
    console.log('Request sent...', config);
    return config;
  });

  api.interceptors.response.use(
    response => {
      console.log('Response received...', response.data);
      return response;
    },
    error => {
      console.error('Response error...', error.response?.data || error.message);
      return Promise.reject(error);
    },
  );

  const [selected, setSelected] = useState('same_day');
  const [cartItems, setCartItems] = useState([]);

  const options = [
    {
      key: 'standard',
      title: 'Standard Delivery',
      subtitle: 'Delivered with care, right on time',
      price: null,
    },
    {
      key: 'same_day',
      title: 'Same Day Delivery',
      subtitle: 'Need it now? Get it today!',
      price: 99,
    },
  ];

  const activeColor = '#D45A8C';
  const inactiveColor = '#888';

  const fetchCart = async () => {

    try {
      const response = await api.get("/users/getCartInfoCount");
      console.log("cart info records is:", response.data.data);
      setCartItems(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      setCartItems([]);
      console.log("error", `Fetching cart Info:-${error}`);
    }

  }

  useEffect(() => {
    fetchCart();
  }, []);


  const handleDeliveryType = async (key, price) => {
    setSelected(key);

    const deliveryPayload = {
      key, price, userId
    }
    console.log(`key-${key} price-${price}`);

    try {
      const postDeliveryType = await api.post("/users/postDeliveryType", deliveryPayload);
      console.log("response is..", postDeliveryType.data);

      if (postDeliveryType.status === 200) {
        Alert.alert("success");
      } else {
        console.log("failure", "delivery type inserted into cart tbl");
      }
    } catch (error) {
      Alert.alert(error, "delivery type inserted into cart tbl");
      console.log("Error", `delivery type inserted into cart tbl-${error}`);
    }

  }

  //handleDelte
  const handleRemoveFromCart = async (id) => {
    try {
      const removedCartItem = await api.delete(`/users/removeItemFromCart?id=${id}`);
      console.log("removed item from cart:", removedCartItem);
      fetchCart();
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }

  }

  console.log("len:", cartItems.length);

  return (
    <>
      <HeaderComponent title="Cart" />

      {/* Display Cart Item Count */}
      <View style={styles.cartCountContainer}>
        <Text style={styles.cartCountText}>
          <Text style={{ color: "#D45A8C", fontSize: 18 }}> {cartItems.length} </Text>{cartItems.length === 1 ? 'Item' : 'Items'} in Cart
        </Text>
      </View>

      <ScrollView style={styles.container}>
        {cartItems.length === 0 ? (
          <View style={styles.container6}>
            <Icon name="cart-off" size={100} color="#ccc" />
            <Text style={styles.title5}>Your Cart is Empty</Text>
            <Text style={styles.subtitle5}>
              Looks like you haven’t added anything to your cart yet.
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('HomeScreen')}>
              <Text style={styles.buttonText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Offer Row */}
            <View style={styles.offerRow}>
              <Icon name="tag-outline" size={16} color="#333" />
              <Text style={styles.offerText}>
                Buy 2 For 999 offer applicable
              </Text>
              <TouchableOpacity style={{ marginLeft: 'auto' }}>
                <Text style={styles.addItems} onPress={() => navigation.navigate("HomeScreen")}>ADD ITEMS</Text>
              </TouchableOpacity>
            </View>

            {/* Product Cards */}
            {cartItems.map((item, index) => (
              <CartPageProductCard
                key={index}
                item={item}
                onRemove={() => handleRemoveFromCart(item.id)}
              />
            ))}

            {/* Delivery Options */}
            <View style={styles.container2}>
              {options.map((option, index) => {
                const isActive = selected === option.key;
                return (
                  <React.Fragment key={option.key}>
                    <TouchableOpacity
                      style={styles.option}
                      onPress={() => handleDeliveryType(option.key, option.price)}
                      activeOpacity={0.8}>
                      <View
                        style={[
                          styles.radioCircle,
                          { borderColor: isActive ? activeColor : inactiveColor },
                        ]}>
                        {isActive && (
                          <View
                            style={[
                              styles.selectedRb,
                              { backgroundColor: activeColor },
                            ]}
                          />
                        )}
                      </View>
                      <View style={styles.textBox}>
                        <Text
                          style={[
                            styles.title2,
                            { color: isActive ? activeColor : inactiveColor },
                          ]}>
                          {option.title}
                        </Text>
                        <Text
                          style={[
                            styles.subtitle2,
                            { color: isActive ? activeColor : inactiveColor },
                          ]}>
                          {option.subtitle}
                        </Text>
                      </View>
                      {option.price && (
                        <Text
                          style={[
                            styles.price2,
                            { color: isActive ? activeColor : inactiveColor },
                          ]}>
                          {option.price == 99 ? `+ ${option.price}` : option.price}
                        </Text>
                      )}
                    </TouchableOpacity>
                    {index === 0 && <View style={styles.separator} />}
                  </React.Fragment>
                );
              })}
            </View>

            {/* Coupon Section */}
            <TouchableOpacity
              style={styles.container3}
              onPress={() => navigation.navigate('ApplyCouponScreen')}>
              <View style={styles.row}>
                <View style={styles.iconBox}>
                  <Icon name="percent" size={24} color="#E75480" />
                </View>
                <View style={styles.textSection}>
                  <Text style={styles.label}>Coupons & Offers</Text>
                  <Text style={styles.heading}>Apply Coupon / Gift Card</Text>
                  <Text style={styles.subText}>
                    Crazy deals and other amazing offers
                  </Text>
                </View>
                <Icon name="chevron-right" size={28} color="#979797" />
              </View>
            </TouchableOpacity>

            {/* Price Summary */}
            <View style={styles.card4}>
              <View style={styles.rowBetween}>
                <Text style={styles.title4}>Price Summary</Text>
                <Icon name="chevron-down" size={20} color="#000" />
              </View>
              <View style={styles.rowBetween}>
                <Text style={styles.subLabel}>Subtotal</Text>
                <Text style={styles.subPrice}>₹699</Text>
              </View>
              <View style={styles.savingBox}>
                <Text style={styles.savingText}>
                  You are saving{' '}
                  <Text style={styles.savingHighlight}>₹600</Text> on this order
                </Text>
              </View>
            </View>

            {/* Footer Section */}
            <View style={styles.container5}>
              <View style={styles.banner}>
                <Icon
                  name="motorbike"
                  size={22}
                  color="#007aff"
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.bannerText}>
                  Yayy! FREE delivery on this order!
                </Text>
              </View>

              <View style={styles.footerRow}>
                <View>
                  <Text style={styles.priceText}>
                    ₹699 <Text style={styles.extra}>+99</Text>
                  </Text>
                  <Text style={styles.viewDetails}>VIEW DETAILS</Text>
                </View>

                <TouchableOpacity
                  style={styles.proceedBtn}
                  onPress={() => navigation.navigate('PaymentScreen')}>
                  <Text style={styles.proceedText}>PROCEED</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  // Keep your existing styles here...
  container: { backgroundColor: '#F1F1F1', flex: 1 },
  cartCountContainer: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  cartCountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  offerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    marginVertical: 25,
  },

  offerText: {
    marginLeft: 5,
    color: '#D45A8C',
    fontSize: 13,
    fontWeight: '500',
  },
  addItems: {
    color: '#D45A8C',
    fontWeight: 'bold',
    fontSize: 13,
  },
  container: { backgroundColor: '#F1F1F1', flex: 1 },

  offerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    marginVertical: 25,
  },
  offerText: {
    marginLeft: 5,
    color: '#D45A8C',
    fontSize: 13,
    fontWeight: 500,
  },
  addItems: {
    color: '#D45A8C',
    fontWeight: 'bold',
    fontSize: 13,
  },

  container2: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    padding: 12,
    margin: 12,
  },
  option: {
    flexDirection: 'row',
    marginVertical: 6,
    alignItems: 'flex-start',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  textBox: {
    flex: 1,
  },
  title2: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  subtitle2: {
    fontSize: 12,
    marginTop: 2,
  },
  price2: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },

  container3: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    margin: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    marginRight: 18,
  },
  textSection: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#111',
    fontWeight: '500',
    marginBottom: 4,
  },
  heading: {
    color: '#D45A8C',
    fontWeight: 'bold',
    fontSize: 17,
  },
  subText: {
    color: '#757575',
    fontSize: 15,
    marginTop: 2,
  },

  card4: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 12,
    overflow: 'hidden',
    marginBottom: 30,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title4: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
  },
  subLabel: {
    fontSize: 15,
    color: '#111',
  },
  subPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111',
  },
  savingBox: {
    backgroundColor: '#f0fff0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  savingText: {
    fontSize: 14,
    color: '#555',
  },
  savingHighlight: {
    color: 'green',
    fontWeight: 'bold',
  },

  container5: {
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderColor: '#ddd',
    paddingBottom: 10,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f7ff',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  icon2: {
    width: 22,
    height: 22,
    marginRight: 10,
    resizeMode: 'contain',
  },
  bannerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
  },
  extra: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111',
  },
  viewDetails: {
    marginTop: 4,
    fontSize: 13,
    color: '#D45A8C',
    fontWeight: '600',
  },
  proceedBtn: {
    backgroundColor: '#D45A8C',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  proceedText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },

  container6: {
    flex: 1,
    paddingVertical: 80,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 35,
    minHeight: 1000
  },
  title5: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#444',
    marginTop: 20,
  },
  subtitle5: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
    textAlign: 'center',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#D45A8C',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default CartScreen;
