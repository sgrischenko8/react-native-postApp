import * as ImagePicker from 'expo-image-picker';
import { updateProfile } from 'firebase/auth';

import * as MediaLibrary from 'expo-media-library';

import {
  Pressable,
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import { authorization } from '../config';

import { PlusIcon } from '../components/PlusIcon';

import { useDispatch, useSelector } from 'react-redux';
import { setAvatarTemp } from '../redux/avatarTempSlice';
import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';

import { useUpdateUserMutation } from '../redux/userSlice';
import { Loader } from './Loader';

import { getColors } from '../utils/getColors';

export const Avatar = ({ offSet, theme }) => {
  const route = useRoute();

  const selectAuth = state => state?.auth?.auth;
  const auth = useSelector(selectAuth);

  const selectAvatarTemp = state => state.avatarTemp.avatarTemp;
  const avatarTemp = useSelector(selectAvatarTemp);
  console.log(avatarTemp.includes('file:///'), avatarTemp, 'avatar---------');
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const user = authorization.currentUser;

  const pickImage = async () => {
    try {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });

      delete result.cancelled;
      result = {
        ...result,
      };

      let img = result.assets[0].uri;
      await MediaLibrary.createAssetAsync(img);
      if (!auth) {
        dispatch(setAvatarTemp(img));
        return;
      }
      await updateUser(img);
    } catch (error) {
      console.log(error);
    }
  };

  const clearImg = () => {
    if (!auth) {
      return dispatch(setAvatarTemp('./a.jpg'));
    }

    updateUser('./a.jpg');
  };

  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View
      style={[
        styles.photoThumb,
        {
          backgroundColor: 'rgba(33, 33, 33, 0.8)',
          borderColor: getColors(theme).avatarBorderColor,
          top: offSet,
        },
      ]}
    >
      <ImageBackground
        source={{
          uri: route?.key.includes('Profile') ? user?.photoURL : avatarTemp,
        }}
        style={styles.avatar}
      ></ImageBackground>
      <Pressable
        style={[
          styles.changeBtn,
          {
            backgroundColor: route?.key.includes('Profile')
              ? theme === 'light'
                ? '#fff'
                : 'rgb(28, 28, 44)'
              : getColors(theme).primaryBackground,
            borderColor:
              user?.photoURL?.includes('file:///') ||
              avatarTemp.includes('file:///')
                ? '#E8E8E8'
                : '#ff6c00',
            transform:
              user?.photoURL?.includes('file:///') ||
              avatarTemp.includes('file:///')
                ? 'rotate(45deg)'
                : 'rotate(90deg)',
          },
        ]}
      >
        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
          <PlusIcon
            fill={
              user?.photoURL?.includes('file:///') ||
              avatarTemp.includes('file:///')
                ? '#BDBDBD'
                : '#ff6c00'
            }
          />
        </TouchableOpacity>
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={[
            styles.centeredView,
            {
              backgroundColor: getColors(theme).primaryBackground,
            },
          ]}
        >
          {isLoading ? (
            <Loader />
          ) : (
            <View
              style={[
                styles.modalView,
                { backgroundColor: getColors(theme).inputBackground },
              ]}
            >
              <View
                style={{
                  flex: 1,
                  paddingTop: 20,
                  alignItems: 'center',
                  // justifyContent: 'center',
                  gap: 16,
                }}
              >
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    pickImage();
                  }}
                >
                  <Text style={styles.textUppercase}>
                    Pick an image from gallery
                  </Text>
                </Pressable>

                <Image
                  source={{
                    uri: route?.key.includes('Profile')
                      ? user?.photoURL
                      : avatarTemp,
                  }}
                  style={{ width: 300, height: 300, borderRadius: 8 }}
                />
              </View>
              <View style={styles.flexHorizontal}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    setModalVisible(!modalVisible);

                    clearImg();
                  }}
                >
                  <Text style={styles.textStyle}>Clear</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Close</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  photoThumb: {
    width: 120,
    height: 120,
    position: 'absolute',
    backgroundColor: '#f6f6f6',
    borderColor: 'transparent',
    borderRadius: 16,
    borderWidth: 0.75,
    top: 0,
    alignSelf: 'center',
    zIndex: 1,
  },
  avatar: {
    flex: 1,
    overflow: 'hidden',
    borderWidth: 0,
    borderColor: 'transparent',
    borderRadius: 16,
  },
  changeBtn: {
    display: 'flex',
    position: 'absolute',
    bottom: 14,
    left: '90%',
    width: 25,
    height: 25,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },

  centeredView: {
    height: '72%',
    width: 330,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 20,
    position: 'absolute',
    top: '28%',
    left: '4%',
  },
  modalView: {
    width: 330,
    height: 460,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    // paddingBottom: 40,
    alignItems: 'center',

    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.85,
    // shadowRadius: 4,
  },
  flexHorizontal: { flexDirection: 'row', gap: 60 },
  button: {
    borderRadius: 14,
    padding: 10,
    elevation: 2,
  },

  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textUppercase: {
    textTransform: 'uppercase',
    color: 'white',
    fontWeight: 'bold',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
