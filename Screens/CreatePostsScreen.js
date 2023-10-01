import {
  Pressable,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { authorization } from '../config';

import { Camera } from 'expo-camera';
// import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';

import { useAddPostMutation } from '../redux/postsSlice';

import { useNavigation, useIsFocused } from '@react-navigation/native';

import React, { useState, useEffect, useRef } from 'react';

import { TrashIcon } from '../components/TrashIcon';
import { CameraIcon } from '../components/CameraIcon';
import { Loader } from '../components/Loader';

import { GeoIcon } from '../components/GeoIcon';
import { Flipicon } from '../components/FlipIcon';

import { useForm, Controller } from 'react-hook-form';

import { getColors } from '../utils/getColors';

import date from 'date-and-time';
import uk from 'date-and-time/locale/uk';

date.locale(uk);

export const CreatePostsScreen = ({ route }) => {
  const { theme } = route.params;

  const [addPost, { isLoading }] = useAddPostMutation();
  const user = authorization.currentUser;

  let location = undefined;

  const [coords, setCoords] = useState(null);

  const [uri, setUri] = useState(() => {});

  const [hasPermission, setHasPermission] = useState(null);

  const [isFront, setIsFront] = useState(false);
  const cameraRef = useRef(null);

  const [isAllowToSubmit, setIsAllowToSubmit] = useState(false);
  const toggleImg = () => {
    setIsAllowToSubmit(prev => !prev);
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      location: '',
    },
  });

  const navigation = useNavigation();

  const onSubmit = async data => {
    const owner = {};
    owner.login = user.displayName;
    owner.avatar = user?.photoURL || './a.jpg';
    owner.email = user?.email;

    data.photoSource = uri;
    data.owner = owner;
    if (coords) {
      data.geolocation = coords;
    }

    await addPost(data);

    setCoords(null);
    reset();
    setUri(null);
    toggleImg();
    navigation.navigate('Публікації');
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    console.log('useEff');

    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();

      setHasPermission(status === 'granted');

      let data = await Location.requestForegroundPermissionsAsync();
      if (data.status !== 'granted') {
        console.log('Permission to access location was denied');
      }
    })();

    return () => {
      setIsAllowToSubmit(false);
      setUri('./a.jpg');
    };
  }, [isFocused]);

  const flipCamera = () => {
    setIsFront(prev => !prev);
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: getColors(theme).primaryBackground }}
    >
      <View style={styles.wrapper}>
        <ImageBackground
          source={{
            uri: uri,
          }}
          resizeMode="cover"
          style={[
            styles.photoThumb,
            {
              paddingHorizontal: isFront ? 60 : 0,
              backgroundColor: getColors(theme).avatarBackground,
              borderColor: getColors(theme).avatarBorderColor,
            },
          ]}
        >
          {!isAllowToSubmit && isFocused && (
            <Camera
              style={styles.camera}
              type={
                isFront
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              }
              ref={cameraRef}
              autoFocus={false}
            >
              <Pressable
                style={styles.cameraIcon}
                onPress={async () => {
                  if (cameraRef) {
                    try {
                      let data = await cameraRef.current.takePictureAsync({
                        skipProcessing: true,
                      });
                      const photoPath = data.uri;
                      setUri(photoPath);

                      await MediaLibrary.createAssetAsync(photoPath);
                      location = await Location.getCurrentPositionAsync({});
                      let region = await Location.reverseGeocodeAsync({
                        longitude: location.coords.longitude,
                        latitude: location.coords.latitude,
                      });
                      let coordinates = {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        country: region[0].country,
                        region: region[0].region,
                      };
                      setCoords(coordinates);

                      toggleImg();
                    } catch (error) {
                      console.log(error);
                    }
                  }
                }}
              >
                <CameraIcon></CameraIcon>
              </Pressable>
              <Pressable onPress={() => flipCamera()} style={styles.flipCamera}>
                <Flipicon />
              </Pressable>
              {!hasPermission && (
                <Text style={styles.noAccess}>no access to camera</Text>
              )}
            </Camera>
          )}
        </ImageBackground>

        <Text style={styles.text}>
          {isAllowToSubmit === false ? 'Завантажте фото' : 'Редагувати фото'}
        </Text>
        <KeyboardAvoidingView
          keyboardVerticalOffset={-130}
          behavior="padding"
          enabled
        >
          <View style={styles.inputContainer}>
            <View
              style={[
                styles.flexContainer,
                {
                  borderColor: getColors(theme).avatarBorderColor,
                },
              ]}
            >
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      { color: getColors(theme).primaryTextColor },
                    ]}
                    placeholder="Назва..."
                    placeholderTextColor="#bdbdbd"
                    autoCapitalize="words"
                    // value={field.value}
                    // onChangeText={field.onChange}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  ></TextInput>
                )}
                name="title"
              />
            </View>

            <View
              style={[
                styles.flexContainer,
                {
                  borderColor: getColors(theme).avatarBorderColor,
                },
              ]}
            >
              <GeoIcon fill={getColors(theme).subtleTextColor} />
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      { color: getColors(theme).primaryTextColor },
                    ]}
                    placeholder={
                      coords
                        ? `${coords.region}, ${coords.country}`
                        : 'Місцевість...'
                    }
                    placeholderTextColor="#bdbdbd"
                    autoCapitalize="words"
                    // value={field.value}
                    // onChangeText={field.onChange}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  ></TextInput>
                )}
                name="location"
              />
            </View>
          </View>
        </KeyboardAvoidingView>
        {isLoading ? (
          <Loader />
        ) : (
          <Pressable
            disabled={isAllowToSubmit === false ? true : false}
            style={[
              styles.submitBtn,
              {
                backgroundColor:
                  isAllowToSubmit === false
                    ? getColors(theme).inputBackground
                    : '#ff6c00',
              },
            ]}
            onPress={handleSubmit(onSubmit)}
          >
            <Text
              style={[
                styles.btnText,
                { color: isAllowToSubmit === false ? '#BDBDBD' : '#fff' },
              ]}
            >
              Опубліковати
            </Text>
          </Pressable>
        )}

        <TouchableOpacity
          style={[
            styles.btn,
            { backgroundColor: getColors(theme).inputBackground },
          ]}
          onPress={() => {
            if (isAllowToSubmit) {
              toggleImg();
              setUri(null);
            }
          }}
        >
          <TrashIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 32,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 10,
    height: '100%',
  },
  photoThumb: {
    paddingHorizontal: 0,
    marginBottom: 8,
    alignItems: 'center',

    minWidth: '100%',
    height: 240,
    backgroundColor: '#f6f6f6',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 8,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
    justifyContent: 'center',

    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
  },
  cameraIcon: {
    width: 60,
    height: 60,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 3,
  },
  flipCamera: {
    position: 'absolute',
    bottom: 20,
    right: 0,
    alignSelf: 'flex-end',
    marginRight: 16,
    borderRadius: 50,
    borderColor: '#bdbdbd',
    borderWidth: 0.5,
    borderStyle: 'dashed',
    padding: 8,
    transform: 'scale(0.7)',
  },
  noAccess: {
    color: 'rgba(200, 50, 50, 05)',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
    fontSize: 20,
    borderStyle: 'dashed',
    borderColor: 'rgba(200, 50, 50, 05)',
    borderWidth: 1,
    borderRadius: 6,
    width: '50%',
  },
  text: { color: '#bdbdbd', fontSize: 16, letterSpacing: 0 },
  inputContainer: {
    paddingTop: 32,
    paddingBottom: 32,

    // marginBottom: 120,
  },
  flexContainer: {
    flex: 0,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#e8e8e8',
  },
  input: {
    height: 50,
    paddingTop: 16,
    paddingBottom: 16,
    fontWeight: '500',
    color: '#212121',
    fontSize: 16,
    letterSpacing: 0,
  },
  submitBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff6c00',
    paddingVertical: 16,
    borderRadius: 100,
  },
  btnText: { fontSize: 16, letterSpacing: 0, color: '#fff' },

  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 100,
    paddingVertical: 8,
    width: 70,
    height: 40,
    backgroundColor: '#f6f6f6',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
  },
});
