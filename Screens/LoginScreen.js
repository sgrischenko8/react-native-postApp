import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useLoginMutation } from '../redux/userSlice';
import { setAuth } from '../redux/authSlice';

import { ThemeSwitch } from '../components/ThemeSwitch';

import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import BackgroundImgdark from '../images/bg-dark.jpg';
import BackgroundImg from '../images/bg.jpg';
import { Form } from '../components/Form.js';

import { getColors } from '../utils/getColors';

export const LoginScreen = () => {
  const selectThemeTemp = state => state.themeTemp.themeTemp;
  const theme = useSelector(selectThemeTemp);
  console.log('re-render login-------------');
  const dispatch = useDispatch();

  const navigation = useNavigation();

  const [login, { isLoading }] = useLoginMutation();

  const loginDB = async (data, reset) => {
    const result = await login(data);

    if (result.error === 'invalid-login-credentials') {
      return Alert.alert(
        'Невірно вказані дані',
        '',
        [
          {
            text: 'Зрозуміло',
            style: 'cancel',
          },
        ],
        {
          cancelable: true,
        }
      );
    }
    if (result.error === 'login failed') {
      return Alert.alert(
        'Логінізація не вдалась',
        '',
        [
          {
            text: 'Зрозуміло',
            style: 'cancel',
          },
        ],
        {
          cancelable: true,
        }
      );
    }
    dispatch(setAuth(true));
    navigation.navigate('Home');
    reset();
  };

  return (
    <View style={styles.wrapper}>
      <ImageBackground
        source={theme === 'light' ? BackgroundImg : BackgroundImgdark}
        style={styles.img}
        imageStyle={{
          resizeMode: 'cover',
          height: 812,
        }}
      >
        <ThemeSwitch theme={theme} />

        <View
          style={[
            styles.credentialContainer,
            { backgroundColor: getColors(theme).primaryBackground },
          ]}
        >
          <Form
            title={'Увійти'}
            btnText={'Увійти'}
            handleFormSubmit={loginDB}
            theme={theme}
            isLoading={isLoading}
          />

          <View style={styles.loginBtnContainer}>
            <Text style={styles.text}>Немає акаунту? </Text>
            <TouchableOpacity
              style={styles.appositeBtn}
              onPress={() =>
                navigation.navigate('Registration', {
                  theme: theme,
                })
              }
            >
              <Text style={styles.appositeBtnText}>Зареєструватися</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  img: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
  },
  wrapper: { flex: 1 },
  switch: { position: 'absolute', top: 5, right: 90 },
  credentialContainer: {
    paddingTop: 32,
    paddingBottom: 111,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },

  loginBtnContainer: {
    flex: 0,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: { color: '#1b4371', textAlign: 'center' },
  appositeBtn: { backgroundColor: 'transparent' },
  appositeBtnText: {
    color: '#1b4371',
    textDecorationLine: 'underline',
  },
});
