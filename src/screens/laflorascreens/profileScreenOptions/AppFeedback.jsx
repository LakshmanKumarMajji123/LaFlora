import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const AppFeedback = () => (
  <View style={styles.container}>
    <Text style={styles.text}>App Feedback Screen</Text>
  </View>
);

export default AppFeedback;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  text: {fontSize: 18, fontWeight: 'bold'},
});
