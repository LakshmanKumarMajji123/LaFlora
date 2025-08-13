import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderComponent from '../HeaderComponent';

const MyAddresses = () => {
  const [address, setAddress] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Form Fields
  const [fullAddress, setFullAddress] = useState('');
  const [nearbyLandmark, setNearbyLandmark] = useState('');
  const [pincode, setPincode] = useState('');

  useEffect(() => {
    if (address) {
      setFullAddress(address.fullAddress);
      setNearbyLandmark(address.nearbyLandmark);
      setPincode(address.pincode);
    } else {
      resetForm();
    }
  }, [modalVisible]);

  const resetForm = () => {
    setFullAddress('');
    setNearbyLandmark('');
    setPincode('');
  };

  const handleSave = () => {
    if (!fullAddress || !nearbyLandmark || !pincode) {
      Alert.alert('All fields are required!');
      return;
    }

    const newAddress = {
      fullAddress,
      nearbyLandmark,
      pincode,
    };

    setAddress(newAddress);
    setModalVisible(false);
  };

  const handleRemoveAddress = () => {
    Alert.alert('Remove Address', 'Are you sure you want to delete this address?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          setAddress(null);
          resetForm();
        },
      },
    ]);
  };

  return (
    <>
      <HeaderComponent title="My Addresses" />
      <View style={styles.container}>
        {!address ? (
          <View style={styles.emptyContainer}>
            <Icon name="map-marker-off" size={100} color="#D45A8C" />
            <Text style={styles.title}>No Address Found</Text>
            <Text style={styles.subtitle}>You haven't added any address yet.</Text>
          </View>
        ) : (
          <View style={styles.addressCard}>
            <View style={{flex: 1}}>
              <Text style={styles.name}>Saved Address</Text>
              <Text style={styles.detail}>{address.fullAddress}</Text>
              <Text style={styles.detail}>Landmark: {address.nearbyLandmark}</Text>
              <Text style={styles.detail}>Pincode: {address.pincode}</Text>
            </View>
            <TouchableOpacity onPress={handleRemoveAddress}>
              <Icon name="delete" size={24} color="#D45A8C" />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>
            {address ? 'Update Address' : 'Add New Address'}
          </Text>
        </TouchableOpacity>

        {/* Modal Bottom Sheet */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView contentContainerStyle={{paddingBottom: 20}}>
                  <Text style={styles.modalTitle}>
                    {address ? 'Update Address' : 'Add New Address'}
                  </Text>

                  <Text style={styles.label}>Full Address</Text>
                  <TextInput
                    style={styles.input}
                    value={fullAddress}
                    onChangeText={setFullAddress}
                    placeholder="Street, Building, House No."
                  />

                  <Text style={styles.label}>Nearby Landmark</Text>
                  <TextInput
                    style={styles.input}
                    value={nearbyLandmark}
                    onChangeText={setNearbyLandmark}
                    placeholder="e.g., Near XYZ Park"
                  />

                  <Text style={styles.label}>Pincode</Text>
                  <TextInput
                    style={styles.input}
                    value={pincode}
                    onChangeText={setPincode}
                    placeholder="Pincode"
                    keyboardType="number-pad"
                  />

                  <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                      <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                      <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

export default MyAddresses;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    color: '#666',
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#D45A8C',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detail: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  cancelButton: {
    marginRight: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelText: {
    color: '#D45A8C',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#D45A8C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
