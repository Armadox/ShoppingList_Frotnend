import { View, Text } from "react-native";
import LoginForm from "../components/LoginForm";

const LogInScreen = () => {
  return (
    <View className="bg-slate-100 flex justify-center items-center h-screen">
      <Text className="absolute top-[150] text-xl">Join a Room!</Text>
      <LoginForm />
    </View>
  );
};

export default LogInScreen;
