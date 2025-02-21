type SignUpType = {
  roomId: number;
  roomCode: string;
  roomPassword: string;
  message: string;
};

type LogInType = {
  roomId: number;
  roomCode: string;
  roomPassword: string;
  message: string;
};

export const createRoom = async (password: string) => {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/room/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: password }),
    }
  );

  const data: SignUpType = await response.json();
  return data;
};

export const getRoom = async (code: string, password: string) => {
  const response =
    (await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/room/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: code, password: password }),
    })) || null;

  const data: LogInType = await response.json();
  return data;
};
