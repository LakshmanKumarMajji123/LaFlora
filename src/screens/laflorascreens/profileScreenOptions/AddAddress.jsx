import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import HeaderComponent from '../HeaderComponent';

const AddAddress = ({navigation}) => {
  const [name, setName] = useState('');
  const [line1, setLine1] = useState('');
  const [city, setLandmark] = useState('');
  const [state, setEmail] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');

  const handleSave = () => {
    if (!name || !line1 || !city || !state || !pincode || !phone) {
      Alert.alert('All fields are required!');
      return;
    }

    const newAddress = {
      name,
      line1,
      city,
      state,
      pincode,
      phone,
    };

    navigation.navigate('MyAddresses', {newAddress});
  };

  return (
    <>
      <HeaderComponent title="Add New Address" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />

     <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone"
          keyboardType="phone-pad"
        />


      <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={state}
          onChangeText={setEmail}
          placeholder="Email"
        />


        <Text style={styles.label}>Address Line</Text>
        <TextInput
          style={styles.input}
          value={line1}
          onChangeText={setLine1}
          placeholder="Street, House No."
        />

        <Text style={styles.label}>Landmark</Text>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setLandmark}
          placeholder="Landmark"
        />

       
        <Text style={styles.label}>Pincode</Text>
        <TextInput
          style={styles.input}
          value={pincode}
          onChangeText={setPincode}
          placeholder="Pincode"
          keyboardType="number-pad"
        />

      

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Address</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

export default AddAddress;


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  label: {
    fontSize: 15,
    color: '#444',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#D45A8C',
    marginTop: 30,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
