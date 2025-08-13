import { Image, ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, keyboard } from 'react-native';
import React, { useRef, useState } from 'react';

import imagePath from '../laflorascreens/assets/219d65e19212c815c2f6736443cd1e9d64eae6e1.png';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '@env';
import axios from 'axios';

const RegisterScreen = () => {
  const api = axios.create({
    baseURL: API_BASE_URL || "http://192.168.0.144:8080"
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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("")
  const [phonenumber, setPhonenumber] = useState("");

  console.log("name is...", name);
  console.log("email is...", email);
  console.log("phone is...", phonenumber);

  //Error
  const [nameInValid, setNameInValid] = useState("");
  const [emailInValid, setEmailInValid] = useState("");
  const [phoneInValid, setPhoneInValid] = useState("");

  const [nameText, setNameText] = useState("");
  const [emailText, setEmailText] = useState("");
  const [phoneText, setPhoneText] = useState("");

  const scrollViewRef = useRef(null);
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const phoneInputRef = useRef(null);

  const navigation = useNavigation();

  //function to scrollto focused input
  const handleInputFocus = (inputRef) => {
    if (scrollViewRef.current && inputRef.current) {
      inputRef.current.measureLayout(
        scrollViewRef.current, // Use the ScrollView ref directly
        (x, y) => {
          scrollViewRef.current.scrollTo({ y, animated: true });
        },
        (error) => {
          console.error('Error measuring layout:', error);
        }
      );
    }

    if (inputRef === nameInputRef) {
      setNameInValid(false);
      //setNameText(false);
    }

    if (inputRef === emailInputRef) {
      setEmailInValid(false);
      //setEmailText(false);
    }

    if (inputRef === phoneInputRef) {
      setPhoneInValid(false);
      //setPhoneText(false);
    }
  };


  const handleResetForm = () => {
    setName('');
    setEmail('');
    setPhonenumber('');
    setNameInValid(false);
    setEmailInValid(false);
    setPhoneInValid(false);
  }



  const handleSubmit = async () => {
    //Hide keyboard
    //keyboard.dismiss();
    let hasError = false;

    // Validate name
    if (!name) {
      setNameInValid(true);
      hasError = true;
    } else if (!/^[a-zA-Z\s'-]{2,50}$/.test(name)) {
      setNameInValid(true);
      hasError = true;
    } else {
      setNameInValid(false);
    }



    // Validate email (standard email format)
    if (!email) {
      setEmailInValid(true);
      hasError = true;
    } else if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailInValid(true);
      hasError = true;
    } else {
      setEmailInValid(false);
    }

    // Validate phone number
    if (!phonenumber) {
      setPhoneInValid(true);
      hasError = true;
    } else if (!phonenumber || !/^\d{10}$/.test(phonenumber)) {
      setPhoneInValid(true);
      hasError = true;
    } else {
      setPhoneInValid(false);
    }

    // Stop if there are any errors
    if (hasError) {
      Alert.alert('Invalid Details', 'Please fill in all required fields correctly.');
      return;
    }

    const payload = {
      name: name,
      email: email,
      phone: phonenumber
    }
    console.log("Payload is...", payload);


    try {
      const response = await api.post("/users/register", payload);
      console.log("login response is...", response.data);

      if (response.status === 200) {
        Alert.alert("You are Succcessfully Registered!");
        handleResetForm();
        navigation.navigate("LoginForm");

      } else if (response.status === 400) {
        Alert.alert("Error", response.data.error || "Please Fill the details Correctly to sign up.");

      } else if (response.status === 500) {
        Alert.alert("Error", response.data.error);

      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again');
      }

    } catch (error) {

      Alert.alert("Error", "An unexpected error occurred. Please try again");
      console.error("Request error:", error);
    }


  };

  /**.then(data => console.log("Reg data is", data))
   * This block logs the data but does not return anything. In JavaScript, if a .then handler does not explicitly return a value, it implicitly returns undefined. As a result, the next .then block receives undefined as its data argument, leading to the error when you try to access data.status.
  
  Why Navigation Doesn't Happen
  Even though the server responds with { status: 200, msg: "User has been Registered" }, the navigation to LoginForm doesn't occur because the code in the third .then block fails due to the undefined value of data.
   */


  return (
    <KeyboardAvoidingView style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
      <ScrollView ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>

        {/**---Header---*/}
        <View style={styles.registerHeader}>
          <Image style={styles.imageStyle} source={imagePath} />
          <Text style={styles.signInText}>Sign In</Text>
        </View>

        {/**--Body--*/}
        <View style={styles.registerBody}>
          <Text style={styles.registerDescription}>
            Please fill the following form with your personal information</Text>

          <View style={styles.inputBox}>
            <Text style={styles.inputText}>Name<Text style={{ color: "rgb(225, 16, 65)", fontSize: 16 }}>*</Text></Text>
            <View style={styles.inputWrapper}>
              <TextInput ref={nameInputRef} value={name} style={[styles.input, nameInValid ? styles.errorInput : null]} placeholder="John Denn"  //{nameText ? "Enter Name" : "Ex: John Denn"}
                placeholderTextColor="#888"
                onChangeText={text => {
                  setName(text);
                  setNameInValid(false);
                }}
                onFocus={() => handleInputFocus(nameInputRef)}
                accessibilityLabel='Name input, required' />
              {nameInValid && (
                <Text style={styles.borderErrorText}>
                  {!name ? 'Name is required' : 'Invalid name format'}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.inputText}>
              Email<Text style={{ color: 'rgb(225, 16, 65)', fontSize: 16 }}>*</Text>
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={emailInputRef}
                value={email}
                style={[styles.input, emailInValid ? styles.errorInput : null]}
                placeholder="john@gmail.com"
                placeholderTextColor='#888'
                keyboardType="email-address"
                onChangeText={text => {
                  setEmail(text);
                  setEmailInValid(false); // Reset invalid state on change
                }}
                onFocus={() => handleInputFocus(emailInputRef)}
                accessibilityLabel="Email input, required"
              />
              {   /*  {emailInValid && !email && <Text style={styles.errorText}>Email is required</Text>} 
            {emailInValid && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
              <Text style={styles.errorText}>Invalid email format</Text>
            )} */}
              {emailInValid && (
                <Text style={styles.borderErrorText}>
                  {!email ? 'Email is required' : 'Invalid email format'}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.inputText}>
              Phone number<Text style={{ color: 'rgb(225, 16, 65)', fontSize: 16 }}>*</Text>
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={phoneInputRef}
                value={phonenumber}
                style={[styles.input, phoneInValid ? styles.errorInput : null]}
                placeholder="+91 9898 9898 98"
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

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.acntCheck}>
          <Text style={styles.acntCheckTxt}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('LoginForm')}>
            <Text
              style={{
                fontSize: 18,
                color: 'rgb(232, 23, 72)',
                fontWeight: 'bold',
                textDecorationLine: 'underline',
              }}
            >
              Log In
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>


    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1
  },

  registerHeader: {
    padding: 15,
    backgroundColor: "rgb(240, 226, 226)",
    marginBottom: 0,
    paddingVertical: 40,
  },

  imageStyle: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: 'contain',
    // objectFit:"contain"
    marginLeft: 123,
    marginTop: 20
  },
  signInText: {
    color: "rgb(233, 100, 153)",
    fontWeight: "bold",
    fontFamily: "Arail",
    fontSize: 30,
    paddingHorizontal: 20
  },
  registerBody: {
    padding: 15,
    marginTop: 0,
    backgroundColor: "#fffff"
  },
  registerDescription: {
    paddingHorizontal: 26,
    fontSize: 15,
    fontWeight: 400,
    marginBottom: 20,
  },
  inputBox: {
    marginBottom: 25,
    backgroundColor: "#fffff"
  },
  inputWrapper: {
    position: 'relative',
  },
  inputText: {
    fontSize: 15,
    marginBottom: 10
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingTop: 10, // Add padding to avoid overlap with error text
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 2,
    elevation: 2,
    fontSize: 17,
    fontWeight: '300',
  },
  errorInput: {
    width: "100%",
    height: 55,
    backgroundColor: "#fffff",
    paddingHorizontal: 15,
    borderColor: 'rgba(192, 26, 26, 1)',
    borderWidth: 1,
    borderRadius: 5,
    shadowColor: "#rgba(192, 26, 26, 1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 2,
    elevation: 2
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
    width: '100%',
    height: 50,
    backgroundColor: 'rgb(220, 38, 90)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  acntCheck: {
    backgroundColor: '#fffff',
    padding: 30,
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  acntCheckTxt: {
    fontSize: 18,
    fontWeight: '400',
    marginHorizontal: 5,
  },

});


export default RegisterScreen;