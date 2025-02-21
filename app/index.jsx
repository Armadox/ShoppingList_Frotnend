import { View, ActivityIndicator } from "react-native";

const Home = () => {
  return (
    <View className="h-full w-full flex items-center justify-center">
      <ActivityIndicator size="large" color="#374151" />
    </View>
  );
};

export default Home;
