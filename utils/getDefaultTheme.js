import { Appearance } from 'react-native';
const colorScheme = Appearance.getColorScheme();

export const getDefaultTheme = () => {
  let theme = colorScheme === 'light' ? 'light' : 'dark';
  return theme;
};
