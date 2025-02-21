import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import PaperList from "../components/PaperList";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSignalR } from "../provider/SignalProvider";
import { ArrowLeftIcon, CheckIcon, PlusIcon } from "@/assets/icons/icons";
import { createList, fetchLists } from "../api/listApi/route";

type List = {
  id: number;
  roomId: number;
  name: string;
  color: string;
  category: string;
  order: number;
  items: Item[];
};

type NewList = {
  name: string;
  color: string;
  category: string;
};

type Item = {
  id: number;
  shoppingListId: number;
  name: string;
  store?: string;
  brand?: string;
  price?: number;
  quantity?: number;
};

type LogInType = {
  roomId: number;
  roomCode: string;
  roomPassword: string;
  message: string;
};

const RoomScreen = () => {
  const { roomId }: { roomId: string } = useLocalSearchParams();
  const [roomCode, setRoomCode] = useState<string>();
  const [lists, setLists] = useState<List[]>([]);
  const [list, setList] = useState<NewList>({
    name: "Name",
    color: "#f5f5f0",
    category: "Category",
  });
  const [loading, setLoading] = useState(true);
  const [addingList, setAddingList] = useState(false);
  const { connection, isConnected } = useSignalR();
  const router = useRouter();

  useEffect(() => {
    fetchRoomLists();
  }, [roomId]);

  useEffect(() => {
    if (!connection || !isConnected) return;

    try {
      connection.invoke("JoinRoom", roomId.toString());
      console.log(`Joined room ${roomId}`);

      connection.on("NewList", (list) => {
        console.log("New list created: ", list);
        setLists((prevListsos) => [...prevListsos, list]);
      });

      connection.on("DeletedList", (deletedListId) => {
        setLists((prevLists) =>
          prevLists.filter((list) => list.id !== deletedListId)
        );
      });
    } catch (error) {
      console.error("FAILED TO SET UP SOCKETS: ", error);
    }

    return () => {
      connection.off(`JoinRoom`);
      connection.off(`NewList`);
      connection.off(`DeletedList`);
    };
  }, [roomId, isConnected]);

  const fetchRoomLists = async () => {
    const data: LogInType =
      JSON.parse((await AsyncStorage.getItem("data")) || "") || null;
    if (!data) {
      router.push("/logIn");
      return;
    }

    setRoomCode(data.roomCode);
    try {
      const data = await fetchLists(roomId);
      if (data) {
        setLists(data);
      }
    } catch {
      console.log("No lists to fetch!");
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    await AsyncStorage.clear();
    router.push("/logIn");
  };

  const changeColor = (currentColor: string) => {
    const colors = ["#f5f5f0", "#f5f5ce", "#f59898", "#a1f299", "#98c7f5"];
    const index = colors.findIndex((color) => color === currentColor);

    if (index < colors.length - 1) {
      return colors[index + 1];
    } else {
      return colors[0];
    }
  };

  if (loading) {
    return (
      <View className="h-full w-full flex items-center justify-center">
        <ActivityIndicator size="large" color="#374151" />
      </View>
    );
  }

  return (
    <>
      {!isConnected && (
        <View
          style={{ zIndex: 100 }}
          className="absolute h-full w-full flex items-center justify-center gap-5 bg-slate-500 opacity-50"
        >
          <Text>Reconnecting</Text>
          <ActivityIndicator size="large" color="#374151" />
        </View>
      )}
      <ImageBackground
        source={require("../../assets/images/white-wood.jpg")}
        resizeMode="cover"
        className="w-full absolute min-h-screen"
      ></ImageBackground>

      <View className="sticky h-[40px] z-50">
        <View className="w-full flex flex-row items-center justify-between bg-slate-100 z-50">
          <TouchableOpacity
            className="w-[35px] h-[35px] border-slate-400 border-[1px] text-center flex items-center justify-center rounded mx-5 my-1"
            onPress={() => logOut()}
          >
            <ArrowLeftIcon width={20} height={20} color={"#374151"} />
          </TouchableOpacity>

          <Text className="text-lg font-extralight">
            {roomCode &&
              `${roomCode[0]}${roomCode[1]}-${roomCode[2]}${roomCode[3]}${roomCode[4]}${roomCode[5]}${roomCode[6]}${roomCode[7]}`}
          </Text>
          <TouchableOpacity
            className="w-[35px] h-[35px] border-slate-400 border-[1px] text-center flex items-center justify-center rounded mx-5 my-1"
            onPress={() => setAddingList(!addingList)}
          >
            <PlusIcon width={20} height={20} color={"#374151"} />
          </TouchableOpacity>
        </View>

        <View
          className={`bg-slate-100 border-b-[1px] border-slate-400 min-h-[40px] flex flex-row items-center justify-around py-1 z-40 ${
            addingList ? "top-[0px]" : "top-[-39px]"
          }`}
        >
          {addingList && (
            <>
              <TextInput
                className="ml-5 text-base h-[40px] w-[100px] rounded bg-white font-extralight"
                value={list.name}
                maxLength={30}
                onChangeText={(e) => setList((prev) => ({ ...prev, name: e }))}
                placeholder="Name"
              />
              <TextInput
                className="mx-1 text-base bg-white h-[40px] rounded w-[100px] font-extralight"
                value={list.category}
                maxLength={10}
                onChangeText={(e) =>
                  setList((prev) => ({ ...prev, category: e }))
                }
                placeholder="Name"
              />

              {/*<Picker
                className="bg-white"
                style={{ width: 100 }}
                selectedValue={list.color}
                onValueChange={(e) =>
                  setList((prev) => ({ ...prev, color: e }))
                }
              >
                <Picker.Item label="White" value="#f5f5f0" />
                <Picker.Item label="Yellow" value="#f5f5ce" />
                <Picker.Item label="Red" value="#f59898" />
                <Picker.Item label="Green" value="#a1f299" />
                <Picker.Item label="Blue" value="#98c7f5" />
              </Picker>*/}

              <TouchableOpacity
                className="mx-1 text-base h-[40px] w-[100px] border-slate-200 border rounded"
                style={{ backgroundColor: list.color }}
                onPress={() =>
                  setList((prev) => ({
                    ...prev,
                    color: changeColor(list.color),
                  }))
                }
              />

              <TouchableOpacity
                className="w-[30px] h-[40px] text-center flex items-center justify-center rounded mr-5"
                onPress={() =>
                  createList(
                    list.name,
                    list.color,
                    list.category,
                    Number(roomId)
                  )
                }
              >
                <CheckIcon width={20} height={20} color={"green"} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View className="flex flex-col justify-start mb-[40px]">
          {lists.map(({ id, roomId, name, color, category, items }) => (
            <PaperList
              key={id}
              id={id}
              roomId={roomId}
              name={name}
              color={color}
              category={category}
              order={0}
              items={items}
              connection={connection}
              isConnected={isConnected}
            />
          ))}
        </View>
      </ScrollView>
    </>
  );
};

export default RoomScreen;
