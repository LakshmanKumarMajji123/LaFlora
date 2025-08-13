import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const TermsAndConditions = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Terms & Conditions Screen</Text>
  </View>
);

export default TermsAndConditions;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  text: {fontSize: 18, fontWeight: 'bold'},
});
