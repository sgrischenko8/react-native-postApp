import { StyleSheet, Text, View, Image } from 'react-native';
import { authorization } from '../config';

import { getColors } from '../utils/getColors';

export const Comment = ({ date, avatar, text, userId, theme }) => {
  const user = authorization.currentUser;

  return (
    <View
      style={[
        styles.container,
        { flexDirection: userId === user?.email ? 'row-reverse' : 'row' },
      ]}
    >
      <Image
        source={
          avatar.toString().includes('file:///') ||
          avatar.toString().includes('http')
            ? { uri: avatar }
            : avatar
        }
        style={{ resizeMode: 'cover', height: 28, width: 28, borderRadius: 50 }}
      ></Image>
      <View
        style={[
          styles.commentContainer,
          {
            borderTopLeftRadius: userId === user?.email ? 6 : 0,
            borderTopRightRadius: userId === user?.email ? 0 : 6,
            borderColor: getColors(theme).inputBorder,
            backgroundColor: getColors(theme).commentBackground,
          },
        ]}
      >
        <Text
          style={[styles.text, { color: getColors(theme).primaryTextColor }]}
        >
          {text}
        </Text>
        <Text style={styles.date}>{date}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 16, flexDirection: 'row' },
  commentContainer: {
    padding: 16,
    paddingRight: 16,
    width: '86%',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: 'transparent',
    borderTopRightRadius: 6,
    borderTopLeftRadius: 0,
  },
  text: {
    marginBottom: 8,
    fontSize: 13,
    fontWeight: 'normal',
    color: 'rgb(33, 33, 33)',
  },
  date: { fontSize: 10, marginLeft: 'auto', color: '#bdbdbd' },
});
