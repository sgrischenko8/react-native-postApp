import { useRegisterMutation, useAddUserMutation } from '../redux/userSlice';

import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import BackgroundImgdark from '../images/bg-dark.jpg';
import BackgroundImg from '../images/bg.jpg';
import { Form } from '../components/Form.js';

import Toast from 'react-native-toast-message';

import { getColors } from '../utils/getColors';

export const RegistrationScreen = ({ route }) => {
  const { theme } = route.params;
  console.log('re-render reg-------------');
  const [register, { isLoading }] = useRegisterMutation();
  const [addUser, { isLoading: isLoadingAddingUser }] = useAddUserMutation();

  const selectAvatarTemp = state => state.avatarTemp.avatarTemp;
  const avatarTemp = useSelector(selectAvatarTemp);

  const navigation = useNavigation();

  const registerDB = async ({ login, email, password }) => {
    const response = await register({ login, email, password, avatarTemp });

    if (response.error === 'registration failed') {
      return;
    }
    await addUser({ login, email, password, theme, avatarTemp });
    showToast(login);
    navigation.navigate('Login');
  };

  function showToast(login) {
    Toast.show({
      type: 'success',
      text1: `Congratulation, ${login}!`,
      text2: 'You have successfully registered',
    });
  }

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
        <View
          style={[
            styles.credentialContainer,
            { backgroundColor: getColors(theme).primaryBackground },
          ]}
        >
          <Form
            title={'Реєстрація'}
            btnText={'Зареєструватися'}
            handleFormSubmit={registerDB}
            theme={theme}
            isLoading={isLoading || isLoadingAddingUser}
          />

          <View style={styles.loginBtnContainer}>
            <Text style={styles.text}>Вже є акаунт? </Text>
            <TouchableOpacity
              style={styles.appositeBtn}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.appositeBtnText}> Увійти</Text>
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
    paddingTop: 147,
  },
  wrapper: { flex: 1 },
  credentialContainer: {
    paddingTop: 92,
    paddingBottom: 45,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,

    backgroundColor: '#fff',
  },

  loginBtnContainer: {
    flex: 0,

    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: { color: '#1b4371', textAlign: 'center' },
  appositeBtn: { backgroundColor: 'transparent' },
  appositeBtnText: { color: '#1b4371' },
  lightContainer: {
    backgroundColor: '#d0d0c0',
    color: '#000',
  },
  darkContainer: {
    backgroundColor: '#242c40',
    color: '#d0d0c0',
  },
});
