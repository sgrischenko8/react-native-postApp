import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Input } from './Input';
import { Avatar } from '../components/Avatar';
import { Loader } from '../components/Loader';

import { useTogglePasswordVisibility } from '../hooks/useTogglePasswordVisibility';

import { getColors } from '../utils/getColors';

const schema = yup.object({
  email: yup
    .string()
    .email('Must be a valid email')
    .required('Enter email address'),
  password: yup
    .string()
    .required('Enter your password')
    .min(6, 'Password must contain at least 6 characters'),
});

const schemaReg = yup.object({
  login: yup
    .string()
    .required('Enter your login')
    .min(2, 'login must be at least 2 characters long'),
  email: yup
    .string()
    .email('Must be a valid email')
    .required('Enter email address'),
  password: yup
    .string()
    .required('Enter your password')
    .min(6, 'Password must contain at least 6 characters'),
});

export const Form = ({
  title,
  btnText,
  handleFormSubmit,
  theme,
  err,
  isLoading,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(title === 'Реєстрація' ? schemaReg : schema),
  });

  const onSubmit = async data => {
    await handleFormSubmit(data, reset);
  };

  const { passwordVisibility, toggleVisibility } =
    useTogglePasswordVisibility();

  return (
    <View
      style={[
        styles.formContainer,
        { backgroundColor: getColors(theme).primaryBackground },
      ]}
    >
      {title === 'Реєстрація' && <Avatar offSet={-152} theme={theme} />}
      <Text
        style={[styles.formTitle, { color: getColors(theme).primaryTextColor }]}
      >
        {title}
      </Text>
      {title === 'Реєстрація' && (
        <View>
          <Input
            control={control}
            name="login"
            placeholder={'Логін'}
            keyboardType={'default'}
            errors={errors.login}
            theme={theme}
          ></Input>
        </View>
      )}

      <Input
        control={control}
        name="email"
        placeholder={'Адреса електронної пошти'}
        keyboardType={'email-address'}
        errors={errors.email}
        theme={theme}
      ></Input>
      {/* {errors.email && (
        <Text style={styles.errorMessage}>{errors.email?.message}</Text>
      )} */}

      <View style={styles.inputContainer}>
        <Input
          control={control}
          name="password"
          placeholder={'Пароль'}
          keyboardType={'default'}
          secureTextEntry={passwordVisibility}
          errors={errors.password}
          theme={theme}
        ></Input>
        {/* {errors.password && (
          <Text style={styles.errorMessage}>{errors.password?.message}</Text>
        )} */}

        <TouchableOpacity
          style={styles.showBtn}
          onPress={() => toggleVisibility()}
        >
          <Text
            style={[
              styles.loginBtnText,
              { color: getColors(theme).showPasswordTxt },
            ]}
          >
            Показати
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 42, height: 50 }}>
        {isLoading ? (
          <Loader />
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.submitBtn}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.btnText}>{btnText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  formContainer: {
    marginBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#fff',
    textAlign: 'center',
  },

  formTitle: {
    marginBottom: 32,
    color: '#212121',
    fontSize: 30,
    fontWeight: '500',
    letterSpacing: 0.01,
    textAlign: 'center',
  },
  inputContainer: { position: 'relative' },
  showBtn: { position: 'absolute', left: '77%', top: '20%' },
  submitBtn: {
    // marginTop: 42,

    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff6c00',
    paddingVertical: 16,
    borderRadius: 100,
  },
  btnText: { fontSize: 16, letterSpacing: 0, color: '#fff' },
  loginBtnText: { color: '#1b4371' },
  errorMessage: {
    paddingLeft: 16,
    color: 'red',
    position: 'relative',
    top: -15,
  },
});
