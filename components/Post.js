import {
  Pressable,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Image,
  ImageBackground,
} from 'react-native';

import { useIncrementLikesMutation } from '../redux/postsSlice';

import { ComentIcon } from './ComentIcon';
import { LikeIcon } from './LikeIcon';
import { GeoIcon } from './GeoIcon';

import { Like } from './Like';

import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { useRoute } from '@react-navigation/native';

import { getColors } from '../utils/getColors';

export const Post = ({
  id,
  title,
  source,
  comments,
  likes,
  location,
  country,
  region,
  latitude,
  longitude,
  owner,
}) => {
  const route = useRoute();

  const selectThemeTemp = state => state.themeTemp.themeTemp;
  const theme = useSelector(selectThemeTemp);

  const [incrementLikes] = useIncrementLikesMutation();

  const navigation = useNavigation();
  const [like, setLike] = useState(likes.length);
  const [isLikesBtnDisabled, setIsLikesBtnDisabled] = useState(
    likes.includes(owner.email)
  );

  const [isShowOwner, setIsShowOwner] = useState(false);
  const toggleShow = () => {
    setIsShowOwner(prev => !prev);
  };

  return (
    <View
      style={{
        backgroundColor: getColors(theme).primaryBackground,
        paddingLeft: 16,
        paddingRight: 16,
      }}
    >
      <View style={styles.container}>
        {route.name === 'Публікації' ? (
          <Pressable
            onTouchEnd={() => {
              setIsShowOwner(false);
            }}
            onTouchCancel={() => {
              toggleShow();
            }}
            onTouchMove={() => {
              setIsShowOwner(true);
            }}
            onLongPress={() => setIsShowOwner(true)}
          >
            <Image
              style={styles.img}
              source={{
                uri: source,
                height: 240,
              }}
            />
          </Pressable>
        ) : (
          <Image style={styles.img} source={{ uri: source }} />
        )}

        <Text
          style={[styles.title, { color: getColors(theme).primaryTextColor }]}
        >
          {title}
        </Text>

        <View style={styles.flexContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Коментарі', {
                postId: id,
                commentsRoute: comments,
                source: source,
                theme: theme,
                backgroundColor: getColors(theme).primaryBackground,
                color: getColors(theme).primaryTextColor,
              })
            }
          >
            <ComentIcon fill={comments.length > 0 ? '#FF6C00' : 'none'} />
          </TouchableOpacity>
          <Text
            style={[
              styles.comments,
              { color: getColors(theme).primaryTextColor },
            ]}
          >
            {comments.length || 0}
          </Text>
          {route.name === 'Публікації' && (
            <View style={styles.likesContainer}>
              <TouchableOpacity
                disabled={isLikesBtnDisabled ? true : false}
                onPress={async () => {
                  if (isLikesBtnDisabled === false) {
                    setIsLikesBtnDisabled(true);
                    setLike(like + 1);
                    incrementLikes(id);
                  }
                }}
              >
                <LikeIcon fill={like > 0 ? '#FF6C00' : '#bdbdbd'} />
              </TouchableOpacity>
              <Like like={like} color={getColors(theme).primaryTextColor} />
            </View>
          )}
          <View style={styles.locationContainer}>
            <TouchableOpacity
              disabled={!latitude}
              onPress={() =>
                navigation.navigate('MapScreen', {
                  latitude: latitude,
                  longitude: longitude,
                  title: title,
                  backgroundColor: getColors(theme).primaryBackground,
                  color: getColors(theme).primaryTextColor,
                })
              }
            >
              <GeoIcon
                fill={
                  latitude
                    ? getColors(theme).subtleTextColor
                    : getColors(theme).inputBackground
                }
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.location,
                { color: getColors(theme).primaryTextColor },
              ]}
            >
              {location ||
                (route.name === 'Публікації' ? `${country}` : `${country}`)}
            </Text>
          </View>
        </View>
      </View>
      {!location && (
        <Text
          style={[
            styles.location,
            { color: getColors(theme).primaryTextColor, marginLeft: 'auto' },
          ]}
        >
          {region},
        </Text>
      )}
      {isShowOwner && (
        <View style={styles.profileContainer}>
          <ImageBackground
            source={{
              uri: owner.avatar || './a.jpg',
            }}
            style={styles.avatar}
          ></ImageBackground>
          <Text style={styles.name}>{owner.login}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'column', gap: 8 },
  img: {
    width: '100%',
    // width: 340,
    height: 240,
    borderWidth: 1,
    borderRadius: 8,
  },

  title: {
    color: '#212121',
    fontWeight: '500',
    fontSize: 16,
    letterSpacing: 0,
  },
  flexContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  comments: {
    marginLeft: 6,
    marginRight: 24,
    fontSize: 16,
    fontWeight: 'normal',
    letterSpacing: 0,
    color: '#212121',
  },
  likesContainer: { flexDirection: 'row' },

  locationContainer: { flexDirection: 'row', marginLeft: 'auto' },
  location: {
    marginLeft: 6,
    textDecorationLine: 'underline',
    color: '#212121',
  },
  profileContainer: {
    position: 'absolute',
    alignItems: 'flex-end',
    top: 160,
    right: 22,
    opacity: 0.5,
    zIndex: 2,
  },
  avatar: {
    flex: 1,
    width: 60,
    height: 60,
    overflow: 'hidden',
    borderRadius: 16,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 0,
    color: '#fff',
  },
});
