import React, {useEffect, useState, useCallback} from 'react';

import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ImageBackground,
  Alert,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import SimilarProducts from './SimilarProducts';
import CarouselComponent from './CarouselComponent';
import {useRoute} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL} from '@env';

const {width} = Dimensions.get('window');

const ProductDetailedView = ({navigation}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [productColors, setProductColors] = useState([]);
  const [colortitle, setColortitle] = useState('');
  const [productSizes, setProductSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);
  const [specificationsInfo, setSpecificationsInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpec, setSelectedSpec] = useState([]);
  const [userInfo, setUserInfo] = useState({ colorId: null, sizeId: null });
  const [itemAddedToCart, setItemAddedToCart] = useState(false);
  let captureUserId;
  const route = useRoute();
  const productID = route.params?.id;
  console.log('capture productid in detialview page', productID);


  console.log("capture userId is..", captureUserId); 


  console.log("capture userId is..", captureUserId);

  if (!productID) {
    Alert.alert('Error', 'Product ID is missing');
    navigation.goBack();
    return null;
  }

  const api = axios.create({
    baseURL: API_BASE_URL || "http://192.168.0.114:8080"
  });

  api.interceptors.request.use(async config => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      console.log('token is valid', token);
      config.headers.Authorization = `Bearer ${token}`;
    }
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




  const captureColors = (id, color) => {
    console.log("Selected color:", { id, color });
    setColortitle(color);
    setUserInfo(prev => {
      const newState = { ...prev, colorId: id };
      console.log("Updated userInfo in captureColors:", newState);
      return newState;
    });
  };

  const captureSizes = (id, size) => {
    console.log("Selected size:", { id, size });
    setSelectedSize(size);
    setUserInfo(prev => {
      const newState = { ...prev, sizeId: id };
      console.log("Updated userInfo in captureSizes:", newState);
      return newState;
    });
  };


  const fetchProductDetailInfo = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/users/productDetailInfo?id=${productID}`,
      );
      console.log('response of productdetail is..', response.data);
      if (response.status === 200) {
        setProduct(response.data.data);
      } else {
        setProduct(null);
        Alert.alert(
          'Error',
          response.data.error || 'Failed to fetch product details',
        );
      }
    } catch (error) {
      console.error(
        'Fetch product error:',
        error.response?.data || error.message,
      );
      Alert.alert(
        'Error',
        error.response?.data?.error || 'Failed to fetch product details',
      );
    } finally {
      setLoading(false);
    }
  }, [api, productID]);

  const fetchColors = useCallback(async () => {
    try {
      const response = await api.get(
        `/users/getproductColors?product_id=${productID}`,
      );
      console.log('colors response is..', response.data);
      if (response.status === 200) {
        setProductColors(response.data.data || []);
      } else {
        setProductColors([]);
        Alert.alert('Error', response.data.error || 'Failed to fetch colors');
      }
    } catch (error) {
      console.error(
        'Fetch colors error:',
        error.response?.data || error.message,
      );
      Alert.alert('Error', 'Failed to fetch colors');
    }
  }, [api]);

  const fetchSizes = useCallback(async () => {
    try {
      const response = await api.get(
        `/users/getproductSizes?product_id=${productID}`,
      );
      console.log('sizes response is..', response.data);
      if (response.status === 200) {
        setProductSizes(response.data.data || []);
      } else {
        setProductSizes([]);
        Alert.alert('Error', response.data.error || 'Failed to fetch sizes');
      }
    } catch (error) {
      console.error(
        'Fetch sizes error:',
        error.response?.data || error.message,
      );
      Alert.alert('Error', 'Failed to fetch sizes');
    }
  }, [api]);

  const getSpecificationsInfo = useCallback(async () => {
    try {
      const response = await api.get(
        `/users/specificationsInfo?product_id=${productID}`,
      );
      console.log('specifications response is...', response.data);
      if (response.status === 200) {
        setSpecificationsInfo(response.data.data || []);
      } else {
        setSpecificationsInfo([]);
        Alert.alert(
          'Error',
          response.data.error || 'Failed to fetch specifications',
        );
      }
    } catch (error) {
      console.error(
        'Fetch specifications error:',
        error.response?.data || error.message,
      );
      Alert.alert('Error', 'Failed to fetch specifications');
    }
  }, [api]);




  const checkCart = async (colorId, sizeId) => {
    // if (colorId || sizeId) {
    //   Alert.alert('In-valid Selection', 'Please select a color, size.');
    //   return;
    // }

    try {
      const payload = {
        product_id: productID,
        stocks_variant_id: colorId,
        size_id: sizeId,
      };
      console.log("Sending payload to cart:", payload);

      const stockResponse = await api.post("/users/checkStockAvailbilityForCheckCart", payload);
      console.log("cart response:", stockResponse.data.data);

      if (stockResponse.status === 200) {
        if (stockResponse.data.message === "Selected product is already available in the cart") {
          Alert.alert(stockResponse.data.message);
          console.log("data:", stockResponse.data.Data);
          captureUserId = stockResponse.data.Data.userID;
          setItemAddedToCart(true); //show "GO TO CART"
        } else if (stockResponse.data.message === "Please Add to Cart") {
          Alert.alert(stockResponse.data.message);
          setItemAddedToCart(false); //show "ADD TO CART"
        } else {
          Alert.alert('Error', 'Unexpected response from server.');
          setItemAddedToCart(false);
        }

      } else {
        Alert.alert('Error', stockResponse.data.error || 'Failed to check cart.');
        setItemAddedToCart(false);
      }

    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          Alert.alert('Authentication Error', 'You are not authenticated, please login!');
          navigation.navigate('LoginForm');
        } else {
          Alert.alert('Error', error.response.data.error || 'Product not added to cart.');
        }
      } else {
        Alert.alert('Error', 'Network error, please try again later.');
      }
    }
  }

  const handleAddToCart = async () => {
    if (!userInfo.colorId || !userInfo.sizeId) {
    //  Alert.alert('In-valid Selection', 'Please select a color,size.');
      return;
    }

    try {
      const payload = {
        product_id: productID,
        stocks_variant_id: userInfo.colorId,
        size_id: userInfo.sizeId,
      };
      console.log('Sending payload to cart:', payload);

      const stockResponse = await api.post("/users/checkStockAvailbilityForAddToCart", payload);
      console.log("cart response:", stockResponse.data);

      if (stockResponse.status === 200) {
        ToastAndroid.show('Added to bag!', ToastAndroid.SHORT);
        console.log("userId in ADDTOCART", stockResponse.data.userID);
        captureUserId = stockResponse.data.userID;
        setItemAddedToCart(true);
        navigation.navigate("CartScreen", { captureUserId });
      } else {
        Alert.alert(
          'Error',
          stockResponse.data.error || 'Product not added to cart.',
        );
      }
    } catch (error) {
      //console.error("Add to cart error:", error);
      if (error.response) {
        if (error.response.status === 401) {
          Alert.alert(
            'Authentication Error',
            'You are not authenticated, please login!',
          );
          navigation.navigate('LoginForm');
        } else {
          Alert.alert(
            'Error',
            error.response.data.error || 'Product not added to cart.',
          );
        }
      } else {
        Alert.alert('Error', 'Network error, please try again later.');
      }
    }
  }

  const handleGoToCart = () => {
    navigation.navigate('CartScreen', { captureUserId });
  }

  useEffect(() => {
    console.log("useEffect triggered with userInfo:", userInfo);
    if (userInfo.colorId && userInfo.sizeId) {
      console.log("Checking cart with colorId:", userInfo.colorId, "sizeId:", userInfo.sizeId);
      checkCart(userInfo.colorId, userInfo.sizeId);
    }
  }, [userInfo.colorId, userInfo.sizeId]);

  useEffect(() => {
    fetchProductDetailInfo();
    fetchColors();
    fetchSizes();
    getSpecificationsInfo();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />
      </View>
    );
  }

  const renderItem = ({item}) => (
    <ImageBackground
      source={
        item.image
          ? {uri: item.image}
          : require('../laflorascreens/assets/product1.png') || (
              <Text style={styles.errorText}>No images available</Text>
            )
      }
      style={styles.image}
      resizeMode="stretch"
      imageStyle={{borderRadius: 8}}>
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.iconCircle}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconCircle}
          onPress={() => setWishlisted(!wishlisted)}>
          <Icon
            name={wishlisted ? 'heart' : 'heart-outline'}
            size={20}
            color={wishlisted ? '#D45A8C' : '#000'}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomLeft}>
        <Text style={styles.hotDeal}>Hot Deal</Text>
      </View>
      <View style={styles.bottomRight}>
        <Text style={styles.ratingText}>
          {item.rating || 'N/A'} | {item.reviews || '0'}
        </Text>
      </View>
    </ImageBackground>
  );

  product.map(item =>
    console.log(
      `id-${item.id}, rating-${item.rating}, reviews-${item.reviews}, image-${item.image}, MRP-${item.MRP}, discount-${item.discount}`,
    ),
  );

  return (
    <View style={{flex: 1}}>
      <ScrollView style={styles.container}>
        {product && product.images && product.images.length > 0 ? (
          <View>
            <Carousel
              loop
              width={width}
              height={470}
              autoPlay={false}
              data={product.image}
              scrollAnimationDuration={1000}
              onSnapToItem={index => setCurrentIndex(index)}
              renderItem={({item}) => renderItem(item)}
              style={{marginTop: 0}}
            />
            <View style={styles.dotsContainer}>
              {product.image.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        index === currentIndex ? '#757575' : '#ccc',
                    },
                  ]}
                />
              ))}
            </View>
          </View>
        ) : (
          <Text style={styles.errorText}>No images available</Text>
        )}

        <View style={styles.infoContainer}>
          {product.map((item, idx) => {
            const actualPriceRaw = Math.floor(
              item.MRP - (item.MRP * item.discount) / 100,
            );
            // Convert to string and pad with leading zeros to ensure 4 digits
            const actualPrice = actualPriceRaw.toString().padStart(4, '0');

            // Optional: Handle cases where price exceeds 4 digits
            if (actualPriceRaw > 9999) {
              console.warn(
                `Price ${actualPriceRaw} exceeds 4 digits, truncating to ${actualPrice.slice(
                  -4,
                )}`,
              );
            }

            return (
              <View key={idx}>
                <Text style={styles.brand}>
                  {item.name ? item.name : 'name'}
                </Text>
                <Text style={styles.desc}>
                  {item.description ? item.description : 'description'}
                </Text>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>₹{actualPrice}</Text>
                  <Text style={styles.mrp1}>MRP</Text>
                  <Text style={styles.mrp}>₹{item.MRP}</Text>
                  <Text style={styles.offer}>{item.discount}% OFF</Text>
                </View>
              </View>
            );
          })}
          <Text style={styles.inclusive}>inclusive of all taxes</Text>
          <LinearGradient
            colors={['#88F99C', '#F1F1F1']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.tracker}>
            <Text>✔ 125 People bought this in the last 7 days</Text>
          </LinearGradient>

          <Text style={styles.sectionTitle}>
            Select Colour: {colortitle || ' select any One color'}
          </Text>
          <View style={styles.colorRow}>
            {productColors.length > 0 ? (
              productColors.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => captureColors(item.id, item.color_name)}>
                  <Image
                    source={{
                      uri:
                        item.image ||
                        'https://assets.myntassets.com/dpr_1.5,q_60,w_400,c_limit,fl_progressive/assets/images/30259617/2025/1/25/e4b9b77a-7b51-4c07-8c29-e69c0db4a8fa1737813086093-AHIKA-Floral-Printed-Straight-Kurta-With-Trousers--Dupatta-1-1.jpg',
                    }}
                    style={[
                      styles.colorImage,
                      colortitle === item.color_name && styles.selectedImg,
                    ]}
                  />
                </TouchableOpacity>
              ))
            ) : (
              <Text>No colors available</Text>
            )}
          </View>

          <Text style={styles.sectionTitle}>
            Select Size: {selectedSize || 'select any One Size'}
          </Text>
          <View style={styles.sizeRow}>
            {productSizes.length > 0 ? (
              productSizes.map((productsize, idx) => {
                const {size_id, sizes} = productsize;
                return (
                  <View key={idx}>
                    <TouchableOpacity
                      style={[
                        styles.sizeBox,
                        selectedSize === sizes && styles.selectedSize,
                      ]}
                      onPress={() => captureSizes(size_id, sizes)}>
                      <Text style={styles.sizeText}>{sizes}</Text>
                    </TouchableOpacity>
                  </View>
                );
              })
            ) : (
              <Text>No sizes available</Text>
            )}
          </View>

          <Text style={styles.sectionTitle}>📦 CHECK FOR DELIVERY DETAILS</Text>
          <Text style={styles.sectionTitle2}>Delivering all across India</Text>
          <View style={styles.deliveryRow}>
            <TextInput placeholder="Enter Pincode" style={styles.input} />
            <TouchableOpacity style={styles.checkBtn}>
              <Text style={styles.checkText}>CHECK</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>SPECIFICATIONS</Text>
          <View style={styles.featuresRow}>
            {specificationsInfo.length > 0 && specificationsInfo[0] ? (
              (() => {
                const {Fabric_Type_One, Fabric_Type_Two, Fabric_Type_Three} =
                  specificationsInfo[0];
                const features = [
                  {title: Fabric_Type_One, value: '220 GSM Fabric'},
                  {title: Fabric_Type_Two, value: 'Cotton Fabric'},
                  {title: Fabric_Type_Three, value: 'Soft & Resilient'},
                ];
                return features.map((feature, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.featureCard2,
                      !feature.title && styles.disabledGridItem,
                      selectedSpec.includes(`fabric-${idx}`) &&
                        styles.highlighted2,
                    ]}
                    disabled={!feature.title}>
                    <Icon
                      name="albums"
                      size={30}
                      color={feature.title ? '#D45A8C' : '#B0B0B0'}
                    />
                    <Text
                      style={[
                        styles.gridFabLabel,
                        !feature.title && styles.disabledText,
                      ]}>
                      {feature.title || 'N/A'}
                    </Text>
                    <Text
                      style={[
                        styles.gridFabValue,
                        !feature.title && styles.disabledText,
                      ]}>
                      {feature.value || 'N/A'}
                    </Text>
                  </TouchableOpacity>
                ));
              })()
            ) : (
              <Text>No specifications available</Text>
            )}
          </View>

          <View style={styles.grid}>
            {specificationsInfo.length > 0 && specificationsInfo[0] ? (
              (() => {
                const {
                  Sleeve_Length,
                  Collar,
                  Fit,
                  Brand_Fit_Name,
                  Print_or_Pattern_Type,
                  Occasion,
                } = specificationsInfo[0];
                const features = [
                  {title: 'Sleeve Length', value: Sleeve_Length},
                  {title: 'Collar', value: Collar},
                  {title: 'Fit', value: Fit},
                  {title: 'Brand Fit Name', value: Brand_Fit_Name},
                  {
                    title: 'Print or Pattern Type',
                    value: Print_or_Pattern_Type,
                  },
                  {title: 'Occasion', value: Occasion},
                ];
                return features.map((feature, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.gridItem,
                      !feature.value && styles.disabledGridItem,
                      selectedSpec.includes(`grid-${idx}`) &&
                        styles.highlighted2,
                    ]}
                    disabled={!feature.value}>
                    <Text
                      style={[
                        styles.gridLabel,
                        !feature.value && styles.disabledText,
                      ]}>
                      {feature.title || 'N/A'}
                    </Text>
                    <Text
                      style={[
                        styles.gridValue,
                        !feature.value && styles.disabledText,
                      ]}>
                      {feature.value || 'N/A'}
                    </Text>
                  </TouchableOpacity>
                ));
              })()
            ) : (
              <Text>No details available</Text>
            )}
          </View>

          <View style={styles.returnBox}>
            <Icon
              name="sync"
              size={20}
              color="#D45A8C"
              style={{marginRight: 8}}
            />
            <View>
              <Text style={styles.returnTitle}>15 Days Return & Exchange</Text>
              <Text style={styles.returnSubtitle}>
                Know about return & exchange policy
              </Text>
            </View>
          </View>

          <View style={styles.bannerContainer}>
            <CarouselComponent navigation={navigation} />
          </View>

          <SimilarProducts navigation={navigation} />

          <TouchableOpacity
            style={styles.addToBag}
            onPress={itemAddedToCart ? handleGoToCart : handleAddToCart}>
            <Text style={styles.bagText}>{itemAddedToCart ? "GO TO CART" : "ADD TO CART"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.addToBag} onPress={handleAddToCart}>
        <Text style={styles.bagText}>ADD TO CART</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFFFFF'},
  infoContainer: {padding: 16, paddingBottom: 70},
  brand: {fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333333'},
  desc: {color: '#757575', marginBottom: 15},
  priceRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 4},
  price: {fontSize: 18, fontWeight: 'bold', color: '#000'},
  mrp: {marginLeft: 8, textDecorationLine: 'line-through', color: '#888'},
  mrp1: {marginLeft: 8, color: '#888'},
  offer: {marginLeft: 8, color: 'green', fontWeight: 'bold', fontSize: 15},
  inclusive: {color: '#888', marginBottom: 15},
  tracker: {
    backgroundColor: '#e6ffe6',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
    color: 'green',
  },
  loader: {
    flex: 1,
    marginVertical: 20,
  },
  sectionTitle: {fontWeight: 'bold', marginTop: 16, marginBottom: 15},
  sectionTitle2: {marginTop: 4, marginBottom: 10, color: '#333333'},
  colorRow: {flexDirection: 'row', gap: 8, marginBottom: 8},
  colorImage: {width: 72, height: 96, borderRadius: 8, marginRight: 8},
  sizeRow: {flexDirection: 'row', marginBottom: 4, gap: 10},
  sizeBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    alignItems: 'center',
  },
  selectedSize: {borderColor: '#d00', backgroundColor: '#fee'},
  selectedImg: {
    borderColor: '#d00',
    width: 72,
    height: 96,
    borderRadius: 8,
    marginRight: 8,
  },
  sizeText: {fontWeight: 'bold', margin: 15},
  lowStock: {color: 'red', margin: 5},
  deliveryRow: {flexDirection: 'row', marginBottom: 12},
  input: {
    color: 'black',
    borderWidth: 1,
    borderColor: '#ccc',
    flex: 1,
    padding: 10,
    borderRadius: 6,
  },
  checkBtn: {
    backgroundColor: '#D45A8C',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 6,
    marginLeft: 8,
  },
  checkText: {color: '#fff', fontWeight: 'bold'},
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  featureCard: {
    backgroundColor: '#ffe9f0',
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  featureTitle: {
    color: '#D45A8C',
    fontWeight: 'bold',
    marginTop: 8,
  },
  featureSubtitle: {
    color: '#555',
    fontSize: 12,
  },
  returnBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe9f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 25,
  },
  returnTitle: {
    color: '#D45A8C',
    fontWeight: 'bold',
  },
  returnSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginHorizontal: 10,
  },
  featureCard2: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 1,
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  highlighted2: {
    backgroundColor: '#FFE9F0',
    borderWidth: 1.2,
    borderColor: '#D45A8C',
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    width: 40,
    height: 40,
    marginBottom: 6,
  },
  disabledText: {
    color: '#B0B0B0',
    opacity: 0.7,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginHorizontal: 10,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  disabledGridItem: {
    backgroundColor: '#E8ECEF',
    opacity: 0.6,
  },
  gridFabLabel: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 4,
    fontWeight: '500',
  },
  gridFabValue: {
    fontSize: 12,
    color: 'rgba(73, 62, 62, 1)',
  },
  gridLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  gridValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D45A8C',
  },
  bannerContainer: {
    paddingRight: 0,
  },
  addToBag: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    backgroundColor: '#D45A8C',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    zIndex: 10,
  },
  bagText: {color: '#fff', fontWeight: 'bold', fontSize: 16},
  image: {
    height: 470,
    width: '100%',
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    paddingTop: 50,
  },
  iconCircle: {
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 20,
  },
  bottomLeft: {
    position: 'absolute',
    bottom: 40,
    left: 20,
  },
  hotDeal: {
    backgroundColor: '#FF0000',
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  bottomRight: {
    position: 'absolute',
    bottom: 40,
    right: 10,
    backgroundColor: '#000000AA',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default ProductDetailedView;
