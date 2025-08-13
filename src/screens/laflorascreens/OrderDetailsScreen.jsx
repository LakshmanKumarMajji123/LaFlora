import React from 'react';
import {
  View, Text, Image, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HeaderComponent from './HeaderComponent'; 



const OrderDetailsScreen = ({ navigation }) => {
    const steps = [
    {
      icon: 'check-circle',
      label: 'Order Confirmed, Oct 06',
      subText: '',
      active: true,
      color: '#000',
    },
    {
      icon: 'local-shipping',
      label: 'Shipped',
      subText: 'Your item has arrived at Facility, Mon 14 th Oct',
      active: true,
      color: '#000',
    },
    {
      icon: 'delivery-dining',
      label: 'Out For Delivery',
      subText: '',
      active: true,
      color: '#000',
    },
    {
      icon: 'access-time',
      label: 'Delivery, Sat Oct 19 (08:00 AM)-07:55 PM',
      subText: '',
      active: true,
      color: '#000',
    },
  ];
  return (
    <>
      {/* Header */}
         <HeaderComponent title="Order Details"/>

      
<ScrollView style={styles.container}>
  
      {/* Order ID */}
      <View style={styles.section}>
        <Text style={styles.orderId}>Order ID - 25233566562</Text>
     <View style={styles.separator2} />
      {/* Product Details */}
          <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>
          Floral Printed Empire Georgette Anarkali Kurta With Trouser & Dupatta
        </Text>
        <Text style={styles.brand}>Sitaram Designer</Text>
        <Text style={styles.seller}>Seller : Sitaram Designer</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹699</Text>
          <Text style={styles.originalPrice}>₹1299</Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-48%</Text>
          </View>
        </View>
      </View>

      <Image
       source={require('../laflorascreens/assets/product2.png')}
        style={styles.productImage}
      />
    </View>
      </View>









      {/* Order Status */}
         <View style={styles.container2}>
      <Text style={styles.sectionTitle}>Order Status</Text>
        <View style={styles.separator} />
      <View style={styles.timeline}>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <Icon
                name={step.icon}
                size={22}
                color={step.active ? step.color : '#ccc'}
                style={styles.icon}
              />
              {index !== steps.length - 1 && (
                <View
                  style={[
                    styles.verticalLine,
                    { backgroundColor: '#ccc' },
                  ]}
                />
              )}
            </View>
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.label,
                  { color: step.color },
                  step.active && { fontWeight: 'bold' },
                ]}
              >
                {step.label}
              </Text>
              {step.subText !== '' && (
                <Text style={styles.subText}>{step.subText}</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>



 <View style={styles.container3}>
      <Text style={styles.title3}>Shipping Details</Text>
      <View style={styles.separator} />

      <Text style={styles.text}>pavan</Text>
      <Text style={styles.text}>+91987654321</Text>
      <Text style={styles.text}>gmail@example.com</Text>
      <Text style={styles.text}>
         Main Rd, Rajahmundry, EastGodavari, AndhraPradesh 533103
      </Text>
    </View>








<View style={styles.orderPricingContainer}>
      {/* Pricing Details Section */}
      <View style={styles.orderPricingDetailsBox}>
        <Text style={styles.orderPricingTitle}>Pricing Details</Text>
        <View style={styles.orderPricingDivider} />

        <View style={styles.orderPricingRow}>
          <Text  >Total MPR</Text>
          <Text style={styles.orderPricingValue}>1819</Text>
        </View>

        <View style={styles.orderPricingRow}>
          <Text>Discount on MRP</Text>
          <Text style={[styles.orderPricingValue, { color: 'green' }]}>100</Text>
        </View>

        <View style={styles.orderPricingRow}>
          <Text>Same Day Delivery</Text>
          <Text style={styles.orderPricingValue}>+99</Text>
        </View>

        <View style={styles.orderPricingRow}>
          <Text>Platform Fee</Text>
          <Text style={styles.orderPricingValue}>10</Text>
        </View>

        <View style={styles.orderPricingRow}>
          <Text>Shipping Fee</Text>
          <Text style={[styles.orderPricingValue, { color: 'green' }]}>FREE</Text>
        </View>

        <View style={styles.orderPricingDivider} />

        <View style={styles.orderPricingRow}>
          <Text style={styles.orderPricingTotalLabel}>Total Amount</Text>
          <Text style={styles.orderPricingTotalValue}>1839</Text>
        </View>
      </View>

      {/* Bottom Actions Section */}
      <View style={styles.orderPricingBottomActions}>
        <TouchableOpacity style={styles.orderPricingActionButton}>
          <Icon name="cancel" size={20} color="#fff" />
          <Text style={styles.orderPricingActionText}>Cancel Order</Text>
        </TouchableOpacity>

        <View style={styles.orderPricingActionDivider} />

        <TouchableOpacity style={styles.orderPricingActionButton}>
          <Icon name="chat" size={20} color="#fff" />
          <Text style={styles.orderPricingActionText}>Chat with US</Text>
        </TouchableOpacity>
      </View>
    </View>

      
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF3F6' },
 

section:{
marginTop:10,
backgroundColor:"white"
},
  orderId: { fontSize: 14, fontWeight: '600', color: '#333' ,marginTop:20, paddingLeft:15},
  
  
  
  
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
   // borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    justifyContent: 'space-between',
  },
  infoContainer: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  brand: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 6,
  },
  seller: {
    fontSize: 12,
    color: '#555',
    marginVertical: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  discountBadge: {
    backgroundColor: '#FF792C',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productImage: {
    width: 90,
    height: 120,
    borderRadius: 6,
    alignSelf: 'center',
  },







  container2: {
    padding: 16,
   // borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor:"#ffffff",
    marginTop:16
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
    color: '#222',
  },
  timeline: {
    flexDirection: 'column',
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 30,
    alignItems: 'center',
    position: 'relative',
  },
  icon: {
    marginTop: 2,
  },
  verticalLine: {
    width: 2,
    height: 40,
    position: 'absolute',
    top: 26,
  },
  textContainer: {
    flex: 1,
    paddingLeft: 8,
  },
  label: {
    fontSize: 14,
  },
  subText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },










container3: {
    padding: 16,
    backgroundColor: '#fff',
  //  borderBottomWidth: 1,
    borderColor: '#eee',
    marginTop:16
  },
  title3: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  separator: {
    height: 1,
    backgroundColor: '#444',
    marginVertical: 8,
  },
  separator2: {
    height: 1,
    backgroundColor: 'lightgrey',
    marginVertical: 8,
    marginTop:15
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },












   orderPricingContainer: {
    backgroundColor: '#fff',
    marginTop:16
  },
  orderPricingDetailsBox: {
    padding: 16,
  },
  orderPricingTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  orderPricingDivider: {
    height: 1,
    backgroundColor: '#444',
    marginVertical: 8,
  },
  orderPricingValue:{
    fontWeight:700
  },
  orderPricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  pricingDetailsName:{
    fontFamily:"SF pro Display",
    fontWeight:400,
    fontSize:14,
letterSpacing:0,

  }
  ,
 
  orderPricingTotalLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  orderPricingTotalValue: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
  },
  orderPricingBottomActions: {
    flexDirection: 'row',
    backgroundColor: '#d23f69',
    paddingVertical: 12,
    justifyContent: 'space-around',
  },
  orderPricingActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  orderPricingActionText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
  },
  orderPricingActionDivider: {
    width: 1,
    backgroundColor: '#fff',
    height: 24,
    alignSelf: 'center',
  },
});

export default OrderDetailsScreen;
