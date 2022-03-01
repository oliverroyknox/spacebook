import React from 'react';
import { View, Image } from 'react-native';
import { Title, useTheme } from 'react-native-paper';
import Logo from '../assets/icon.png';
import LogoStyles from '../styles/logo';

export default function LogoHeader() {
  const { colors } = useTheme();

  return (
    <View style={LogoStyles.container}>
      <Image style={{ width: 50, height: 50, marginHorizontal: 6 }} source={Logo} />
      <Title style={{ color: colors.headerText, marginHorizontal: 6 }}>Spacebook</Title>
    </View>
  );
}
