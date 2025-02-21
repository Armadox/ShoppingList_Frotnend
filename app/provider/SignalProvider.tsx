import React, { createContext, useContext, useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

type SignalRProviderType = {
  connection: signalR.HubConnection | null;
  isConnected: boolean;
};

const SignalRContext = createContext<SignalRProviderType>({
  connection: null,
  isConnected: false,
});

export const SignalRProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.EXPO_PUBLIC_BACKEND_URL}/listHub`, {
        skipNegotiation: true,
        transport: 1,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("SignalR Connected!");
        setIsConnected(true);
        setConnection(newConnection);
      })
      .catch((err) => {
        setIsConnected(false);
        console.error("Connection failed: ", err);
      });

    newConnection.onclose(() => {
      console.log("❌ Disconnected!");
      setIsConnected(false);
    });

    newConnection.onreconnecting(() => {
      console.log("🔄 Reconnecting...");
      setIsConnected(false);
    });

    newConnection.onreconnected(() => {
      console.log("✅ Reconnected!");
      setIsConnected(true);
    });

    return () => {
      newConnection.stop().then(() => setIsConnected(false));
    };
  }, []);

  return (
    <SignalRContext.Provider value={{ connection, isConnected }}>
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = () => useContext(SignalRContext);
