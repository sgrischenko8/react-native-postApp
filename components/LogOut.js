import { useLogoutMutation } from '../redux/userSlice';
import { useDispatch } from 'react-redux';
import { setAuth } from '../redux/authSlice';
import { getDefaultTheme } from '../utils/getDefaultTheme';

import { TouchableOpacity, Modal, View, StyleSheet } from 'react-native';
import { LogOutIcon } from './LogOutIcon';
import { useNavigation } from '@react-navigation/native';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  authorization,
  db,
} from '../config';
import { signOut } from 'firebase/auth';
import { Loader } from '../components/Loader';

import { getColors } from '../utils/getColors';

export const LogOut = ({ theme, fillNoPosts }) => {
  const [logout, { isLoading }] = useLogoutMutation();

  // let themePreferance = getDefaultTheme();

  const navigation = useNavigation();
  const dispatch = useDispatch();

  async function handleLogout() {
    dispatch(setAuth(false));
    navigation.navigate('Login');
    const result = await logout();
    if (result.error === 'logout failed') {
      dispatch(setAuth(true));
      navigation.goBack(null);
      return console.log('stop');
    }
    navigation.navigate('Login');
  }

  return (
    <View>
      <TouchableOpacity onPress={() => handleLogout()}>
        <LogOutIcon fill={fillNoPosts} />
      </TouchableOpacity>
      {isLoading && (
        <Modal animationType="slide" transparent={true} visible={true}>
          <View
            style={[
              styles.centeredView,
              {
                backgroundColor: getColors(theme).primaryBackground,
              },
            ]}
          >
            <Loader />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    height: '90%',
    width: '100%',
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    alignItems: 'center',

    position: 'absolute',
    top: '10%',
  },
});
