import React, { useEffect, useState, useCallback } from 'react';
//import Icon from 'react-native-vector-icons/Ionicons';
import SimilarProducts from './SimilarProducts';
import CarouselComponent from './CarouselComponent';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_BASE_URL } from '@env';
import { useRoute } from '@react-navigation/native';

// const topCategories = [
//   {
//     label: 'Clothing',
//     icon: require('../laflorascreens/assets/clothingLogo.png'),
//   },
//   {
//     label: 'Salon Services',
//     icon: require('../laflorascreens/assets/clothingLogo2.png'),
//   },
// ];

// const productCategories = [
//   {
//     label: 'Kurtas & Kurtis',
//     image: require('../laflorascreens/assets/kurtakurtis.png'),
//   },
//   {
//     label: 'Dresses',
//     image: require('../laflorascreens/assets/dresses.png'),
//   },
//   {
//     label: 'Bottom Wear',
//     image: require('../laflorascreens/assets/bottomwear.png'),
//   },
//   {
//     label: 'Blouse',
//     image: require('../laflorascreens/assets/blouses.png'),
//   },
//   {
//     label: 'Dresses',
//     image: require('../laflorascreens/assets/dresses.png'),
//   },
//   {label: 'Dresses', image: require('../laflorascreens/assets/dresses.png')},
// ];

const CategorySkeleton = () => (
  <View style={[styles.categoryCard, { backgroundColor: '#E0E0E0' }]}></View>
);

const SubCategorySkeleton = () => <View style={styles.card}></View>;

export default function HomeScreen({ navigation }) {
  const route = useRoute();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [categoriesData, setCategoriesData] = useState([]);
  const [subCategoriesData, setSubCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cartCount, setCartCount] = useState(1);

  const registerdUserInfo = route.params?.registeredUser;
  console.log('register payload..', registerdUserInfo);

  const api = axios.create({
    baseURL: API_BASE_URL || 'http://192.168.0.114:8080',
  });

  /**---request----- */
  api.interceptors.request.use(async config => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      console.log('token is valid', token);
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request sent...', config);
    return config;
  });

  /**---response---- */
  api.interceptors.response.use(
    response => {
      console.log('api interceptor Response is...', response);
      return response;
    },
    error => {
      console.log('api interceptor Response error...', error);
      return Promise.reject(error);
    },
  );

  //fetch cart count
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken'); // if using auth
        const response = await axios.get(
          'http://192.168.0.114:8080/users/cartCount',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const count = response.data?.count || 0;
        setCartCount(count);
      } catch (error) {
        console.error('Failed to fetch cart count:', error);
        setCartCount(0); // fallback to 0
      }
    };

    fetchCartCount();
  }, []);

  //fetch categories
  const fetchCategories = async () => {
    try {
      const response = await api.get('/users/categories');
      const categories = response.data?.data || [];

      console.log('Categories response:', categories);
      if (categories.length > 0) {
        setCategoriesData(categories);
        setSelectedIndex(0); // select the first category
        setLoading(false);

        const firstCategoryId = categories[0].id;
        await captureCategoryIds(0, firstCategoryId); // automatically fetch subcategories for first
      } else {
        setCategoriesData([]);
        setLoading(false);
      }
    } catch (error) {
      console.log('Error Fetching categories is..', error);
      setLoading(false);
      Alert.alert('Error', 'Something went wrong fetching categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const captureCategoryIds = async (index, categoryId) => {
    console.log('Selected category ID:', categoryId);
    setSelectedIndex(index);

    //select category
    try {
      const response = await api.post('/users/selectCategory', { categoryId });

      if (!(response.status && response.data.status === 200)) {
        Alert.alert('Error', response.data.error || 'Something went wrong');
      }

      await displaySubCategories(categoryId);
      //console.log("POST response", response.data);
    } catch (error) {
      if (error.response.status === 401) {
        Alert.alert('you are not Authenticated(token), please Login!');
        navigation.navigate('LoginForm');
      }
      console.log('Error selecting category:', error);
      // Alert.alert('Error', 'Failed to select category');
    }
  };

  //display subCategories
  const displaySubCategories = async categoryId => {
    console.log('clicked subcategory_id: ', categoryId);

    try {
      const response = await api.get(
        `/users/subCategories?category_id=${categoryId}`,
      );
      console.log('subcategories data is...', response.data);

      if (response.data && response.status === 200) {
        setSubCategoriesData(response.data.data);
        setLoading(false);
        response.data.data.forEach((item, index) => {
          console.log(`category ${index}: -`, item.id, item.title);
        });
      } else {
        setSubCategoriesData([]);
        setLoading(true);
        Alert.alert('!No subcategories found');
      }
    } catch (error) {
      console.log('Error displaying subcategories:', error);
      Alert.alert('Error', 'Displaying subcategories');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor={'transparent'} />
      
        {/* Header */}

        <View style={styles.headerWrapper}>
          {/* Top Row: Logo + Icons */}
          <View style={styles.headerTop}>
            <Text></Text>
            <Image
              source={require('../laflorascreens/assets/LaFloraBrandLogo.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <View style={styles.iconRow}>
              <TouchableOpacity
                onPress={() => navigation.navigate('NotificationsScreen')}>
                <Icon
                  name="bell-outline"
                  size={24}
                  color="#2C2C2C"
                  style={styles.icon}
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconButton}>
                <Icon name="wallet-outline" size={26} color="#000000" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.navigate('CartScreen')}>
                <Icon name="cart-outline" size={26} color="#000000" />
              </TouchableOpacity>
              {/* 
              <TouchableOpacity
                onPress={() => navigation.navigate('CartScreen')}>
                <View style={styles.iconWithBadge}>
                  <Icon
                    name="cart-outline"
                    size={26}
                    color="#000000"
                    style={styles.icon}
                  />
                  {cartCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{cartCount}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.inputContainer}>
            <Icon
              name="magnify"
              size={18}
              color="#000000"
              style={styles.icon}
            />
            <TextInput
              placeholder="Search Here"
              placeholderTextColor="#8A8A8A"
              style={styles.input}
            />
          </View>
        </View>
<ScrollView>
        {/* Banner */}
        <CarouselComponent navigation={navigation} />

        {/* Top Categories */}
        <View>
          <Text style={styles.sectionTitle}>Top Categories</Text>
          <View style={styles.categoriesContainer}>
            <View style={styles.categoryRow}>
              {loading ? (
                <>
                  <CategorySkeleton />
                  <CategorySkeleton />
                </>
              ) : (
                categoriesData?.map((item, index) => {
                  const isSelected = selectedIndex === index;
                  return (
                    <View
                      style={[
                        {backgroundColor: isSelected ? '#FFF3F6' : '#FFFFFF'},

                        { padding: isSelected ? 0 : 10 },
                        { margin: isSelected ? 0 : -10 },

                        { paddingTop: isSelected ? 0 : 20 },
                        { marginTop: isSelected ? 0 : -20 },

                        {paddingHorizontal: isSelected ? 0 : 15},
                        {marginHorizontal: isSelected ? 0 : -15},

                      ]}>
                      <TouchableOpacity
                        key={index}
                        onPress={() => captureCategoryIds(index, item.id)}
                        style={[
                          styles.categoryCard,
                          { backgroundColor: isSelected ? '#D45A8C' : '#F3F3F3' },
                        ]}>
                        <Image
                          source={
                            item.path
                              ? item.path
                              : require('../laflorascreens/assets/LaFloraBrandLogo.png')
                          }
                          style={styles.categoryIcon}
                        />
                        <Text
                          style={[
                            styles.categoryLabel,
                            { color: isSelected ? '#FFFFFF' : '#000000' },
                          ]}>
                          {item.title}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })
              )}
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
              style={styles.scroll}>
              {loading ? (
                <>
                  <SubCategorySkeleton />
                  <SubCategorySkeleton />
                  <SubCategorySkeleton />
                  <SubCategorySkeleton />
                </>
              ) : (
                subCategoriesData.map(item => {
                  const { id, title } = item;
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('ProductsViewScreen', { id, title })
                      }>
                      {/** navigation.navigate('ProductsViewScreen', { id, title }); */}
                      <View key={item.id} style={styles.card}>
                        <Image
                          source={
                            item.path
                              ? item.path
                              : require('../laflorascreens/assets/kurtakurtis.png')
                          }
                          style={styles.categoryimage}
                          resizeMode="contain"
                        />
                      </View>
                      <Text style={styles.label}>{item.title}</Text>
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
          </View>
        </View>

        {/* Similar Products */}
        <SimilarProducts navigation={navigation} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  //header

  headerWrapper: {
    padding: 16,
    paddingTop: 50,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    height: 64,
    width: 89,
    flex: 1,
    alignSelf: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    gap: 24,
    marginRight: 10,
  },
  iconButton: {
    // marginLeft: 18,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#8A8A8A',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#8A8A8A',
  },

  // top categories section
  loader: {
    flex: 1,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 20,
    marginTop: 20,
  },

  categoriesContainer: {
    backgroundColor: '#FFF3F6',
    paddingTop: 12,
    margin: 5,
    borderRadius: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  categoryCard: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    borderRadius: 8,
    width: 170,
    height: 60,
  },

  categoryIcon: {
    width: 44,
    height: 48,
    marginRight: 10,
  },
  categoryLabel: { fontSize: 13, fontWeight: 700 },

  // {/*product categories section  */}
  categoryimage: {
    height: 109,
    width: 68,
  },

  scroll: {
    backgroundColor: '#FFF3F6',
    padding: 10,
    paddingRight: 50,
  },

  card: {
    width: 94,
    height: 109,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    padding: 2,
  },

  label: {
    margin: 1,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 12,
    fontFamily: 'SF Pro Display',
  },

  similarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 15,
  },
  seeAll: {
    fontSize: 12,
    color: '#D81159',
  },

  productCard: {
    height: 213,
    width: 131,
    marginLeft: 16,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  productImage: {
    width: '131',
    height: 132,
    borderRadius: 8,
    marginBottom: 5,
    resizeMode: 'stretch',
  },
  productName: { fontWeight: 'bold', fontSize: 14 },
  productDesc: { fontSize: 11, color: '#777' },
  priceRow: { flexDirection: 'row', alignItems: 'center' },
  price: { fontWeight: 'bold', marginRight: 5, color: '#D45A8C' },
  mrp: { textDecorationLine: 'line-through', color: '#888', fontSize: 12 },
  iconWithBadge: {
    position: 'relative',
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
