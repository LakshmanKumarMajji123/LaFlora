import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const CartPageProductCard = ({ item, onRemove }) => {
  const [selectedSize, setSelectedSize] = useState('L');
  const [selectedQty, setSelectedQty] = useState('1');

  const [showSizeModal, setShowSizeModal] = useState(false);
  const [showQtyModal, setShowQtyModal] = useState(false);

  const sizes = ['S', 'M', 'L', 'XL'];
  const qtys = ['1', '2', '3', '4'];

  const renderOption = (item, onSelect) => (
    <TouchableOpacity onPress={() => onSelect(item)} style={styles.optionItem}>
      <Text style={styles.optionText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.card}>
      <View style={styles.productBox}>
        <Image
          source={require('../laflorascreens/assets/product2.png')}
          style={styles.productImage}
        />

        <View style={styles.productInfo}>
          <Text style={styles.title}>Sitaram Designer</Text>
          <Text style={styles.subtitle}>
            Floral Printed Empire Georgette Anarkali Kurta With Trouser &
            Dupatta
          </Text>
          <Text style={styles.pinkText}>Buy 2 For 999 offer applicable</Text>
        </View>

        <View>
          <TouchableOpacity style={styles.closeBtn} onPress={onRemove}>
            <Icon name="close" size={20} color="#888" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Row with Dropdowns & Price */}
      <View style={styles.bottomRow}>
        {/* Left: Dropdowns */}
        <View style={styles.dropdownRow}>
          {/* Size */}
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowSizeModal(true)}>
            <Text style={styles.dropdownText}>
              Size : <Text style={styles.value}>{selectedSize}</Text>
            </Text>
            <Icon name="chevron-down" size={18} color="#D45A8C" />
          </TouchableOpacity>

          {/* Qty */}
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowQtyModal(true)}>
            <Text style={styles.dropdownText}>
              Qty : <Text style={styles.value}>{selectedQty}</Text>
            </Text>
            <Icon name="chevron-down" size={18} color="#D45A8C" />
          </TouchableOpacity>
        </View>

        {/* Size Modal */}
        <Modal transparent visible={showSizeModal} animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setShowSizeModal(false)}>
            <View style={styles.modalBox}>
              <FlatList
                data={sizes}
                keyExtractor={item => item}
                renderItem={({ item }) =>
                  renderOption(item, selected => {
                    setSelectedSize(selected);
                    setShowSizeModal(false);
                  })
                }
              />
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Quantity Modal */}
        <Modal transparent visible={showQtyModal} animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setShowQtyModal(false)}>
            <View style={styles.modalBox}>
              <FlatList
                data={qtys}
                keyExtractor={item => item}
                renderItem={({ item }) =>
                  renderOption(item, selected => {
                    setSelectedQty(selected);
                    setShowQtyModal(false);
                  })
                }
              />
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Right: Price */}
        <View style={styles.priceBox}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹699</Text>
            <Text style={styles.strike}>₹1299</Text>
          </View>
          <Text style={styles.saving}>You saved ₹600!</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    borderRadius: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    marginVertical: 5
  },
  productBox: {
    flexDirection: 'row',
    position: 'relative',
  },
  productImage: {
    width: 100,
    height: 130,
    borderRadius: 10,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 30,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 12,
    color: '#757575',
    marginVertical: 10,
    fontWeight: '500',
  },
  pinkText: {
    color: '#D45A8C',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '700',
  },
  closeBtn: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  bottomRow: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginHorizontal: 10,
  },

  dropdownRow: {
    flexDirection: 'row',
    backgroundColor: '#FFF3F6',
    borderRadius: 5,
    gap: 11,
    justifyContent: 'center',
    height: 26,
    width: 145,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D45A8C',
    // marginRight: 4,
  },
  value: {
    fontWeight: '700',
    color: '#D45A8C',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    width: 100,
    borderRadius: 10,
    paddingVertical: 10,
  },
  optionItem: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },

  priceBox: {
    alignItems: 'flex-end',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  strike: {
    textDecorationLine: 'line-through',
    color: '#999',
    fontSize: 14,
  },
  saving: {
    color: 'green',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '400',
  },
});

export default CartPageProductCard;
