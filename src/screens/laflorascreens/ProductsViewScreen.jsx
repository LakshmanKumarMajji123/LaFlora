import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ViewPageProducts from './ViewPageProducts';
import { API_BASE_URL } from '@env';

const ProductsViewScreen = ({ navigation }) => {
  const [sortOption, setSortOption] = useState('default');
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState('Color');
  const [sortModalVisible, setSortModalVisible] = useState(false);

  const clearFilters = () => {
    setSelectedColors([]);
    setSelectedSizes([]);
  };

  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const colorOptions = ['Red', 'Green', 'Blue', 'Yellow', 'Black'];
  const sizeOptions = ['S', 'M', 'L', 'XL'];

  const [products, setProducts] = useState([]);
  const route = useRoute();
  const subCategoryId = route.params?.id;
  const subCategoryTitle = route.params?.title;

  console.log(
    `captured subcategoryId:-${subCategoryId}, subcategoryTitle:-${subCategoryTitle}`,
  );

  const api = axios.create({
    baseURL: API_BASE_URL ||  "http://192.168.0.114:8080",
  });

  // Request interceptor
  api.interceptors.request.use(config => {
    console.log('Request sent...', config);
    return config;
  });

  // Response interceptor
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

  // Fetch subcategory products
  const fetchSubcategoryProducts = useCallback(async () => {
    if (!subCategoryId) return;
    try {
      const response = await api.get(
        `/users/subCategoryProductsInfo?id=${subCategoryId}`,
      );
      if (response.data && response.data.status === 200) {
        setProducts(response.data.data);
      } else {
        setProducts([]);
        Alert.alert('Error', 'Failed to fetch subcategory products');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch subcategory products');
    }
  }, [api]);

  // Run fetch on mount or when subCategoryId changes
  useEffect(() => {
    fetchSubcategoryProducts();
  }, [subCategoryId]);

  // Handle missing subCategoryId or subCategoryTitle
  if (!subCategoryId) {
    Alert.alert('Error', 'Subcategory ID not provided');
    return null;
  }

  if (!subCategoryTitle) {
    Alert.alert('Error', 'Subcategory title not provided');
    return null;
  }

  const applyFilters = () => {
    let filtered = [...products];

    if (selectedColors.length > 0) {
      filtered = filtered.filter(product =>
        selectedColors.includes(product.color),
      );
    }

    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product =>
        selectedSizes.includes(product.size),
      );
    }

    setProducts(filtered); // optionally use setFilteredProducts if you're keeping original
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{subCategoryTitle}</Text>
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Search or Scan"
            placeholderTextColor="#888"
            style={styles.searchInput}
          />
          <TouchableOpacity>
            <Icon
              name="line-scan"
              size={18}
              color="#6E6E6E"
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon
              name="camera-outline"
              size={18}
              color="#6E6E6E"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('CartScreen')}>
          <Icon name="cart-outline" size={25} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.sortFilterRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setSortModalVisible(true)}>
          <Icon name="sort" size={16} color="#6E6E6E" />
          <Text style={styles.buttonText}> Sort</Text>
        </TouchableOpacity>

        <View style={styles.divider} />
        <TouchableOpacity
          style={styles.button}
          onPress={() => setFilterModalVisible(true)}>
          <Icon name="filter-outline" size={16} color="#6E6E6E" />
          <Text style={styles.buttonText}> Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Product List */}
      <ViewPageProducts
        products={products}
        sortOption={sortOption}
        selectedColors={selectedColors}
        selectedSizes={selectedSizes}
      />

      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setFilterModalVisible(false)}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Filter</Text>

            <View style={styles.filterContent}>
              {/* Left: Headings */}
              <View style={styles.filterHeadings}>
                {['Color', 'Size'].map(category => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => setSelectedFilterCategory(category)}
                    style={[
                      styles.filterHeadingItem,
                      selectedFilterCategory === category &&
                      styles.activeFilterHeadingItem,
                    ]}>
                    <Text
                      style={[
                        styles.filterHeadingText,
                        selectedFilterCategory === category &&
                        styles.activeFilterHeadingText,
                      ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Right: Options (only selected one) */}
              <View style={styles.filterOptions}>
                {selectedFilterCategory === 'Color' &&
                  colorOptions.map(color => (
                    <TouchableOpacity
                      key={color}
                      style={styles.optionRow}
                      onPress={() =>
                        setSelectedColors(prev =>
                          prev.includes(color)
                            ? prev.filter(c => c !== color)
                            : [...prev, color],
                        )
                      }>
                      <Icon
                        name={
                          selectedColors.includes(color)
                            ? 'checkbox-marked'
                            : 'checkbox-blank-outline'
                        }
                        size={20}
                        color="#D45A8C"
                      />
                      <Text style={styles.optionText}>{color}</Text>
                    </TouchableOpacity>
                  ))}

                {selectedFilterCategory === 'Size' &&
                  sizeOptions.map(size => (
                    <TouchableOpacity
                      key={size}
                      style={styles.optionRow}
                      onPress={() =>
                        setSelectedSizes(prev =>
                          prev.includes(size)
                            ? prev.filter(s => s !== size)
                            : [...prev, size],
                        )
                      }>
                      <Icon
                        name={
                          selectedSizes.includes(size)
                            ? 'checkbox-marked'
                            : 'checkbox-blank-outline'
                        }
                        size={20}
                        color="#D45A8C"
                      />
                      <Text style={styles.optionText}>{size}</Text>
                    </TouchableOpacity>
                  ))}
              </View>
            </View>

            {/* Apply / Clear Buttons */}
            <View style={styles.filterFooter}>
              <TouchableOpacity
                style={[styles.footerBtn, { backgroundColor: '#ccc' }]}
                onPress={clearFilters}>
                <Text style={styles.footerBtnText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.footerBtn, { backgroundColor: '#D45A8C' }]}
                onPress={applyFilters}>
                <Text style={[styles.footerBtnText, { color: '#fff' }]}>
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={sortModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSortModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSortModalVisible(false)}>
              <Icon name="close" size={22} color="#000" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Sort By</Text>

            {['default', 'priceLowToHigh', 'priceHighToLow', 'rating'].map(option => (
              <TouchableOpacity
                key={option}
                style={styles.optionRow}
                onPress={() => {
                  setSortOption(option);
                  setSortModalVisible(false);
                }}>
                <Icon
                  name={
                    sortOption === option ? 'radiobox-marked' : 'radiobox-blank'
                  }
                  size={20}
                  color="#D45A8C"
                />
                <Text style={styles.optionText}>
                  {option === 'default'
                    ? 'Default'
                    : option === 'priceLowToHigh'
                      ? 'Price: Low to High'
                      : option === 'priceHighToLow'
                        ? 'Price: High to Low'
                        : 'Rating'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,

  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D45A8C',
    paddingHorizontal: 15,
    height: 118,
    gap: 16,
    paddingTop: 30,
  },
  title: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 0,
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    flex: 3,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000',
  },
  icon: {
    marginLeft: 10,
  },
  sortFilterRow: {
    borderWidth: 0.5,
    flexDirection: 'row',
    borderColor: '#6E6E6E',
    height: 48,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    color: '#6E6E6E',
    fontWeight: 600,
  },
  divider: {
    width: 1,
    backgroundColor: '#6E6E6E',
  },
  cardsContainer: {},
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  checkboxLabel: {
    fontSize: 14,
    marginLeft: 8,
  },
  clearButton: {
    padding: 10,
    borderColor: '#D45A8C',
    borderWidth: 1,
    borderRadius: 6,
  },
  applyButton: {
    padding: 10,
    backgroundColor: '#D45A8C',
    borderRadius: 6,
    paddingHorizontal: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },

  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },

  filterContent: {
    flexDirection: 'row',
  },

  filterHeadings: {
    flex: 1,
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },

  filterOptions: {
    flex: 2,
    paddingLeft: 10,
  },

  filterHeadingText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
  },

  optionGroup: {
    marginBottom: 20,
  },

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  optionText: {
    marginLeft: 8,
    fontSize: 14,
  },

  filterFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  footerBtn: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },

  footerBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  filterHeadingItem: {
    paddingVertical: 12,
  },

  activeFilterHeadingItem: {
    backgroundColor: '#f5f5f5',
  },

  activeFilterHeadingText: {
    color: '#D45A8C',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
  },

});

export default ProductsViewScreen;
