import { View, Text } from "react-native";
import RegisterForm from "../components/RegisterForm";

const SignUpScreen = () => {
  return (
    <View className="bg-slate-100 flex justify-center items-center h-screen">
      <Text className="absolute top-[150] text-xl">Create a Room!</Text>
      <RegisterForm />
    </View>
  );
};

export default SignUpScreen;
