import { View, ActivityIndicator, StyleSheet } from 'react-native';

export const Loader = () => {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="#FF6C00" />
    </View>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
});
