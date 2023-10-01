import { useSelector } from 'react-redux';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { RegistrationScreen } from './Screens/RegistrationScreen';
import { LoginScreen } from './Screens/LoginScreen';
import { Home } from './Screens/Home';
import { MapScreen } from './Screens/MapScreen';
import { CommentsScreen } from './Screens/CommentsScreen';

import Toast from 'react-native-toast-message';

const MainStack = createStackNavigator();

export default function Main() {
  const selectAuth = state => state?.auth?.auth;
  const auth = useSelector(selectAuth);

  return (
    <NavigationContainer>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <MainStack.Navigator initialRouteName={auth ? 'Home' : 'Login'}>
            <MainStack.Screen
              name="Registration"
              component={RegistrationScreen}
              options={{ headerShown: false }}
            />

            <MainStack.Screen
              name="MapScreen"
              component={MapScreen}
              options={({ route }) => ({
                title: route.params.title || 'Локація світлини',
                headerTitleAlign: 'center',
                headerTintColor: route.params.color,
                headerStyle: {
                  backgroundColor: route.params.backgroundColor,
                },
              })}
            />
            <MainStack.Screen
              name="Коментарі"
              component={CommentsScreen}
              options={({ route }) => ({
                headerTitleAlign: 'center',
                headerTintColor: route.params.color,
                headerStyle: {
                  backgroundColor: route.params.backgroundColor,
                },
              })}
            />

            <MainStack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />

            <MainStack.Screen
              name="Home"
              component={Home}
              options={{
                headerShown: false,
              }}
            />
          </MainStack.Navigator>
          <StatusBar style="auto" />
          <Toast topOffset={100} />
        </View>
      </TouchableWithoutFeedback>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: 'Roboto',
  },
});
