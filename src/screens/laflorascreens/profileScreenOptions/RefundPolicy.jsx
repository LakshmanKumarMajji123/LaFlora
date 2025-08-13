import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const RefundPolicyScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Refund Policy Screen</Text>
  </View>
);

export default RefundPolicyScreen;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  text: {fontSize: 18, fontWeight: 'bold'},
});
