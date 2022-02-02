import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Title, useTheme } from 'react-native-paper';
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
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Image style={{ width: 50, height: 50 }} source={Logo} />
      <Title style={{ color: colors.headerText }}>Spacebook</Title>
    </View>
  );
}
