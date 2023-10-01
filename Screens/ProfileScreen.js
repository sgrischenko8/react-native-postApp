import {
  TouchableOpacity,
  FlatList,
  StyleSheet,
  View,
  Text,
  ImageBackground,
} from 'react-native';
import { authorization } from '../config';

import { useFetchUserPostsQuery } from '../redux/postsSlice';

import { useSelector } from 'react-redux';

import { ThemeSwitch } from '../components/ThemeSwitch';
import { Avatar } from '../components/Avatar';
import { LogOut } from '../components/LogOut';

import BackgroundImgdark from '../images/bg-dark.jpg';
import BackgroundImg from '../images/bg.jpg';

import { renderItem } from '../utils/renderPosts';

import { Loader } from '../components/Loader';

import { getColors } from '../utils/getColors';

export const ProfileScreen = () => {
  const user = authorization.currentUser;

  const { data: posts, isLoading } = useFetchUserPostsQuery(user?.email);

  const selectThemeTemp = state => state.themeTemp.themeTemp;
  const theme = useSelector(selectThemeTemp);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          height: '100%',
          backgroundColor: getColors(theme).primaryBackground,
        }}
      >
        <Loader />
      </View>
    );
  }
  return (
    <FlatList
      ListHeaderComponent={() => (
        <ImageBackground
          source={theme === 'light' ? BackgroundImg : BackgroundImgdark}
          style={styles.img}
          imageStyle={{
            resizeMode: 'cover',
            height: 842,
          }}
        >
          <ThemeSwitch theme={theme} />
          <Avatar offSet={87} theme={theme} />

          <View
            style={[
              styles.container,
              {
                backgroundColor:
                  posts.length > 0
                    ? theme === 'light'
                      ? '#fff'
                      : 'rgb(28, 28, 44)'
                    : 'transparent',
              },
            ]}
          >
            <TouchableOpacity style={styles.logOutBtn}>
              <LogOut
                theme={theme}
                fillNoPosts={
                  posts.length === 0 && theme === 'light' && 'rgb(28, 28, 44)'
                }
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.userName,
                { color: getColors(theme).primaryTextColor },
              ]}
            >
              {user?.displayName}
            </Text>
          </View>
        </ImageBackground>
      )}
      ItemSeparatorComponent={() => (
        <View
          style={{
            height: 32,
            backgroundColor:
              posts.length > 0
                ? theme === 'light'
                  ? '#fff'
                  : 'rgb(28, 28, 44)'
                : 'transparent',
          }}
        ></View>
      )}
      ListFooterComponent={() => (
        <View
          style={{
            height: 43,
            backgroundColor:
              posts.length > 0
                ? theme === 'light'
                  ? '#fff'
                  : 'rgb(28, 28, 44)'
                : 'transparent',
          }}
        ></View>
      )}
      contentContainerStyle={{
        flexGrow: 1,

        backgroundColor: 'red',
      }}
      ListEmptyComponent={() => {
        <View
          style={{
            flex: 1,
            height: '100%',
            backgroundColor: getColors(theme).primaryBackground,
          }}
        ></View>;
      }}
      style={styles.list}
      data={posts}
      renderItem={renderItem}
      keyExtractor={item => item.date}
    ></FlatList>
  );
};

const styles = StyleSheet.create({
  list: {
    position: 'absolute',
    bottom: 0,
    top: -5,
    width: '100%',
  },
  img: {
    flex: 1,
    justifyContent: 'flex-start',
    width: '100%',

    paddingTop: 147,
  },

  container: {
    alignContent: 'stretch',
    flex: 1,
    paddingTop: 22,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 32,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#fff',
  },

  logOutBtn: {
    marginLeft: 'auto',
    marginBottom: 46,
  },
  userName: {
    color: '#212121',
    fontSize: 30,
    fontWeight: '500',
    letterSpacing: 0.01,
    textAlign: 'center',
  },
});
