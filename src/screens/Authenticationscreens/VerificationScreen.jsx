import { Image, ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import imagePath from '../laflorascreens/assets/219d65e19212c815c2f6736443cd1e9d64eae6e1.png';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from '@env';

const VerificationScreen = ({ navigation }) => {
  const route = useRoute();
  console.log("verification screen received num is...", { routeparams: route.params });

  const api = axios.create({
    baseURL: API_BASE_URL || "http://192.168.0.114:8080"
  });

  //request
  api.interceptors.request.use(config => {
    console.log("Request sent...", config)
    return config
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


  let Id, Name, Email, Phone;

  const registerData = route.params?.registerinfo;
  //console.log("registerdata in verification screen:", registerData);

  registerData.map((item) => {
    const { id, name, email, phonenumber } = item;
    Id = id;
    Name = name;
    Email = email;
    Phone = phonenumber;
  });

  console.log(`id:-${Id} name:-${Name} email:-${Email} phone:-${Phone}`);

  if (!Phone) {
    Alert.alert("Error", "Phone number not provided");
    navigation.goBack();
    return null;
  }

  const [otp, setOtp] = useState(['', '', '', '']); //4 digit
  const [timeLeft, setTimeLeft] = useState(30); //30 sec 
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const otpInputs = useRef([]); //Refs for OTP input fiels
  const timerRef = useRef(null);

  //Timer
  console.log("timeLeft is..", timeLeft);
  useEffect(() => {

    if (timeLeft <= 0) {
      clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeft]);

  const handleOtpChange = (text, index) => {
    if (text.legth > 1) return; //allow only single digit
    console.log("otp length is...", otp);
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    //move to next input
    if (text && index < otp.length - 1) {
      otpInputs.current[index + 1].focus();
    }
  };

  //handle backspace to move to previous input
  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  //store token
  const storeToken = async (token) => {
    console.log("Received token:", token);
    try {
      await AsyncStorage.setItem("authToken", token);
      console.log("token stored successully");
    } catch (error) {
      console.error("Error storing token:", error);
    }
  }

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length != 4) {
      setError("Please enter a 4-digit OTP");
      return;
    }
    setError('');  //clear previous error
    //backend flow
    console.log("otp inputs is...", otp);

    const otpPayload = {
      Id,
      Name,
      Email,
      Phone,
      otp: enteredOtp
    };

    try {
      const response = await api.post("/users/verifyOtp", otpPayload)
      console.log("login response is...", response.data);

      let registeredUser = response.data.payload;
      console.log("payload is..", registeredUser);

      if (response.status === 200) {
        clearInterval(timerRef.current);
        storeToken(response.data.token);
        Alert.alert(`${response.msg || "You are Successfully LoggedIn"}`);

        navigation.navigate("HomeScreen", { registeredUser });

      } else if (response.status === 400) {

        Alert.alert(response.data.error || "OTP verification failed");

      } else if (response.status === 500) {
        setError(response.data.error || "Failed to verify OTP");
        Alert.alert(response.data.error || "Failed to verify OTP");

      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again');
      }

    } catch (error) {
      Alert.alert("Error", "An Unexpected error");
    }
  }

  const handleResendOtp = async () => {
    if (isResending) return;
    setIsResending(true); //disable resend btn
    setError('');
    setOtp(['', '', '', '']);
    setTimeLeft(30); //reset timer
    //bakend flow

    try {
      const response = await api.post("users/resendOtp", { Phone });
      console.log("resend-otp response is..", response.data);

      if (response.status && response.data.status === 200) {
        Alert.alert("Success", "OTP resent successfully");
      } else if (response.status === 400) {
        Alert.alert(response.data.error || "Phone number is required");
      } else if (response.status === 500) {
        setError(response.data.error || "Failed to re-send OTP");
        Alert.alert("Failed to re-send OTP");
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again');
      }

    } catch (error) {

      console.log("Unexpected error:", error);
      Alert.alert("Error", "An Unexpected error");

    } finally {
      // Re-enable resend button after 2 seconds to prevent rapid clicks
      setTimeout(() => setIsResending(false), 2000);
    }


  }


  return (
    <KeyboardAvoidingView style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? 'padding' : "height"}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/**---Image---*/}
        <View style={styles.verificationHeader}>
          <Image style={styles.imageStyle} source={imagePath} />
          <Text style={styles.verificationText}>Verification</Text>
        </View>

        <Text style={styles.verificationDescription}>
          Enter the Verification code we just sent to the mobile number {Phone}</Text>

        {/**---Error msg----*/}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/**--OTP Inputs--*/}
        <View style={styles.otpContainer}>
          <View style={styles.otpBox}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.otpInput}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={e => handleOtpKeyPress(e, index)}
                keyboardType="numeric"
                maxLength={1}
                ref={(ref) => (otpInputs.current[index] = ref)}
                textAlign="center"
                editable={timeLeft > 0}
              />
            ))}
          </View>

          {/**---verify button ---*/}
          <TouchableOpacity style={[styles.verifyButton, { opacity: timeLeft > 0 ? 1 : 0.5 }]}
            onPress={handleVerifyOtp} disabled={timeLeft <= 0}>
            <Text style={styles.verifyButtonText}>Verify</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 18, textAlign: "center", marginVertical: 20 }}>Didn't recieve code?</Text>
          <View style={styles.counter}>
            <View><Text style={styles.resendBtnText} onPress={handleResendOtp}>Resend</Text></View>
            <View><Text style={{ fontSize: 18, fontWeight: 300 }}>{timeLeft > 0 ? `Time left: ${timeLeft}s` : `OTP expired`}</Text></View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  verificationHeader: {
    padding: 15,
    backgroundColor: "rgb(240, 226, 226)",
    marginBottom: 20,
    paddingVertical: 30
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
  verificationText: {
    color: "rgb(233, 100, 153)",
    fontWeight: "bold",
    fontFamily: "Arail",
    fontSize: 30,
    paddingHorizontal: 20
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  otpContainer: {
    padding: 15
  },
  verificationDescription: {
    paddingHorizontal: 26,
    fontSize: 18,
    fontWeight: 400,
    verticalAlign: 100,
    marginBottom: 25
  },

  /**otp */
  otpBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20
  },
  otpInput: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 15,
    textAlign: 'center',
    fontSize: 18,
  },
  inputBox: {
    marginBottom: "25",
    backgroundColor: "#fffff"
  },
  inputText: {
    fontSize: 15,
    marginBottom: 10
    , fontWeight: 500
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    boxShadow: "rgba(0,0,0,0.14)",
    borderWidth: 2,
    borderRadius: 5
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  verifyButton: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgb(220, 38, 90)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  resendBtn: {
    width: '100%',
    height: 50,
    backgroundColor: '#rgb(240, 226, 226)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  resendBtnText: {
    color: '#rgb(233, 100, 153)',
    fontSize: 20,
    fontWeight: 'bold',
    textDecorationLine: "underline"
  }

});


export default VerificationScreen;