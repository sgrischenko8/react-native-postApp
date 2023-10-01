import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  ScrollView,
  Image,
  Pressable,
  TouchableOpacity,
} from 'react-native';

export const Like = ({ like, color }) => {
  {
    return <Text style={[styles.likes, { color: color }]}>{like}</Text>;
  }
};

const styles = StyleSheet.create({
  likes: {
    marginLeft: 6,

    fontSize: 16,
    fontWeight: 'normal',
    letterSpacing: 0,
    color: '#212121',
  },
});
