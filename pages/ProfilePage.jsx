import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { View, FlatList } from 'react-native';
import { Portal, Modal, Snackbar, Button, Paragraph, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createPost,
  getProfilePhoto,
  getUser,
  updateUser,
  getPosts,
  logout,
  getPost,
  likePost,
  unlikePost,
  updatePost,
  deletePost,
  uploadProfilePhoto,
  getFriends,
  addFriend,
} from '../api/requests';
import { toDataUrl, fetchFromUri } from '../helpers/blob';
import capitalise from '../helpers/strings';
import PageStyles from '../styles/page';
import PostStyles from '../styles/post';
import ProfileHero from '../components/ProfileHero';
import ProfileEdit from '../components/ProfileEdit';
import DraftView from '../components/DraftView';
import Divider from '../components/Divider';
import PostCompose from '../components/PostCompose';
import Post from '../components/Post';
import PostEdit from '../components/PostEdit';
import PostDelete from '../components/PostDelete';

export default function ProfilePage({ userId, setUserId, onUnauthenticate }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [signedInUserId, setSignedInUserId] = useState(-1);
  const [isFriend, setIsFriend] = useState(false);
  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState('');
  const [posts, setPosts] = useState([]);
  const [composeText, setComposeText] = useState('');
  const [drafts, setDrafts] = useState([]);
  const [focusedPost, setFocusedPost] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [deletingPost, setDeletingPost] = useState(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isDraftModalVisible, setIsDraftModalVisible] = useState(false);
  const [isPostModalVisible, setIsPostModalVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);

  async function loadUser({ sessionToken }) {
    const { ok, body } = await getUser({ userId, sessionToken });

    if (ok) {
      setUser(body);
    }
  }

  async function loadProfilePhoto({ sessionToken }) {
    const { ok, body } = await getProfilePhoto({ userId, sessionToken });

    if (ok) {
      setProfilePhoto(await toDataUrl(body));
    }
  }

  async function loadPosts({ sessionToken }) {
    const { ok, body } = await getPosts({ userId, sessionToken });

    if (ok) {
      setPosts(body);
    }
  }

  async function loadDrafts() {
    try {
      const drafts = await AsyncStorage.getItem('drafts');
      if (drafts) {
        setDrafts(JSON.parse(drafts));
      }
    } catch (err) {
      setDrafts([]);
    }
  }

  async function checkFriendship({ sessionToken, friendOfId = signedInUserId }) {
    // get logged in users friends.
    const { ok, body: friends } = await getFriends({
      userId: friendOfId,
      sessionToken,
    });

    if (ok) {
      // check if user being viewed in profile is a friend of the logged in user.
      const profileIsFriend = !!friends.find(({ userId: friendId }) => friendId === userId);
      setIsFriend(profileIsFriend);

      return profileIsFriend;
    }

    setIsFriend(false);
    return false;
  }

  const onDismissDialog = () => {
    setIsDialogVisible(false);

    // reset delete post dialog when dismissing dialog.
    if (deletingPost) setDeletingPost(null);
  };

  const onDismissProfileModal = () => setIsProfileModalVisible(false);

  const onDismissDraftModal = () => setIsDraftModalVisible(false);

  const onDismissPostModal = () => {
    setIsPostModalVisible(false);

    // reset focus post or editing post when dismissing modal.
    if (focusedPost) setFocusedPost(null);
    if (editingPost) setEditingPost(null);
  };

  const onDismissSnackbar = () => setIsSnackbarVisible(false);

  function showSnackbar(message) {
    setSnackbarMessage(capitalise(message));
    return setIsSnackbarVisible(true);
  }

  const onShowPostModal = async ({ post: { postId } }) => {
    try {
      const sessionToken = await AsyncStorage.getItem('session_token');
      const response = await getPost({ userId, postId, sessionToken });

      if (response.ok) {
        setIsPostModalVisible(true);
        return setFocusedPost(response.body);
      }

      return showSnackbar(response.message);
    } catch (err) {
      return showSnackbar('failed to show post, try again later.');
    }
  };

  const onShowEditPostModal = ({ post }) => {
    // cleanup any existing modals before loading this one, as this modal can be triggered from another.
    onDismissPostModal();

    setEditingPost(post);
    setIsPostModalVisible(true);
  };

  const onShowDeleteDialog = ({ post }) => {
    // cleanup any existing dialogs before loading this one, as this dialog can be triggered from another.
    onDismissPostModal();

    setIsDialogVisible(true);
    setDeletingPost(post);
  };

  const onEditProfile = () => setIsProfileModalVisible(true);

  const onViewDrafts = () => setIsDraftModalVisible(true);

  const onSaveProfile = async ({ firstName, lastName, profilePhoto: photo }) => {
    onDismissProfileModal();

    try {
      const sessionToken = await AsyncStorage.getItem('session_token');
      const data = { firstName, lastName };
      const updateUserResponse = await updateUser({
        userId,
        sessionToken,
        user: data,
      });

      if (updateUserResponse.ok) {
        // when user update succeeds update post and user state (as they contain user details).
        await loadPosts({ sessionToken });
        await loadUser({ sessionToken });

        if (!photo) return null;

        // then attempt to update profile photo.
        const blob = await fetchFromUri(photo);
        const uploadPhotoResponse = await uploadProfilePhoto({
          userId,
          sessionToken,
          photo: blob,
        });

        if (uploadPhotoResponse.ok) {
          return loadProfilePhoto({ sessionToken });
        }

        return showSnackbar(uploadPhotoResponse.message);
      }

      return showSnackbar(updateUserResponse.message);
    } catch (err) {
      return showSnackbar('failed to save changes, try again later.');
    }
  };

  async function deleteDraft({ id }) {
    const existingDraftsJson = await AsyncStorage.getItem('drafts');

    if (existingDraftsJson) {
      const existingDrafts = JSON.parse(existingDraftsJson);
      const newDrafts = existingDrafts.filter((draft) => draft.id !== id);

      await AsyncStorage.setItem('drafts', JSON.stringify(newDrafts));
      setDrafts(newDrafts);
    }
  }

  const onEditDraft = async ({ id, text }) => {
    try {
      // updates `PostCompose` component with draft text and removes the draft from storage.
      // the intent is for the user to post or save the draft again.
      setComposeText(text);
      await deleteDraft({ id });

      onDismissDraftModal();
    } catch (err) {
      return showSnackbar('failed to load draft, try again later.');
    }
  };

  const onDeleteDraft = async ({ id }) => {
    try {
      await deleteDraft({ id });

      return showSnackbar('deleted draft.');
    } catch (err) {
      return showSnackbar('failed to delete draft, try again later.');
    }
  };

  const onLogout = async () => {
    try {
      const sessionToken = await AsyncStorage.getItem('session_token');
      const response = await logout({ sessionToken });

      if (response.ok) {
        return onUnauthenticate();
      }

      return showSnackbar(response.message);
    } catch (err) {
      return showSnackbar('failed to log out, try again later.');
    }
  };

  const onGoToHome = async () => setUserId(signedInUserId);

  const onAddFriend = async () => {
    try {
      const sessionToken = await AsyncStorage.getItem('session_token');
      const response = await addFriend({ userId, sessionToken });

      return showSnackbar(response.message);
    } catch (err) {
      return showSnackbar('failed to create a post, try again later.');
    }
  };

  const onPost = async ({ text }) => {
    try {
      const sessionToken = await AsyncStorage.getItem('session_token');
      const response = await createPost({ userId, sessionToken, text });

      // reload state with new post.
      await loadPosts({ sessionToken });

      return showSnackbar(response.message);
    } catch (err) {
      return showSnackbar('failed to create a post, try again later.');
    }
  };

  const onSaveDraft = async ({ text }) => {
    try {
      const draft = { id: Date.now(), text };

      // get json in storage or create a new array.
      const existingDraftsJson = await AsyncStorage.getItem('drafts');
      const existingDrafts = existingDraftsJson ? JSON.parse(existingDraftsJson) : [];

      // append new draft to previously stored drafts.
      const newDrafts = [...existingDrafts, draft];

      // store in local storage and update state.
      await AsyncStorage.setItem('drafts', JSON.stringify(newDrafts));
      setDrafts(newDrafts);

      return showSnackbar('saved draft.');
    } catch (err) {
      return showSnackbar('failed to save draft, try again later.');
    }
  };

  const onLikePost = async ({ post: { postId } }) => {
    try {
      const sessionToken = await AsyncStorage.getItem('session_token');
      const likeResponse = await likePost({ userId, postId, sessionToken });

      // attempt to like post, if fails with condition below then it is already liked and needs to be unliked instead.
      if (!likeResponse.ok && likeResponse.body?.isAlreadyLiked === true) {
        // if already liked then try an unlike post.
        const unlikeResponse = await unlikePost({
          userId,
          postId,
          sessionToken,
        });

        if (!unlikeResponse.ok) {
          return showSnackbar(unlikeResponse.message);
        }
      } else if (!likeResponse.ok) {
        return showSnackbar(likeResponse.message);
      }

      return loadPosts({ sessionToken });
    } catch (err) {
      return showSnackbar('failed to interact with post, try again later.');
    }
  };

  const onEditPost = async ({ postId, text }) => {
    // cleanup any existing modals before loading this one, as this modal can be triggered from another.
    onDismissPostModal();

    try {
      const sessionToken = await AsyncStorage.getItem('session_token');
      const response = await updatePost({
        userId,
        postId,
        sessionToken,
        post: { text },
      });

      if (response.ok) {
        return loadPosts({ sessionToken });
      }

      return showSnackbar(response.message);
    } catch (err) {
      return showSnackbar('failed to edit post, try again later.');
    }
  };

  const onDeletePost = async ({ postId }) => {
    onDismissDialog();

    try {
      const sessionToken = await AsyncStorage.getItem('session_token');
      const response = await deletePost({ userId, postId, sessionToken });

      if (response.ok) {
        return loadPosts({ sessionToken });
      }

      return showSnackbar(response.message);
    } catch (err) {
      return showSnackbar('failed to delete post, try again later.');
    }
  };

  const renderPost = ({ item: post }, options) => {
    const isLikeable = userId !== signedInUserId && post.author.userId !== signedInUserId;
    const isOwn = post.author.userId === signedInUserId;
    const isFocused = Boolean(options?.isFocused);

    const style = !isFocused && PostStyles.postWrapper;

    function renderCard() {
      // according to api spec.
      // if post is authored by the currently signed in user it cannot be liked,
      // but can be edited / deleted.
      if (isOwn) {
        return (
          <Post
            post={post}
            onEdit={onShowEditPostModal}
            onDelete={onShowDeleteDialog}
            onPress={onShowPostModal}
            isFocused={isFocused}
          />
        );
      }

      // according to api spec.
      // if post is by a different user and not on the currently signed in user's profile,
      // it can be liked.
      if (isLikeable) {
        return (
          <Post post={post} onLike={onLikePost} onPress={onShowPostModal} isFocused={isFocused} />
        );
      }

      // fallback post to render "something", if above conditions fail to meet requirements.
      return <Post post={post} onPress={onShowPostModal} isFocused={isFocused} />;
    }

    // wrap post in a styled view.
    return <View style={style}>{renderCard()}</View>;
  };

  useEffect(async () => {
    const sessionToken = await AsyncStorage.getItem('session_token');
    await loadUser({ sessionToken });
    await loadProfilePhoto({ sessionToken });

    const authUserId = Number(await AsyncStorage.getItem('user_id'));
    setSignedInUserId(authUserId);

    const profileIsFriend = await checkFriendship({ sessionToken, friendOfId: authUserId });

    // only load posts of friends or self.
    if (profileIsFriend || userId === authUserId) {
      await loadPosts({ sessionToken });
    } else {
      setPosts([]);
    }

    // only load drafts for self.
    if (userId === authUserId) {
      await loadDrafts();
    }

    return () => {
      setUser(null);
      setProfilePhoto('');
      setPosts([]);
      setSignedInUserId(-1);
    };
  }, [userId]);

  return (
    <View style={[PageStyles(theme, insets).page]}>
      <ProfileHero
        profilePhoto={profilePhoto}
        user={user}
        isNested={userId !== signedInUserId}
        onEdit={onEditProfile}
        onViewDrafts={onViewDrafts}
        onLogout={onLogout}
        onGoToHome={onGoToHome}
      />
      <View style={PageStyles(theme, insets).spacing}>
        <Divider text="Posts" />
      </View>
      {isFriend || userId === signedInUserId ? (
        <FlatList
          style={PostStyles.postList}
          contentContainerStyle={PostStyles.postListContent}
          data={posts}
          ListHeaderComponent={
            <PostCompose text={composeText} onPost={onPost} onSaveDraft={onSaveDraft} />
          }
          ListHeaderComponentStyle={PostStyles.postListContent}
          renderItem={renderPost}
          keyExtractor={(item) => item.postId}
        />
      ) : (
        <View style={PostStyles.postList}>
          <Button style={PageStyles(theme, insets).spacing} mode="outlined" onPress={onAddFriend}>
            Add Friend
          </Button>
          <Paragraph style={{ textAlign: 'center' }}>
            {user?.firstName}
            &apos;s posts are hidden until they are a friend.
          </Paragraph>
        </View>
      )}
      <Portal>
        {user && (
          <ProfileEdit
            profilePhoto={profilePhoto}
            user={user}
            visible={isProfileModalVisible}
            onDismiss={onDismissProfileModal}
            onSave={onSaveProfile}
          />
        )}
      </Portal>
      <Portal>
        <DraftView
          visible={isDraftModalVisible}
          onDismiss={onDismissDraftModal}
          drafts={drafts}
          onEditDraft={onEditDraft}
          onDeleteDraft={onDeleteDraft}
        />
      </Portal>
      <Portal>
        <Modal
          visible={isPostModalVisible}
          onDismiss={onDismissPostModal}
          contentContainerStyle={PageStyles(theme, insets).alignment}
        >
          {focusedPost && renderPost({ item: focusedPost }, { isFocused: true })}
          {editingPost && <PostEdit post={editingPost} onSave={onEditPost} />}
        </Modal>
      </Portal>
      <Portal>
        {deletingPost && (
          <PostDelete
            post={deletingPost}
            visible={isDialogVisible}
            onDismiss={onDismissDialog}
            onDelete={onDeletePost}
          />
        )}
      </Portal>
      <Snackbar visible={isSnackbarVisible} onDismiss={onDismissSnackbar} duration={2000}>
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

ProfilePage.propTypes = {
  userId: PropTypes.number.isRequired,
  setUserId: PropTypes.func.isRequired,
  onUnauthenticate: PropTypes.func.isRequired,
};
