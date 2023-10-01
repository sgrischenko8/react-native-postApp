import { Post } from '../components/Post';

export const renderItem = ({ item }) => {
  const {
    title,
    photoSource,
    comments,
    likes,
    isLikesDisabled,
    location,
    owner,
    geolocation,
  } = item;
  return (
    <Post
      id={`${owner.email}-${item.date}`}
      title={title}
      source={photoSource}
      comments={comments || []}
      likes={likes || []}
      isLikesDisabled={isLikesDisabled}
      location={location}
      country={geolocation?.country || ''}
      region={geolocation?.region || ''}
      longitude={geolocation?.longitude || null}
      latitude={geolocation?.latitude || null}
      owner={owner}
      // onPress={() => console.log(data.id)}
    />
  );
};
