import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform, keyboard
} from 'react-native';
import React, { useRef, useState } from 'react';
//import { useNavigation } from '@react-navigation/native';
import imagePath from '../laflorascreens/assets/219d65e19212c815c2f6736443cd1e9d64eae6e1.png';
import axios from 'axios';
import { API_BASE_URL } from '@env';
import commonStyles from '../../commonstyles/CommonStyles';



const LoginScreen = ({ navigation }) => {

  const api = axios.create({
    baseURL: API_BASE_URL || "http://192.168.0.114:8080"
  });

  //request
  api.interceptors.request.use(config => {
    console.log("Request sent...", config)
    return config;
  });

  //response
  api.interceptors.response.use(response => {
    console.log("Response received...", response)
    return response;
  },
    error => {
      console.error('Response error...', error);
      return Promise.reject(error);
    });

  const [phoneInValid, setPhoneInValid] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  console.log("phone number is..", phonenumber);

  const phoneInputRef = useRef(null);

  const loginReset = () => {
    setPhonenumber('');
    setPhoneInValid(false);
  };

  const handleInputFocus = ref => {
    if (ref === phoneInputRef) {
      setPhoneInValid(false)
      //setText(false)
    }

  }

  const handleSubmit = async () => {
    //keyboard.dismiss(); //hidden keyboard
   
    // Validate phone number
    if (!phonenumber) {
      setPhoneInValid(true);
    } else if (!phonenumber || !/^\d{10}$/.test(phonenumber)) {
      setPhoneInValid(true);
    } else {
      setPhoneInValid(false);
    }

    try {
      const response = await api.post("/users/login", { phonenumber });
      console.log("login response is...", response.data);

      //check both HTTP status (response.status == 200) and application status (response.data.status === 200)
      if (response.status && response.data.status === 200) {
        let registerinfo = response.data.data;
        Alert.alert(`${response.data.msg || "OTP sent successfully"} to - ${phonenumber}`);
        setTimeout(() => {
          navigation.navigate('VerificationForm', {registerinfo});
          loginReset();
        }, 1000);

      } else if (response.data.status === 400) {

        console.log("Login failed", response.data.error);

        setTimeout(() => {
          navigation.navigate("RegisterForm");
          loginReset();
        }, 1000);

      } else if (response.data.status === 500) {
        Alert.alert('Error', response.data.error || 'Failed to send OTP');
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again');
      }

    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred. Please try again");
      console.error("Request error:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/**---Image---*/}
        <View style={styles.loginHeader}>
          <Image style={styles.imageStyle} source={imagePath} />
          <Text style={styles.logInText}>Log In</Text>
        </View>

        {/**--content--*/}
        <View style={styles.logInBody}>
          <Text style={styles.logInDescription}>
            Please Enter Your Phone number to Continue
          </Text>

          <View style={styles.inputBox}>
            <Text style={styles.inputText}>
              Phone Number<Text style={{ color: 'rgb(225, 16, 65)', fontSize: 16 }}>*</Text>
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={phoneInputRef}
                value={phonenumber}
                style={[styles.input, phoneInValid ? styles.errorInput : null]}
                placeholder="Enter Phone Number"
                placeholderTextColor='#888'
                keyboardType="phone-pad"
                maxLength={10}
                onChangeText={text => {
                  setPhonenumber(text);
                  setPhoneInValid(false); // Reset invalid state on change
                }}
                onFocus={() => handleInputFocus(phoneInputRef)}
                accessibilityLabel="Phone number input, required"
              />
              {/**  {phoneInValid && !phonenumber && <Text style={styles.errorText}>Phone number is required</Text>}
                     {phoneInValid && phonenumber && !/^\d{10}$/.test(phonenumber) && (
                       <Text style={styles.errorText}>Phone number must be 10 digits</Text>
                     )} */}
              {phoneInValid && (
                <Text style={styles.borderErrorText}>
                  {!phonenumber ? 'Phone number is required' : 'Phone number must be 10 digits'}
                </Text>
              )}
            </View>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Request OTP</Text>
          </TouchableOpacity>
        </View>

        {/**--Acnt Check---*/}
        <View style={styles.acntCheck}>
          <View>
            <Text style={styles.acntCheckTxt}>Don't have an account?</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('RegisterForm')}>
            <View>
              <Text
                style={{
                  fontSize: 18,
                  color: 'rgb(232, 23, 72)',
                  fontWeight: 'bold',
                 // textDecorationLine: 'underline',
                }}>
                Sign Up
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  loginHeader: {
    padding: 15,
    backgroundColor: 'rgb(240, 226, 226)',
    marginBottom: 10,
    paddingVertical: 30
  },

  imageStyle: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: 'contain',
    // objectFit:"contain"
    marginLeft: 123,
    marginTop: 20,
  },
  logInText: {
    color: '#D45A8C',
    fontWeight: 'bold',
    fontFamily: 'Rubic',
    fontSize: 32,
    letterSpacing:0,
    paddingLeft: 20,
    fontWeight:700,
    
  },

  logInBody: {
    padding: 15,

  },
  logInDescription: {
    fontSize: 20,
    fontWeight: 500,
    marginBottom: 25,
    textAlign:"center",
    color:"#3D3D3D"
    

  },
  inputWrapper: {
    position: 'relative',
  },
  inputBox: {
    marginBottom: 30,
    backgroundColor: '#fffff',
    color:"#666666",
    paddingHorizontal:16,
    paddingVertical:20,
    gap:8
    
  },
  inputText: {
    fontSize: 17,
    marginBottom: 10,
    fontWeight: 500,
    lineHeight:24,
    color:"#000000"
  },
  input: {
 
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: '#3D3D3D',
    borderRadius: 8,
    fontSize: 18,
    fontWeight: 400,
    color:"#3D3D3D"
    
  },
  errorInput: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'rgba(229, 36, 36, 1)',
    boxShadow: 'rgba(229, 36, 36, 1)',
    borderRadius: 5,
    shadowColor: 'rgba(229, 36, 36, 1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 2,
    elevation: 2,
    fontSize: 17,
    fontWeight: 300
  },
  borderErrorText: {
    position: 'absolute',
    top: -8,
    left: 12,
    backgroundColor: "#fff", // Background to make text readable over the border
    paddingHorizontal: 5,
    color: 'red',
    fontSize: 12,
    fontWeight: '500',
  },
  submitButton: {
    height: 48,
    backgroundColor: '#DD4455',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginHorizontal:20
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  acntCheck: {
    borderColor: '#ffffff',
    padding: 15,
    marginTop: "auto",
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 'auto',
  },
  acntCheckTxt: {
    fontSize: 18,
    fontWeight: 400,
    marginHorizontal: 5,
  },
});

export default LoginScreen;
