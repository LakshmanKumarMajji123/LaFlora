import React, {useState, useEffect} from 'react';
import axios from 'axios';

import Carousel from 'react-native-reanimated-carousel';
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';

const {width} = Dimensions.get('window');

// const banners = [
//   {id: 1, image: require('../laflorascreens/assets/card1.png')},
//   {id: 2, image: require('../laflorascreens/assets/card2.jpg')},
//   {id: 3, image: require('../laflorascreens/assets/card3.jpg')},
// ];

export default function CarouselComponent({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        setLoading(true);
        setError(null);

        // Replace this with your actual endpoint
        const response = await axios.get('https://dummyjson.com/c/beeb-e753-4344-baab');

        // Format data to fit carousel needs
        const formatted = response.data.map(item => ({
          id: item.id,
          imageUrl: item.banner,
        }));

        setBanners(formatted);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load banners. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadBanners();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#757575" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Carousel
        loop
        width={width}
        height={125}
        autoPlay
        autoPlayInterval={3000}
        data={banners}
        scrollAnimationDuration={1000}
        onSnapToItem={index => setCurrentIndex(index)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.image}
              resizeMode="cover"
              onError={e => {
                console.log('Failed to load image:', e.nativeEvent.error);
              }}
            />
          </View>
        )}
      />

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 8,
  },
  card: {
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 15,
    backgroundColor: '#eee',
  },
  image: {
    width: '100%',
    height: 125,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 50,
    marginHorizontal: 4,
    backgroundColor: '#ccc',
  },
  activeDot: {
    backgroundColor: '#757575',
    width: 8,
    height: 8,
    borderRadius: 50,
  },
});
