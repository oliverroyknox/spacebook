import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Title } from 'react-native-paper';
import Logo from '../assets/icon.png';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});

export default function LogoHeader() {
  return (
    <View style={styles.container}>
      <Image style={{ width: 50, height: 50 }} source={Logo} />
      <Title>Spacebook</Title>
    </View>
  );
}
