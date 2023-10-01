import { doc, getDoc } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';

import {
  Pressable,
  TouchableOpacity,
  StyleSheet,
  Button,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

import { HeaderBackButton } from '@react-navigation/elements';
import { ArrowLeftIcon } from '../components/ArrowLeftIcon';

import { PostsScreen } from './PostsScreen';
import { ProfileScreen } from './ProfileScreen';
import { CreatePostsScreen } from './CreatePostsScreen';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useNavigation } from '@react-navigation/native';
import { GridIcon } from '../components/GridIcon';
import { UserIcon } from '../components/UserIcon';
import { PlusIcon } from '../components/PlusIcon';

import { LogOut } from '../components/LogOut';

import { getColors } from '../utils/getColors';

const Tabs = createBottomTabNavigator();

const MyCustomHeaderBackImage = color => <ArrowLeftIcon stroke={color} />;

export const Home = () => {
  const selectThemeTemp = state => state.themeTemp.themeTemp;
  const theme = useSelector(selectThemeTemp);

  const navigation = useNavigation();

  const navigationOptions = ({ navigation }) => ({
    headerLeft: (
      <Pressable>
        (
        <HeaderBackButton
          onPress={() =>
            navigation.navigate('Публікації', {
              theme: theme,
            })
          }
        />
        )
      </Pressable>
    ),
  });

  function MyTabBar({ state, descriptors, navigation }) {
    if (navigation.getState().index === 1) {
      return;
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          height: 60,
          gap: 16,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: getColors(theme).primaryBackground,
          borderTopWidth: 0.5,
          borderColor: getColors(theme).iconFill,
        }}
      >
        {state.routes.map((route, index) => {
          let icon = <Pressable></Pressable>;
          let background = 'transparent';
          let screen = route.name;

          if (route.name === 'Публікації') {
            icon = (
              <GridIcon
                fill={getColors(theme).primaryBackground}
                stroke={getColors(theme).primaryTextColor}
              />
            );
          }
          if (route.name === 'Створити публікацію') {
            icon = <PlusIcon fill={getColors(theme).primaryBackground} />;
            background = '#ff6c00';
            if (navigation.getState().index === 2) {
              icon = <UserIcon fill={getColors(theme).primaryBackground} />;
              screen = 'Profile';
            }
          }
          if (route.name === 'Profile') {
            icon = <UserIcon fill={getColors(theme).subtleTextColorEmail} />;
            if (navigation.getState().index === 2) {
              icon = <PlusIcon fill={getColors(theme).subtleTextColorEmail} />;
              screen = 'Створити публікацію';
            }
          }

          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            navigation.navigate({ name: screen });
            // if (!isFocused && !event.defaultPrevented) {
            //   // The `merge: true` option makes sure that the params inside the tab screen are preserved
            //   navigation.navigate({ name: screen, merge: true });
            // }
          };
          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={[
                {
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 40,
                  maxWidth: 70,
                  borderWidth: 1,
                  borderRadius: 20,
                  borderColor: 'transparent',
                  backgroundColor: 'transparent',
                },
                {
                  backgroundColor:
                    background === '#ff6c00' ? '#ff6c00' : 'transparent',
                },
              ]}
              key={route.key}
            >
              {icon}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  return (
    <Tabs.Navigator
      tabBar={props => <MyTabBar {...props} />}
      initialRouteName="Публікації"
      screenOptions={{
        headerTintColor: getColors(theme).primaryTextColor,
        headerStyle: {
          borderWidth: 1,
          borderBottomColor:
            theme === 'light' ? 'rgba(33, 33, 33, 0.3)' : '#1b4371',
          backgroundColor: getColors(theme).primaryBackground,
        },
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'medium',
          fontSize: 17,
          lineHeight: 22,
          letterSpacing: -0.41,
        },
      }}
    >
      <Tabs.Screen
        name="Публікації"
        component={PostsScreen}
        initialParams={{ theme }}
        options={{
          title: 'Публікації',

          headerRight: () => (
            <TouchableOpacity style={{ paddingRight: 16 }}>
              <LogOut theme={theme} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="Створити публікацію"
        component={CreatePostsScreen}
        initialParams={{ theme }}
        options={{
          title: 'Створити публікацію',
          headerBackVisible: true,

          headerLeft: () => (
            <HeaderBackButton
              backImage={() =>
                MyCustomHeaderBackImage(getColors(theme).subtleTextColorEmail)
              }
              onPress={() => navigation.navigate('Публікації')}
            />
          ),

          // tabBarIcon: ({ focused, color, size }) => <PlusIcon />,
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ theme }}
        options={{
          headerShown: false,
        }}
      />
    </Tabs.Navigator>
  );
};
