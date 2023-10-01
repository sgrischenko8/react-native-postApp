import { doc, getDoc } from 'firebase/firestore';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';
import { authorization, db } from '../config';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { setThemeTemp } from '../redux/themeTempSlice';
import { useFetchPostsQuery } from '../redux/postsSlice';

import { renderItem } from '../utils/renderPosts';

import { Loader } from '../components/Loader';

import { getColors } from '../utils/getColors';

export const PostsScreen = () => {
  const { data: posts, isLoading } = useFetchPostsQuery();

  const user = authorization.currentUser;
  // console.log(user, 'user');
  const selectThemeTemp = state => state.themeTemp.themeTemp;
  const theme = useSelector(selectThemeTemp);

  const selectAuth = state => state?.auth?.auth;
  const auth = useSelector(selectAuth);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // console.log('UseEffect ---------> ');
    if (auth && user) {
      setLoading(true);
      const fetchUserTheme = async () => {
        console.log(authorization.currentUser?.email, 'COME FOR THEME ');
        try {
          const snapshot = doc(db, 'users', authorization.currentUser?.email);
          const docSnap = await getDoc(snapshot);

          dispatch(setThemeTemp(docSnap.data().theme || ''));
          setLoading(false);
        } catch (error) {
          return { error };
        }
      };
      fetchUserTheme();
    }
  }, [auth]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: getColors(theme).primaryBackground },
      ]}
    >
      {isLoading || loading ? (
        <Loader />
      ) : (
        <FlatList
          ListHeaderComponent={() => (
            <View style={styles.profileContainer}>
              <ImageBackground
                source={{
                  uri: user?.photoURL || './a.jpg',
                }}
                style={[
                  styles.avatar,
                  { borderColor: getColors(theme).avatarBorderColor },
                ]}
              ></ImageBackground>
              <View style={styles.credentialsContainer}>
                <Text
                  style={[
                    styles.name,
                    { color: getColors(theme).primaryTextColor },
                  ]}
                >
                  {user?.displayName}
                </Text>
                <Text
                  style={[
                    styles.email,
                    { color: getColors(theme).subtleTextColorEmail },
                  ]}
                >
                  {user?.email}
                </Text>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 32 }}></View>}
          ListFooterComponent={() => (
            <View
              style={{
                height: 43,
                backgroundColor: getColors(theme).primaryBackground,
              }}
            ></View>
          )}
          style={styles.list}
          nestedScrollEnabled
          data={posts}
          renderItem={renderItem}
          keyExtractor={item => `${item.owner.email}-${item.date}`}
        ></FlatList>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 32,
  },
  profileContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    maxHeight: 60,
    marginBottom: 32,
    marginLeft: 16,
  },
  avatar: {
    flex: 1,
    maxWidth: 60,
    height: 60,
    overflow: 'hidden',
    borderWidth: 0.75,
    borderColor: 'transparent',
    borderRadius: 16,
    backgroundColor: 'rgba(33, 33, 33, 0.8)',
  },
  credentialsContainer: { flex: 1, paddingVertical: 13 },
  name: {
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 0,
    color: '#212121',
  },
  email: {
    fontWeight: 'normal',
    fontSize: 11,
    letterSpacing: 0,
    color: 'rgba(33, 33, 33, 0.8)',
  },
  list: {
    flex: 1,
    flexDirection: 'column',
  },
});
