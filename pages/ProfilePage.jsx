import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, StyleSheet } from 'react-native';
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
} from '../helpers/requests';
import { toDataUrl, fetchFromUri } from '../helpers/blob';
import capitalise from '../helpers/strings';
import PageStyles from '../styles/page';
import ProfileHero from '../components/ProfileHero';
import ProfileEditModal from '../components/ProfileEditModal';
import Divider from '../components/Divider';
import PostCompose from '../components/PostCompose';
import Post from '../components/Post';
import PostEdit from '../components/PostEdit';
import PostDeleteDialog from '../components/PostDeleteDialog';

const styles = StyleSheet.create({
	spacing: {
		marginVertical: 8,
	},
	postList: {
		paddingHorizontal: 16,
	},
	postContent: {
		marginBottom: 8,
	},
	post: {
		marginVertical: 8,
	},
	modalContent: {
		marginHorizontal: 16,
	},
});

export default function ProfilePage({ userId, setUserId, onUnauthenticate }) {
	const theme = useTheme();
	const insets = useSafeAreaInsets();

	const [signedInUserId, setSignedInUserId] = useState(-1);
	const [isFriend, setIsFriend] = useState(false);
	const [user, setUser] = useState(null);
	const [profilePhoto, setProfilePhoto] = useState('');
	const [posts, setPosts] = useState([]);
	const [focusedPost, setFocusedPost] = useState(null);
	const [editingPost, setEditingPost] = useState(null);
	const [deletingPost, setDeletingPost] = useState(null);
	const [isDialogVisible, setIsDialogVisible] = useState(false);
	const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
	const [isPostModalVisible, setIsPostModalVisible] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);

	/**
	 * Gets the specified user's information.
	 * @param {Object} userData Requested user data to get another user.
	 * @param {string} userData.sessionToken Logged in user's authorisation token.
	 */
	async function loadUser({ sessionToken }) {
		const { ok, body } = await getUser({ userId, sessionToken });

		if (ok) {
			setUser(body);
		}
	}

	/**
	 * Gets the user's profile photo and set it's data URL to state.
	 * @param {Object} userData Required user data to get profile photo.
	 * @param {string} userData.sessionToken Logged in user's authorisation token.
	 */
	async function loadProfilePhoto({ sessionToken }) {
		const { ok, body } = await getProfilePhoto({ userId, sessionToken });

		if (ok) {
			setProfilePhoto(await toDataUrl(body));
		}
	}

	/**
	 * Gets the posts on the user's profile.
	 * @param {Object} userData Requested user data to get another user.
	 * @param {string} userData.sessionToken Logged in user's authorisation token.
	 */
	async function loadPosts({ sessionToken }) {
		const { ok, body } = await getPosts({ userId, sessionToken });

		if (ok) {
			setPosts(body);
		}
	}

	/**
	 * Checks whether the currently signed in user is friends with the profile's user.
	 * @param {Object} userData requested user data to get another user.
	 * @param {string} userData.sessionToken Logged in user's authorisation token.
	 */
	async function checkFriendship({ sessionToken, _signedInUserId }) {
		const { ok, body: friends } = await getFriends({
			userId: _signedInUserId,
			sessionToken,
		});

		if (ok) {
			// eslint-disable-next-line no-underscore-dangle
			const _isFriend = !!friends.find(({ userId: friendId }) => friendId === userId);
			setIsFriend(_isFriend);

			return _isFriend;
		}

		setIsFriend(false);
		return false;
	}

	useEffect(async () => {
		const sessionToken = await AsyncStorage.getItem('session_token');
		await loadUser({ sessionToken });
		await loadProfilePhoto({ sessionToken });

		// eslint-disable-next-line no-underscore-dangle
		const _signedInUserId = Number(await AsyncStorage.getItem('user_id'));
		setSignedInUserId(_signedInUserId);

		// eslint-disable-next-line no-underscore-dangle
		const _isFriend = await checkFriendship({ sessionToken, _signedInUserId });

		// only load posts of friends or self.
		if (_isFriend || userId === _signedInUserId) {
			await loadPosts({ sessionToken });
		} else {
			setPosts([]);
		}

		return () => {
			setUser(null);
			setProfilePhoto('');
			setPosts([]);
			setSignedInUserId(-1);
		};
	}, [userId]);

	/**
	 * Synchronises state when `PostDeleteDialog` is dismissed.
	 */
	const onDismissDialog = () => {
		setIsDialogVisible(false);

		if (deletingPost) setDeletingPost(null);
	};

	/**
	 * Synchronises state when `ProfileEditModal` is dismissed.
	 */
	const onDismissProfileModal = () => setIsProfileModalVisible(false);

	/**
	 * Synchronises state when `Modal` is dismissed.
	 */
	const onDismissPostModal = () => {
		setIsPostModalVisible(false);

		if (focusedPost) setFocusedPost(null);
		if (editingPost) setEditingPost(null);
	};

	/**
	 * Synchronises state when `Snackbar` is dismissed.
	 */
	const onDismissSnackbar = () => setIsSnackbarVisible(false);

	/**
	 * Shows a `Snackbar` with the given message.
	 * @param {string} message Message to display in `Snackbar`.
	 */
	function showSnackbar(message) {
		setSnackbarMessage(capitalise(message));
		return setIsSnackbarVisible(true);
	}

	/**
	 * Shows a `Modal` to display a post.
	 * @param {Object} data Callback data.
	 * @param {Object} data.post A focused post to show in the `Modal`.
	 * @param {number} data.post.postId The ID of the focused post.
	 */
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

	/**
	 * Shows a `Modal` with a post ready to be edited.
	 * @param {Object} data Callback data.
	 * @param {Object} data.post A post to be edited.
	 */
	const onShowEditPostModal = ({ post }) => {
		// Cleanup any existing `Modals` before loading this one.
		// As this `Modal` can be triggered from another.
		onDismissPostModal();

		setEditingPost(post);
		setIsPostModalVisible(true);
	};

	/**
	 * Shows the `PostDeleteDialog` to confirm deletion.
	 * @param {Object} data Callback data.
	 * @param {Object} data.post The post to target for deletion.
	 */
	const onShowDeleteDialog = ({ post }) => {
		// Cleanup any existing `Modals` before loading this one.
		// As this `Modal` can be triggered from another.
		onDismissPostModal();

		setIsDialogVisible(true);
		setDeletingPost(post);
	};

	/**
	 * Handles starting a session to edit a profile.
	 */
	const onEditProfile = () => setIsProfileModalVisible(true);

	/**
	 * Handles saving changes to a profile.
	 * @param {Object} data Callback data.
	 * @param {string} data.firstName First name of user.
	 * @param {string} data.lastName Last name of user.
	 */
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
				await loadPosts({ sessionToken });
				await loadUser({ sessionToken });

				if (!photo) return null;

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

	/**
	 * Handles logging out the current user and returning to `login` screen.
	 */
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

	/**
	 * Handles going back to the "home" profile page.
	 */
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

	/**
	 * Handles creating a new post in the system.
	 * @param {Object} data Post data.
	 * @param {string} text Text content of a post.
	 */
	const onPost = async ({ text }) => {
		try {
			const sessionToken = await AsyncStorage.getItem('session_token');
			const response = await createPost({ userId, sessionToken, text });

			// Reload state with new post.
			await loadPosts({ sessionToken });

			return showSnackbar(response.message);
		} catch (err) {
			return showSnackbar('failed to create a post, try again later.');
		}
	};

	/**
	 * Handles liking and unliking a post.
	 * @param {Object} data Data from callback.
	 * @param {Object} post Post that was liked.
	 * @param {number} post.postId ID of post that was liked.
	 */
	const onLikePost = async ({ post: { postId } }) => {
		try {
			const sessionToken = await AsyncStorage.getItem('session_token');
			const likeResponse = await likePost({ userId, postId, sessionToken });

			if (!likeResponse.ok && likeResponse.body?.isAlreadyLiked === true) {
				// If already liked then try an unlike post.
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

	/**
	 * Handles saving the changes made from an edit post interaction.
	 * @param {Object} data Data from callback.
	 * @param {string} data.text New text of post to update.
	 */
	const onEditPost = async ({ postId, text }) => {
		// Cleanup any existing `Modals` before loading this one.
		// As this `Modal` can be triggered from another.
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

	/**
	 * Handles deleting a post.
	 * @param {Object} data Data from callback.
	 * @param {number} data.postId ID of post to delete.
	 */
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

	/**
	 * Conditionally render a `Post` component.
	 */
	const renderPost = ({ item: post }, options) => {
		const isLikeable = userId !== signedInUserId && post.author.userId !== signedInUserId;
		const isOwn = post.author.userId === signedInUserId;
		const isFocused = Boolean(options?.isFocused);

		const style = !isFocused && styles.post;

		function renderCard() {
			// According to API spec.
			// If Post is authored by the currently signed in user it cannot be liked,
			// but can be edited / deleted.
			if (isOwn) {
				return <Post post={post} onEdit={onShowEditPostModal} onDelete={onShowDeleteDialog} onPress={onShowPostModal} isFocused={isFocused} />;
			}

			// According to API spec.
			// If Post is by a different user and not on the currently signed in user's profile,
			// it can be liked.
			if (isLikeable) {
				return <Post post={post} onLike={onLikePost} onPress={onShowPostModal} isFocused={isFocused} />;
			}

			// Fallback post to render "something", if above conditions fail to meet requirements.
			return <Post post={post} onPress={onShowPostModal} isFocused={isFocused} />;
		}

		return <View style={style}>{renderCard()}</View>;
	};

	return (
		<View style={[PageStyles(theme, insets).page]}>
			<ProfileHero profilePhoto={profilePhoto} user={user} isNested={userId !== signedInUserId} onEdit={onEditProfile} onLogout={onLogout} onGoToHome={onGoToHome} />
			<View style={styles.spacing}>
				<Divider text="Posts" />
			</View>
			{isFriend || userId === signedInUserId ? (
				<FlatList
					style={[styles.postList]}
					contentContainerStyle={styles.postContent}
					data={posts}
					ListHeaderComponent={<PostCompose onPost={onPost} />}
					ListHeaderComponentStyle={styles.postContent}
					renderItem={renderPost}
					keyExtractor={item => item.postId}
				/>
			) : (
				<View style={styles.postList}>
					<Button style={{ marginVertical: 16 }} mode="outlined" onPress={onAddFriend}>
						Add Friend
					</Button>
					<Paragraph style={{ textAlign: 'center' }}>
						{user?.firstName}
						&apos;s posts are hidden until they are a friend.
					</Paragraph>
				</View>
			)}
			<Portal>
				{user && <ProfileEditModal profilePhoto={profilePhoto} user={user} visible={isProfileModalVisible} onDismiss={onDismissProfileModal} onSave={onSaveProfile} />}
			</Portal>
			<Portal>
				<Modal visible={isPostModalVisible} onDismiss={onDismissPostModal} contentContainerStyle={styles.modalContent}>
					{focusedPost && renderPost({ item: focusedPost }, { isFocused: true })}
					{editingPost && <PostEdit post={editingPost} onSave={onEditPost} />}
				</Modal>
			</Portal>
			<Portal>{deletingPost && <PostDeleteDialog post={deletingPost} visible={isDialogVisible} onDismiss={onDismissDialog} onDelete={onDeletePost} />}</Portal>
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
