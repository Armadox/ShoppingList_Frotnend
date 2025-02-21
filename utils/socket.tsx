import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const Connection = new HubConnectionBuilder()
  .withUrl(`${process.env.EXPO_PUBLIC_BACKEND_URL}/listHub`, {
    skipNegotiation: true,
    transport: 1, // WebSockets only
  })
  .configureLogging(LogLevel.Debug)
  .withAutomaticReconnect()
  .build();

export default Connection;
