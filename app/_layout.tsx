import { useFonts } from "expo-font";
import { Stack, useRouter, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import "../global.css";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { SignalRProvider } from "./provider/SignalProvider";
import { getRoom } from "../app/api/roomApi/route";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

type StoredDataType = {
  message: string;
  roomId: number;
  roomCode: string;
  roomPassword: string;
};

export default function RootLayout() {
  const router = useRouter();
  const pathName = usePathname();
  const [storedData, setStoredData] = useState<StoredDataType | null>(null);
  const [loadedData, setLoadedData] = useState<boolean>(false);
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    IndieFlower: require("../assets/fonts/IndieFlower-Regular.ttf"),
  });

  const fetchData = async () => {
    try {
      const data = await AsyncStorage.getItem("data");
      if (data) {
        setStoredData(JSON.parse(data));
        console.log("Retrieved data:", JSON.parse(data));
      }
    } catch {
      console.log("no previous data found");
    }
  };

  const autoLogIn = async (roomCode: string, roomPassword: string) => {
    try {
      const data = await getRoom(roomCode, roomPassword);
      if (data.roomId != undefined) {
        if (pathName === `/room/${data.roomId}`) {
          console.log("redirecting2");
          return;
        }
        console.log("redirecting3");
        router.push(`/room/${data.roomId}`);
      } else {
        console.log("redirecting1");
        router.push(`/signUp`);
      }
    } catch {
      await AsyncStorage.clear();
      console.log("Couldn't Log In");
    }
  };

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    setLoadedData(false);
    fetchData();
    setLoadedData(true);
  }, []);

  useEffect(() => {
    if (loaded && storedData) {
      autoLogIn(storedData.roomCode, storedData.roomPassword);
    } else if (loaded && loadedData && !storedData) {
      console.log("redirecting2", storedData);
      router.push("/logIn");
    }
  }, [loaded, loadedData, storedData]);

  if (!loaded) {
    return (
      <View className="h-full w-full flex items-center justify-center">
        <ActivityIndicator size="large" color="#374151" />
      </View>
    );
  }

  return (
    <SignalRProvider>
      <SafeAreaView
        style={{ flex: 1 }}
        className="bg-slate-100 h-full w-full"
        edges={["top"]}
      >
        <StatusBar hidden={true} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </SafeAreaView>
    </SignalRProvider>
  );
}
