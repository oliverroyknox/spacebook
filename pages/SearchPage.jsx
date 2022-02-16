import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView, View, StyleSheet,
} from 'react-native';
import {
  Searchbar, Snackbar, List, useTheme,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { searchUsers } from '../helpers/requests';
import PageStyles from '../styles/page';
import capitalise from '../helpers/strings';

const styles = StyleSheet.create({
  searchWrapper: {
    padding: 16,
  },
});

const renderListIconRight = ({ color, style }) => <List.Icon color={color} style={style} icon="chevron-forward" />;

export default function SearchPage({ navigation, setUserId }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
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
   * Handles searching for users from query string.
   * @param {string} query Query to use in search.
   */
  const onSearch = async (query) => {
    const sessionToken = await AsyncStorage.getItem('session_token');
    const response = await searchUsers({ sessionToken, query, offset: 0 });

    if (response.ok) {
      return setUsers(response.body);
    }

    return showSnackbar(response.message);
  };

  /**
   * Handles updating the search query state and performing a search.
   * @param {string} query Query to use in search.
   */
  const onSearchChange = async (query) => {
    setSearchQuery(query);
    await onSearch(query);
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

  /**
   * Synchronises state when `Snackbar` is dismissed.
   */
  const onDismissSnackbar = () => setIsSnackbarVisible(false);

  /**
   * Renders a list of user items.
   * @returns A list of `List.Item` representing users.
   */
  function renderUsers() {
    return users.map(({ userId, userGivenname, userFamilyname }) => (
      <List.Item key={userId} title={`${userGivenname} ${userFamilyname}`} onPress={() => onGoToUser({ userId })} right={renderListIconRight} />
    ));
  }

  useEffect(async () => {
    await onSearch('');
  }, []);

  return (
    <ScrollView style={PageStyles(theme, insets).page}>
      <View style={styles.searchWrapper}>
        <Searchbar
          placeholder="Search"
          onChangeText={onSearchChange}
          value={searchQuery}
        />
      </View>
      <List.Section>
        <List.Subheader>Suggestions</List.Subheader>
        {renderUsers()}
      </List.Section>
      <Snackbar
        visible={isSnackbarVisible}
        onDismiss={onDismissSnackbar}
        duration={2000}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
}

SearchPage.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  setUserId: PropTypes.func.isRequired,
};
