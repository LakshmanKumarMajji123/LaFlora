import React, {useEffect, useState} from 'react';
import {
  FlatList,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {responsiveWidth} from 'react-native-responsive-dimensions';

const {width: screenWidth} = Dimensions.get('window');
const SIDE_SPACING = 16; // left and right padding
const MIDDLE_SPACING = 12; // between 2 cards
const CARD_WIDTH = (screenWidth - SIDE_SPACING * 2 - MIDDLE_SPACING) / 2;
const IMAGE_HEIGHT = CARD_WIDTH;

const ProductCard2 = ({item}) => {
  const navigation = useNavigation();
  const [wishlisted, setWishlisted] = useState(false);

  const {id} = item;
  console.log('particular product id..', id);

  const renderStars = rating => {
    const stars = [];
    const roundedRating = Math.round(rating * 2) / 2;
    const fullStars = Math.floor(roundedRating);
    const hasHalfStar = roundedRating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon
          key={`full-${i}`}
          name="star"
          size={16}
          color="#FFD700"
          style={{marginRight: 2}}
        />,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Icon
          key="half"
          name="star-half"
          size={16}
          color="#FFD700"
          style={{marginRight: 2}}
        />,
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon
          key={`empty-${i}`}
          name="star-border"
          size={16}
          color="#FFD700"
          style={{marginRight: 2}}
        />,
      );
    }

    return stars;
  };

  return (
    <TouchableOpacity
      style={{ marginVertical: 6}}
      onPress={() => navigation.navigate('ProductDetailedView', {id})}>
      <View style={styles.productsContainer}>
        <View style={styles.card2}>
          <View style={styles.imageWrapper}>
            <Image
              source={
                item.image
                  ? item.image
                  : require('../laflorascreens/assets/product1.png')
              }
              style={styles.image2}
              resizeMode="cover"
            />

            {/* Wishlist icon */}
            <TouchableOpacity
              style={styles.wishlistIcon}
              onPress={() => setWishlisted(!wishlisted)}>
              <Icon
                name={wishlisted ? 'favorite' : 'favorite-border'}
                size={22}
                color={wishlisted ? 'red' : '#999'}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.details}>
            <Text numberOfLines={1} style={styles.name}>{item.name}</Text>
            <Text numberOfLines={2}  style={styles.description}>{item.description}</Text>

            {/* Stars + number of ratings */}
            <View style={styles.starRow}>
              {renderStars(item.rating)}

              <Text style={styles.ratingCount}>({item.reviews})</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.mrpText2}>MRP</Text>
              <Text style={styles.price2}>₹{item.MRP}</Text>
            </View>
          </View>
        </View>        
      </View>
    </TouchableOpacity>
  );
};

export default function ViewPageProducts({products, sortOption, selectedColors, selectedSizes}) {
 const applyFiltersAndSort = () => {
  let filtered = [...products];

  if (selectedColors.length > 0) {
    filtered = filtered.filter(p =>
      selectedColors.includes(p.color)
    );
  }

  if (selectedSizes.length > 0) {
    filtered = filtered.filter(p =>
      selectedSizes.includes(p.size)
    );
  }

  switch (sortOption) {
    case 'priceLowToHigh':
      filtered.sort((a, b) => a.MRP - b.MRP);
      break;
    case 'priceHighToLow':
      filtered.sort((a, b) => b.MRP - a.MRP);
      break;
    case 'nameAZ':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'nameZA':
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default:
      break;
  }

  return filtered;
};

const finalProducts = applyFiltersAndSort();


  products.map(product =>
    console.log(
      `In ViewPageProducts, id-${product.id}: product is..., ${product.name}`,
    ),
  );

  const [loading, setLoading] = useState(true);

  //it handles on "products" prop
  useEffect(() => {
    if (products && products.length > 0) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [products]); //when product changes everytime it renders

  return loading ? (
    <ActivityIndicator style={styles.loader} size={'large'} color={'#0000ff'} />
  ) : (
    <FlatList
      data={finalProducts}
      numColumns={2}
      keyExtractor={item => item.id}
      renderItem={({item}) => <ProductCard2 item={item} />}
      contentContainerStyle={{
        paddingHorizontal: SIDE_SPACING,
        paddingVertical: 10,
      }}
      columnWrapperStyle={{
        justifyContent: 'space-between', // ensures equal left, right, and middle spacing
      }}
    />
  );
}

const styles = StyleSheet.create({
  card2: {
    width: CARD_WIDTH,
    borderRadius: 8,
    borderColor: '#FBCEEC',
    borderWidth: 1.5,
   // alignItems: 'center',
    backgroundColor: '#fff',
    height: 320,
    
    
  },
  imageWrapper: {
    position: 'relative',
      alignItems: 'center', // ✅ This centers the image horizontally

  },
  image2: {
    width: CARD_WIDTH-12 ,
    height: IMAGE_HEIGHT,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 8,

  },
  wishlistIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  details: {
    marginLeft: 10,
    marginRight: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#000',
  },
  description: {
    marginTop: 4,
    color: '#757575',
    fontSize: 12,
    lineHeight: 16,
    height: 32,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingCount: {
    marginLeft: 4,
    fontSize: 12,
    color: '#555',
  },
  priceContainer: {
    flexDirection: 'row',
    marginTop: 6,
  },
  mrpText2: {
    color: '#777',
    fontSize: 13,
    marginRight: 5,
  },
  price2: {
    fontSize: 16,
    fontWeight: '800',
  },
  loader: {
    flex: 1,
    marginVertical: 20,
  },
  optionRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 12,
},

optionText: {
  marginLeft: 10,
  fontSize: 15,
},

});
