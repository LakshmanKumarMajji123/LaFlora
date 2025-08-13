import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderComponent from './HeaderComponent';

const ProfileScreen = ({navigation}) => {
 const options = [
  {
    icon: 'clipboard-list',
    title: 'My Orders',
    subtitle: 'View, modify and track orders',
    screen: 'OrdersScreen',
  },
  {
    icon: 'heart-outline',
    title: 'My Wishlist',
    subtitle: 'View and manage your wishlist items',
    screen: 'Wishlist', 
  },
  {
    icon: 'credit-card-outline',
    title: 'My Payments',
    subtitle: 'View and modify payment methods',
    screen: 'PaymentsScreen',
  },
  {
    icon: 'map-marker-radius',
    title: 'My Addresses',
    subtitle: 'Edit, add or remove addresses',
    screen: 'MyAddresses',
  },
  {
    icon: 'account-outline',
    title: 'My Profile',
    subtitle: 'Edit personal info, change password',
    screen: 'EditProfile',
  },
 
  
];


  return (
    <>
     <HeaderComponent title="Profile" />
  
    
    <ScrollView style={styles.container}>
     

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
          <Image
            source={{uri: 'https://randomuser.me/api/portraits/men/1.jpg'}}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>User</Text>
            <Text style={styles.email}>example@gmail.com</Text>
            <Text style={styles.phone}>9876543210</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton}
                onPress={() => navigation.navigate('EditProfile')}>

          <Text style={styles.editButtonText}>EDIT PROFILE</Text>
        </TouchableOpacity>
      </View>

      {/* Option List */}
      <View style={styles.optionsList}>
        {options.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionItem}
            onPress={() => navigation.navigate(item.screen)}>
            <View style={styles.optionLeft}>
              <Icon name={item.icon} size={22} color="#555" />
              <View style={{marginLeft: 20}}>
                <Text style={styles.optionTitle}>{item.title}</Text>
                <Text style={styles.optionSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={20} color="#888" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
      </>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  profileCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 151,
    borderColor: '#BDBDBD',
    borderWidth: 1,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 40,
  },
  profileInfo: {
    marginLeft: 26,
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#2C2C2C',
    paddingBottom: '5',
  },
  email: {
    fontSize: 14,
    color: '#666',
    paddingBottom: '5',
  },
  phone: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    backgroundColor: '#D45A8C',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 25,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  optionsList: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 10,
    paddingVertical: 10,
  },
  optionItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C2C2C',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 8,
    marginBottom: 10,
  },
});
