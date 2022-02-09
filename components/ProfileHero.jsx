import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import {
  Avatar,
  Headline,
  Menu,
  Divider,
  IconButton,
  useTheme,
} from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  toolbar: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  nameContainer: {
    marginTop: 16,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 28,
    marginHorizontal: 8,
  },
});

export default function ProfileHero({
  profilePhoto, user, onEdit, onLogout,
}) {
  const theme = useTheme();

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const openMenu = () => setIsMenuVisible(true);
  const closeMenu = () => setIsMenuVisible(false);

  /**
   * Wrapper for a callback on `Menu.Item` press. Closes the `Menu` before running callback.
   * @param {Function} callback Callback to run on menu press.
   */
  const handleMenuPress = (callback) => {
    closeMenu();
    callback();
  };

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Menu
          visible={isMenuVisible}
          onDismiss={closeMenu}
          anchor={<IconButton icon="ellipsis-horizontal" color={theme.colors.primary} onPress={openMenu} />}
        >
          <Menu.Item onPress={() => handleMenuPress(onEdit)} icon="create" title="Edit Profile" />
          <Divider />
          <Menu.Item onPress={() => handleMenuPress(onLogout)} icon="log-out" title="Logout" />
        </Menu>
      </View>
      <Avatar.Image size={144} theme={theme} source={profilePhoto ? { uri: profilePhoto } : null} />
      <View style={styles.nameContainer}>
        <Headline style={styles.name}>{user?.firstName}</Headline>
        <Headline style={styles.name}>{user?.lastName}</Headline>
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
  onEdit: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

ProfileHero.defaultProps = {
  user: {
    firstName: '',
    lastName: '',
  },
};
