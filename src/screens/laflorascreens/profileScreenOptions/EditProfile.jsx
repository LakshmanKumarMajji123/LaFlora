import React, {useState} from 'react';

import {
  View,
  Text,
  TextInput,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import HeaderComponent from '../HeaderComponent';

const EditProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [profileImage, setProfileImage] = useState('https://randomuser.me/api/portraits/men/1.jpg');
  const [loading, setLoading] = useState(false);

  const genderOptions = ['Male', 'Female'];

  const handleImagePick = async () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel || response.errorCode) {
        console.log('Image selection cancelled or failed');
        return;
      }

      const uri = response.assets[0]?.uri;
      if (uri) {
        setProfileImage(uri);
      }
    });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split('T')[0];
      setDob(formatted);
    }
  };

  const handleSubmit = async () => {
    if (!name || !email || !phone || !gender || !dob) {
      Alert.alert('All fields are required');
      return;
    }
    if (phone.length !== 10 || !/^[0-9]+$/.test(phone)) {
      Alert.alert('Invalid phone number');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('https://dummyjson.com/users/add', {
        profileImage,
        name,
        email,
        phone,
        gender,
        dob,
      });

      Alert.alert(
        'Profile Updated!',
        'Details have been submitted successfully.',
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    label,
    value,
    setValue,
    placeholder,
    iconName,
    keyboardType = 'default',
  ) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Icon name={iconName} size={20} color="#D45A8C" style={styles.icon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          keyboardType={keyboardType}
          placeholderTextColor="#aaa"
        />
      </View>
    </>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={{flex: 1}}>
      <HeaderComponent title="Edit Profile" />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={{alignItems: 'center', marginBottom: 20}}>
          <TouchableOpacity onPress={handleImagePick}>
            <Image source={{uri: profileImage}} style={styles.avatar} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleImagePick}>
            <Text style={styles.changePhotoText}>Update Photo</Text>
          </TouchableOpacity>
        </View>

        {renderInput('Name', name, setName, 'Name', 'account')}
        {renderInput(
          'Email',
          email,
          setEmail,
          'Email',
          'email',
          'email-address',
        )}
        {renderInput(
          'Phone Number',
          phone,
          setPhone,
          'Phone Number',
          'phone',
          'number-pad',
        )}

        {/* DOB Date Picker */}
        <Text style={styles.label}>Date of Birth</Text>
        <Pressable onPress={() => setShowDatePicker(true)}>
          <View style={styles.inputWrapper}>
            <Icon
              name="calendar"
              size={20}
              color="#D45A8C"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#aaa"
              value={dob}
              editable={false}
            />
          </View>
        </Pressable>
        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        {/* Gender Selection - Inline Radio Buttons */}
        <Text style={styles.label}>Gender</Text>
        <View style={styles.radioGroup}>
          {genderOptions.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.radioItemInline}
              onPress={() => setGender(option)}>
              <Icon
                name={gender === option ? 'radiobox-marked' : 'radiobox-blank'}
                size={20}
                color="#D45A8C"
                style={{marginRight: 8}}
              />
              <Text style={styles.radioText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#D45A8C',
  },
  changePhotoText: {
    textAlign: 'center',
    color: '#D45A8C',
    marginBottom: 20,
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    marginTop: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#D45A8C',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    color: '#000',
  },
  picker: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    color: '#000',
  },
  button: {
    backgroundColor: '#D45A8C',
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#D45A8C',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
    height: 50,
  },
  pickerText: {
    fontSize: 16,
    color: '#000',
    paddingVertical: 10,
  },
  placeholderText: {
    fontSize: 16,
    color: '#aaa',
    paddingVertical: 10,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },

  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  radioItemInline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
