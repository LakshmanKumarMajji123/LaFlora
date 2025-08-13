import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const UpdateScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Check for Updates Screen</Text>
  </View>
);

export default UpdateScreen;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  text: {fontSize: 18, fontWeight: 'bold'},
});
