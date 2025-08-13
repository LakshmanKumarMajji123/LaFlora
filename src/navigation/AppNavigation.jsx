import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/laflorascreens/HomeScreen';
import ProductsViewScreen from '../screens/laflorascreens/ProductsViewScreen';
import ProductDetailedView from '../screens/laflorascreens/ProductDetailedView';
import ViewPageProducts from '../screens/laflorascreens/ViewPageProducts';
import Profile from '../screens/laflorascreens/Profile';
import SimilarProducts from '../screens/laflorascreens/SimilarProducts';
import CarouselComponent from '../screens/laflorascreens/CarouselComponent';
import CartScreen from '../screens/laflorascreens/CartScreen';
import PaymentScreen from '../screens/laflorascreens/PaymentScreen';
import ApplyCouponScreen from '../screens/laflorascreens/ApplyCouponScreen';
import OrdersScreen from '../screens/laflorascreens/OrdersScreen';
import OrderDetailsScreen from '../screens/laflorascreens/OrderDetailsScreen';
import CustomModal from '../components/CustomModel';
import MyAddresses from '../screens/laflorascreens/profileScreenOptions/MyAddresses';
import AddAddress from '../screens/laflorascreens/profileScreenOptions/AddAddress';
import NotificationsScreen from '../screens/laflorascreens/NotificationsScreen';
import Wishlist from '../screens/laflorascreens/Wishlist';

import EditProfile from '../screens/laflorascreens/profileScreenOptions/EditProfile';
import Support from '../screens/laflorascreens/profileScreenOptions/Support';
import AppFeedback from '../screens/laflorascreens/profileScreenOptions/AppFeedback';
import PrivacyPolicy from '../screens/laflorascreens/profileScreenOptions/PrivacyPolicy';
import TermsAndConditions from '../screens/laflorascreens/profileScreenOptions/TermsAndConditions';
import RefundPolicy from '../screens/laflorascreens/profileScreenOptions/RefundPolicy';
import CheckForUpdates from '../screens/laflorascreens/profileScreenOptions/CheckForUpdates';

import LoginScreen from '../screens/Authenticationscreens/LoginScreen';
import RegisterScreen from '../screens/Authenticationscreens/RegisterScreen';
import VerificationScreen from '../screens/Authenticationscreens/VerificationScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

//default screen component for the other tabs
const Screen = () => (
  <View style={styles.container}>
    <Text style={styles.text}> Soon</Text>
  </View>
);

const BottomTab = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarButton: props => (
            <Pressable
              {...props}
              android_ripple={null} // Disable ripple effect on Android
              style={({pressed}) => [
                props.style,
                {opacity: pressed ? 1 : 1}, // Set opacity to 1 to remove the press effect
              ]}
            />
          ),
          tabBarIcon: ({focused, color, size}) => {
            switch (route.name) {
              case 'Home':
                return (
                  <Ionicons
                    name={focused ? 'home' : 'home-outline'}
                    size={24}
                    color={color}
                  />
                );
              case 'Shop':
                return (
                  <Ionicons
                    name={focused ? 'storefront' : 'storefront-outline'}
                    size={24}
                    color={color}
                  />
                );
              case 'Salon':
                return (
                  <Ionicons
                    name={focused ? 'heart' : 'heart-outline'}
                    size={24}
                    color={color}
                  />
                );
              case 'Orders':
                return (
                  <Ionicons
                    name={focused ? 'list' : 'list'}
                    size={24}
                    color={color}
                  />
                );
              case 'Profile':
                return (
                  <Ionicons
                    name={focused ? 'person' : 'person-outline'}
                    size={24}
                    color={color}
                  />
                );
              default:
                return null;
            }
          },

          tabBarLabel: ({focused, color}) => (
            <Text
              style={{
                color: color,
                fontSize: 12,
                fontWeight: focused ? '700' : '400',
              }}>
              {route.name}
            </Text>
          ),
          tabBarActiveTintColor: '#D45A8C', // pink color
          tabBarInactiveTintColor: '#6E6E6E', // gray color
          tabBarStyle: {
            height: 70,
            paddingTop: 7,
            paddingLeft: 8,
            paddingRight: 8,
            borderColor: '#D45A8C',
            borderTopWidth: 1,
          },
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen
          name="Shop"
          component={Screen}
          listeners={({navigation}) => ({
            tabPress: e => {
              e.preventDefault();
              setModalVisible(true);
            },
          })}
        />
        <Tab.Screen
          name="Salon"
          component={Screen}
          listeners={({navigation}) => ({
            tabPress: e => {
              e.preventDefault();
              setModalVisible(true);
              //alert("This tab is blocked and cannot be accessed.");
            },
          })}
        />
        <Tab.Screen name="Orders" component={OrdersScreen} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
      <View>
        <CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          message="This tab is currently unavailable. Please try again later."
        />
      </View>
    </View>
  );
};

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {/* <Stack.Screen name="LoginForm" component={LoginScreen} />
        <Stack.Screen name="RegisterForm" component={RegisterScreen} />
        <Stack.Screen name="VerificationForm" component={VerificationScreen} /> */}
        <Stack.Screen name="BottomTab" component={BottomTab} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen
          name="ProductsViewScreen"
          component={ProductsViewScreen}
        />
        <Stack.Screen
          name="ProductDetailedView"
          component={ProductDetailedView}
        />
        <Stack.Screen name="ViewPageProducts" component={ViewPageProducts} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="SimilarProducts" component={SimilarProducts} />
        <Stack.Screen name="CarouselComponent" component={CarouselComponent} />
        <Stack.Screen name="CartScreen" component={CartScreen} />
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
        <Stack.Screen name="ApplyCouponScreen" component={ApplyCouponScreen} />

        <Stack.Screen
          name="OrderDetailsScreen"
          component={OrderDetailsScreen}
        />
        <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
        <Stack.Screen
          name="NotificationsScreen"
          component={NotificationsScreen}
        />
        <Stack.Screen name="Wishlist" component={Wishlist} />

        {/* */}
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="MyAddresses" component={MyAddresses} />
        <Stack.Screen name="AddAddress" component={AddAddress} />
        <Stack.Screen name="Support" component={Support} />
        <Stack.Screen name="AppFeedback" component={AppFeedback} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <Stack.Screen
          name="TermsAndConditions"
          component={TermsAndConditions}
        />
        <Stack.Screen name="RefundPolicy" component={RefundPolicy} />
        <Stack.Screen name="CheckForUpdates" component={CheckForUpdates} />
        {/* */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  text: {fontSize: 20},
});

{
  /*import React from 'react';

const AppNavigation = () => {
  return (
   <></>
  );
};

export default AppNavigation;
*/
}
