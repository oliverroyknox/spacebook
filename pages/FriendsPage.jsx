import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  TouchableRipple, List, Snackbar, useTheme,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getFriendRequests,
  getFriends,
  acceptFriendRequest,
  declineFriendRequest,
} from '../helpers/requests';
import capitalise from '../helpers/strings';
import PageStyles from '../styles/page';
import UserListItem from '../components/UserListItem';

const style = StyleSheet.create({
  listIconWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  touchable: {
    borderRadius: '50%',
  },
});

export default function FriendsPage({ navigation, setUserId }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  /**
   * Shows a `Snackbar` with the given message.
   * @param {string} message Message to display in `Snackbar`.
   */
  function showSnackbar(message) {
    setSnackbarMessage(capitalise(message));
    return setIsSnackbarVisible(true);
  }

  /**
   * Synchronises state when `Snackbar` is dismissed.
   */
  const onDismissSnackbar = () => setIsSnackbarVisible(false);

  async function loadFriendRequests() {
    const sessionToken = await AsyncStorage.getItem('session_token');

    const response = await getFriendRequests({ sessionToken });

    if (response.ok) {
      setFriendRequests(response.body || []);
    }
  }

  /**
   * Load all friends of the current user.
   */
  async function loadFriends() {
    const userId = Number(await AsyncStorage.getItem('user_id'));
    const sessionToken = await AsyncStorage.getItem('session_token');

    const response = await getFriends({ userId, sessionToken });

    if (response.ok) {
      setFriends(response.body || []);
    }
  }

  /**
   * Accept a friend request.
   * @param {Object} request Request data.
   * @param {number} userId ID of user's friend request to accept.
   */
  const onAcceptFriendRequest = async ({ userId }) => {
    try {
      const sessionToken = await AsyncStorage.getItem('session_token');
      const response = await acceptFriendRequest({ userId, sessionToken });

      if (response.ok) {
        await loadFriendRequests();
        await loadFriends();
        return showSnackbar('accepted friend request.');
      }

      return showSnackbar(response.message);
    } catch (err) {
      return showSnackbar('failed to accept friend request, try again later.');
    }
  };

  /**
   * Decline a friend request.
   * @param {Object} request Request data.
   * @param {number} userId ID of user's friend request to decline.
   */
  const onDeclineFriendRequest = async ({ userId }) => {
    try {
      const sessionToken = await AsyncStorage.getItem('session_token');
      const response = await declineFriendRequest({ userId, sessionToken });

      if (response.ok) {
        await loadFriendRequests();
        await loadFriends();
        return showSnackbar('declined friend request.');
      }

      return showSnackbar(response.message);
    } catch (err) {
      return showSnackbar('failed to decline friend request, try again later.');
    }
  };

  /**
   * Navigates to the current user's profile.
   * @param {Object} data User data.
   * @param {number} data.userId ID of user to navigate to.
   */
  const onGoToUser = ({ userId }) => {
    setUserId(userId);
    navigation.navigate('Profile');
  };

  const renderListIconRight = ({ style: iconStyle, userId }) => (
    <View style={style.listIconWrapper}>
      <TouchableRipple
        style={style.touchable}
        onPress={() => onAcceptFriendRequest({ userId })}
      >
        <List.Icon
          color={theme.colors.success}
          style={iconStyle}
          icon="checkmark-circle"
        />
      </TouchableRipple>
      <TouchableRipple
        style={style.touchable}
        onPress={() => onDeclineFriendRequest({ userId })}
      >
        <List.Icon
          color={theme.colors.error}
          style={iconStyle}
          icon="close-circle"
        />
      </TouchableRipple>
    </View>
  );

  function renderFriendRequests() {
    return friendRequests.map(({ userId, firstName, lastName }) => (
      <List.Item
        key={userId}
        title={`${firstName} ${lastName}`}
        right={({ style: iconStyle }) => renderListIconRight({ style: iconStyle, userId })}
      />
    ));
  }

  function renderFriends() {
    return friends.map(({ userId, userGivenname, userFamilyname }) => (
      <UserListItem
        key={userId}
        userId={userId}
        firstName={userGivenname}
        lastName={userFamilyname}
        onGoToUser={onGoToUser}
      />
    ));
  }

  useEffect(async () => {
    await loadFriendRequests();
    await loadFriends();
  }, []);

  return (
    <View style={PageStyles(theme, insets).page}>
      <ScrollView>
        {friendRequests.length > 0 && (
          <List.Section>
            <List.Subheader>Friend Requests</List.Subheader>
            {renderFriendRequests()}
          </List.Section>
        )}
        {friends.length > 0 ? (
          <List.Section>
            <List.Subheader>Friends</List.Subheader>
            {renderFriends()}
          </List.Section>
        ) : (
          <List.Section>
            <List.Subheader>Friends</List.Subheader>
            <List.Item title="You have no friends. Try searching for some!" />
          </List.Section>
        )}
      </ScrollView>
      <Snackbar
        visible={isSnackbarVisible}
        onDismiss={onDismissSnackbar}
        duration={2000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

FriendsPage.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  setUserId: PropTypes.func.isRequired,
};
