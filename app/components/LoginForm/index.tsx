import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getRoom } from "../../api/roomApi/route";

interface LoginFormProps {}

type LogInType = {
  roomId: number;
  roomCode: string;
  roomPassword: string;
  message: string;
};

const LoginForm: React.FC<LoginFormProps> = ({}) => {
  const [password, setPassword] = useState<string>();
  const [code, setCode] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogIn = async () => {
    if (!password || !code) return alert("Please enter code and password!");
    setLoading(true);
    try {
      const data: LogInType = await getRoom(password, code);
      if (data) {
        await AsyncStorage.setItem(`data`, JSON.stringify(data));
        setLoading(false);
        router.push(`/room/${data.roomId}`);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert("Error sending data for Login!");
    }
  };

  if (loading) {
    return (
      <View className="h-full w-full flex items-center justify-center gap-5">
        <View className="p-5">
          <Text className="text-slate-800 text-xl">Joining Room</Text>
        </View>
        <ActivityIndicator size="large" color="#374151" />
      </View>
    );
  }

  return (
    <View className="h-[250px] w-[300px] rounded flex flex-col justify-evenly items-center">
      <TextInput
        className="border-y-[1px] w-[250px] border-slate-400 p-3 text-center text-slate-400 text-xl focus:outline-0"
        placeholder="Code"
        editable={!loading}
        value={code}
        onChangeText={(e) => setCode(e)}
      />
      <TextInput
        className="border-y-[1px] w-[250px] border-slate-400 p-3 text-center text-slate-400 text-xl focus:outline-0"
        placeholder="Password"
        secureTextEntry={true}
        editable={!loading}
        value={password}
        onChangeText={(e) => setPassword(e)}
      />
      <TouchableOpacity
        className="text-slate-800 border-[1px] border-slate-400 rounded py-1 px-2"
        onPress={handleLogIn}
        disabled={loading}
      >
        <Text className="text-slate-800">Send</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("/signUp")}
        disabled={loading}
      >
        <Text className="text-slate-800 underline">Create a room</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;
