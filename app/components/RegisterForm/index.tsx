import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createRoom } from "../../api/roomApi/route";

interface RegisterFormProps {}

type SignUpType = {
  roomId: number;
  roomCode: string;
  roomPassword: string;
  message: string;
};

const RegisterForm: React.FC<RegisterFormProps> = ({}) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleRoomCreate = async () => {
    if (!password) {
      throw new Error("Please enter a password!");
    }
    setLoading(true);

    try {
      const data: SignUpType = await createRoom(password);
      await AsyncStorage.setItem(`data`, JSON.stringify(data));
      setLoading(false);
      router.push(`/room/${data.roomId}`);
    } catch (error) {
      setLoading(false);
      console.error("Error Creating Room!", error);
    }
  };

  if (loading) {
    return (
      <View className="h-full w-full flex items-center justify-center gap-5">
        <View className="p-5">
          <Text className="text-slate-800 text-xl">Creating Room</Text>
        </View>
        <ActivityIndicator size="large" color="#374151" />
      </View>
    );
  }

  return (
    <View className="bg-slate-100 h-[150px] w-[300px] rounded flex flex-col justify-evenly items-center">
      <TextInput
        className="border-y-[1px] w-[250px] border-slate-400 p-3 text-center text-slate-400 text-xl focus:outline-0"
        placeholder="Password"
        editable={!loading}
        secureTextEntry={true}
        value={password}
        onChangeText={(e) => setPassword(e)}
      />
      <TouchableOpacity
        className="text-slate-800 border-[1px] border-slate-400 rounded py-1 px-2"
        disabled={loading}
        onPress={handleRoomCreate}
      >
        <Text className="text-slate-800">Create</Text>
      </TouchableOpacity>
      <TouchableOpacity
        disabled={loading}
        onPress={() => {
          router.push("/logIn");
        }}
      >
        <Text className="text-slate-800 underline">Join a room</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterForm;
