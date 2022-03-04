import AsyncStorage from '@react-native-async-storage/async-storage';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { createPost } from '../api/requests.posts';

const BACKGROUND_FETCH_TASK = 'background-post';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();

  const userId = await AsyncStorage.getItem('user_id');
  const sessionToken = await AsyncStorage.getItem('session_token');

  const scheduleJson = await AsyncStorage.getItem('in_schedule');
  const schedule = scheduleJson ? JSON.parse(scheduleJson) : [];

  let isReadyForUpdate = false;

  for (const task of schedule) {
    const { draft, timestamp } = task;

    if (timestamp >= now) {
      await createPost({ userId, sessionToken, text: draft.text });
      isReadyForUpdate = true;
    }
  }

  return isReadyForUpdate
    ? BackgroundFetch.BackgroundFetchResult.NewData
    : BackgroundFetch.BackgroundFetchResult.NoData;
});

export async function registerBackgroundPostTask() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 1, // 1 minute after app is backgrounded.
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

export async function unregisterBackgroundPostTask() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}
