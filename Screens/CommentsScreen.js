import {
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  FlatList,
} from 'react-native';
import { authorization } from '../config';

import { useAddCommentMutation } from '../redux/postsSlice';

import { useState } from 'react';

import { ArrowLeftIcon } from '../components/ArrowLeftIcon';

import { Comment } from '../components/Comment';

import date from 'date-and-time';
import uk from 'date-and-time/locale/uk';

import { nanoid } from '@reduxjs/toolkit';

import { getColors } from '../utils/getColors';

date.locale(uk);

export const CommentsScreen = ({ route, navigation }) => {
  const [addComment] = useAddCommentMutation();
  const user = authorization.currentUser;

  const { postId, commentsRoute, source, theme } = route.params;
  let commentsRouteCopy = [...commentsRoute].reverse();

  const [comments, setComments] = useState(commentsRouteCopy);

  const [text, setText] = useState('');

  const sendHandler = async input => {
    if (!text) {
      return;
    }
    let newComment = {
      avatar: user?.photoURL,
      userId: user?.email,
      text: input,
      date: date.format(new Date(), 'DD MMMM, YYYY | HH:mm'),
      id: nanoid(),
    };

    let combineData = { newComment, postId };
    addComment(combineData);
    setText('');

    setComments(comments => [newComment, ...comments]);
  };

  return (
    <View
      style={{
        flex: 0,
        paddingBottom: 96,
        minHeight: '100%',
        backgroundColor: getColors(theme).primaryBackground,
      }}
    >
      <FlatList
        ListHeaderComponent={() => (
          <View style={{ marginBottom: 32 }}>
            <Image style={styles.img} source={{ uri: source }} />
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 24 }}></View>}
        ListFooterComponent={() => <View style={{ height: 31 }}></View>}
        style={[
          styles.list,
          { backgroundColor: getColors(theme).primaryBackground },
        ]}
        // nestedScrollEnabled
        data={comments}
        renderItem={({ item }) => {
          return (
            <Comment
              date={item.date}
              avatar={item?.avatar}
              text={item?.text}
              userId={item.userId}
              theme={theme}
            />
          );
        }}
        keyExtractor={item => item.id}
      ></FlatList>
      <KeyboardAvoidingView
        keyboardVerticalOffset={-130}
        behavior="padding"
        enabled
      >
        <View style={styles.bottom}>
          <View
            style={[
              styles.footerConatiner,
              {
                backgroundColor: getColors(theme).inputBackground,
                borderColor: getColors(theme).inputBorder,
              },
            ]}
          >
            <TextInput
              style={[
                styles.input,
                { color: getColors(theme).primaryTextColor },
              ]}
              placeholder="Коментувати..."
              placeholderTextColor="rgba(189, 189, 189, 1)"
              multiline={true}
              value={text}
              onChangeText={newText => {
                setText(newText);
              }}
            ></TextInput>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                sendHandler(text);
                Keyboard.dismiss();
              }}
            >
              <ArrowLeftIcon stroke={'#fff'} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,

    paddingTop: 32,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  img: {
    width: '100%',
    height: 240,
    borderRadius: 8,
  },

  footerConatiner: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 35,
    borderColor: 'rgba(232, 232, 232, 1)',

    backgroundColor: 'rgba(246, 246, 246, 1)',
  },
  input: {
    flex: 1,
    width: '85%',
    paddingLeft: 15,
    fontWeight: '500',
    fontSize: 16,
    color: 'rgb(33, 33, 33)',
  },
  btn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    boredrWidth: 1,
    transform: [{ rotate: '90deg' }],
    backgroundColor: 'rgba(255, 108, 0, 1)',
  },
  bottom: {
    marginTop: 4,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: 'transparent',
  },
});
