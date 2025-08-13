import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

// const similarProducts = [
//   {
//     name: 'Sangria',
//     price: 1264,
//     mrp: 6499,
//     image: require('../laflorascreens/assets/product1.png'),
//   },
//   {
//     name: 'Khushal K',
//     price: 1253,
//     mrp: 6489,
//     image: require('../laflorascreens/assets/product2.png'),
//   },
//   {
//     name: 'KALINI',
//     price: 739,
//     mrp: 2654,
//     image: require('../laflorascreens/assets/product3.png'),
//   },
//   {
//     name: 'Sangria',
//     price: 1264,
//     mrp: 6499,
//     image: require('../laflorascreens/assets/product1.png'),
//   },
//   {
//     name: 'Khushal K',
//     price: 1253,
//     mrp: 6489,
//     image: require('../laflorascreens/assets/product2.png'),
//   },
//   {
//     name: 'KALINI',
//     price: 739,
//     mrp: 2654,
//     image: require('../laflorascreens/assets/product3.png'),
//   },
// ];

export default function SimilarProducts({ navigation }) {
  const [similarProducts, setSimilarProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchSimilarProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'https://dummyjson.com/c/6fc9-0d14-4b5a-be36',
      );
      const formattedData = response.data.map(item => ({
        name: item.name,
        price: item.price,
        mrp: item.mrp,
        image: { uri: item.image },
        description: item.description
      }));
      setSimilarProducts(formattedData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSimilarProducts();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#D45A8C" />
      </View>
    );
  }

  return (
    <>
      <View style={styles.similarHeader}>
        <View>
          <Text style={styles.sectionTitle}>SIMILAR PRODUCTS</Text>
          <Text style={styles.sectionSubTitle}>
            Customized Picks just for you
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('ProductsViewScreen')}>
          <View style={styles.seeallContainer}>
            <Text style={styles.seeAll}>See all</Text>
            <Icon name="chevron-right" size={20} color="#D81159" />
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        data={similarProducts}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 20 }}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('ProductDetailedView')}>
            <View style={styles.productCard}>
              <Image source={item.image} style={styles.productImage} />
              <Text numberOfLines={1} style={styles.productName}>{item.name}</Text>
              <Text numberOfLines={2} style={styles.productDesc}>
                {item.description}
              </Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>₹{item.price}</Text>
                <Text style={styles.mrp2}>MRP ₹</Text>
                <Text style={styles.mrp}>{item.mrp}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  similarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontStyle: 'bold',
    fontWeight: 700,
    fontFamily: 'SF Pro Display',
    letterSpacing: 0,
    color: '#000000',
  },
  sectionSubTitle: {
    marginBottom: 10,
    color: '#919191',
    fontSize: 14,
    fontWeight: 400,
    fontFamily: 'SF Pro Display',
    style: 'regular',
    letterSpacing: 0,
  },
  seeallContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  seeAll: {
    fontSize: 14,
    color: '#D81159',
    fontWeight: 400,
    fontFamily: 'Gilroy-SemiBold',
    letterSpacing: 0,
  },

  productCard: {
    height: 213,
    width: 131,
    marginLeft: 16,
    marginBottom: 40,
    resizeMode: 'contain',
  },
  productImage: {
    width: '131',
    height: 128,
    borderRadius: 8,
    marginBottom: 5,
    resizeMode: 'stretch',
  },
  productName: {
    fontWeight: '700',
    fontStyle: 'Bold',
    fontSize: 14,
    marginBottom: 5,
  },
  productDesc: {
    fontSize: 12,
    color: '#777',
    letterSpacing: 0,
    marginBottom: 7,
    style: 'reular',
  },
  priceRow: { flexDirection: 'row', alignItems: 'center' },
  price: {
    fontWeight: '700',
    marginRight: 5,
    color: '#D45A8C',
    fontSize: 16,
    fontFamily: 'SF Pro Display',
    style: 'Bold',
    letterSpacing: 0,
  },
  mrp: { textDecorationLine: 'line-through', color: '#888', fontSize: 12 },
  mrp2: { color: '#888', fontSize: 12 },
});
