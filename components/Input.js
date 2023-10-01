import {
  StyleSheet,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  View,
  Text,
} from 'react-native';
import { useController } from 'react-hook-form';
import { useState } from 'react';

import { getColors } from '../utils/getColors';

export const Input = ({
  control,
  name,
  placeholder,
  keyboardType,
  secureTextEntry,
  errors,
  theme,
}) => {
  const { field } = useController({
    control,
    defaultValue: '',
    name,
  });

  const [isFocus, setIsFocus] = useState(false);

  function onFocus() {
    setIsFocus(true);
  }

  function onBlur() {
    setIsFocus(false);
  }

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Platform.OS == 'ios' ? '40' : '40'}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
    >
      <View>
        <View
          style={[
            styles.errorBorder,
            {
              borderWidth: errors ? 1 : 0,
            },
          ]}
        >
          <TextInput
            onBlur={() => onBlur()}
            onFocus={() => onFocus()}
            style={[
              styles.input,
              {
                backgroundColor: getColors(theme).inputBackground,
                color: getColors(theme).primaryTextColor,
                borderColor: isFocus ? '#ff6c00' : getColors(theme).inputBorder,
              },
            ]}
            placeholder={placeholder}
            placeholderTextColor="#bdbdbd"
            value={field.value}
            secureTextEntry={secureTextEntry}
            selectionColor="#ff6c00"
            keyboardType={keyboardType}
            onChangeText={field.onChange}
          ></TextInput>
        </View>
        {errors && <Text style={styles.errorMessage}>{errors.message}</Text>}
      </View>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  errorBorder: {
    borderRadius: 8,
    borderWidth: 0,
    borderColor: 'red',
    marginBottom: 16,
  },
  input: {
    height: 50,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    backgroundColor: '#f6f6f6',
    color: '#212121',
  },
  errorMessage: {
    paddingLeft: 16,
    color: 'red',
    position: 'relative',
    top: -15,
  },
});
