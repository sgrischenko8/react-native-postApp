import { StyleSheet, Switch } from 'react-native';
import { setThemeTemp } from '../redux/themeTempSlice';
import { useUpdateUserThemeMutation } from '../redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';

export const ThemeSwitch = () => {
  const [updateUserTheme] = useUpdateUserThemeMutation();

  const dispatch = useDispatch();

  const toggleTheme = () => {
    dispatch(setThemeTemp(theme === 'light' ? 'dark' : 'light'));

    updateUserTheme({
      theme: theme === 'light' ? 'dark' : 'light',
    });
  };

  const selectThemeTemp = state => state.themeTemp.themeTemp;
  const theme = useSelector(selectThemeTemp);

  return (
    <Switch
      trackColor={{
        false: 'rgba(218, 217, 219, 0.27)',
        true: 'rgba(129, 176, 255, 0.35)',
      }}
      thumbColor={
        theme === 'light'
          ? 'rgba(245, 221, 205, 0.5)'
          : 'rgba(244, 243, 244, 0.2)'
      }
      ios_backgroundColor="#3e3e3e"
      onValueChange={() => toggleTheme()}
      value={theme === 'light' ? true : false}
      style={styles.switch}
    />
  );
};

const styles = StyleSheet.create({
  switch: { position: 'absolute', top: 5, right: 90 },
});
