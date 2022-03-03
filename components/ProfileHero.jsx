import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Avatar, Headline, Menu, Divider, IconButton, useTheme } from 'react-native-paper';
import ProfileStyles from '../styles/profile';

export default function ProfileHero({
  profilePhoto,
  user,
  isNested,
  onEdit,
  onViewDrafts,
  onLogout,
  onGoToHome,
}) {
  const theme = useTheme();

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const openMenu = () => setIsMenuVisible(true);
  const closeMenu = () => setIsMenuVisible(false);

  const handleMenuPress = (callback) => {
    // enforce menu is closed before callback.
    closeMenu();
    callback();
  };

  return (
    <View style={ProfileStyles(theme).container}>
      <View style={ProfileStyles(theme).toolbar}>
        <Menu
          visible={isMenuVisible}
          onDismiss={closeMenu}
          anchor={
            !isNested ? (
              <IconButton
                icon="ellipsis-horizontal"
                color={theme.colors.primary}
                onPress={openMenu}
              />
            ) : (
              <IconButton icon="home" color={theme.colors.primary} onPress={onGoToHome} />
            )
          }
        >
          <Menu.Item onPress={() => handleMenuPress(onEdit)} icon="create" title="Edit Profile" />
          <Menu.Item
            onPress={() => handleMenuPress(onViewDrafts)}
            icon="document-text"
            title="View Drafts"
          />
          <Divider />
          <Menu.Item onPress={() => handleMenuPress(onLogout)} icon="log-out" title="Logout" />
        </Menu>
      </View>
      <Avatar.Image size={144} theme={theme} source={profilePhoto ? { uri: profilePhoto } : null} />
      <View style={ProfileStyles(theme).nameContainer}>
        <Headline style={ProfileStyles(theme).name}>{user?.firstName}</Headline>
        <Headline style={ProfileStyles(theme).name}>{user?.lastName}</Headline>
      </View>
    </View>
  );
}

ProfileHero.propTypes = {
  profilePhoto: PropTypes.string.isRequired,
  user: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
  }),
  isNested: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onViewDrafts: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onGoToHome: PropTypes.func.isRequired,
};

ProfileHero.defaultProps = {
  user: {
    firstName: '',
    lastName: '',
  },
};
