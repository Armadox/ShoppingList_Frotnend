export const createList = async (
  listName: string,
  listColor: string,
  listCategory: string,
  roomId: number
) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/room/${roomId}/list/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: listName,
          color: listColor,
          category: listCategory,
        }),
      }
    );
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating List", error);
  }
};

export const fetchLists = async (roomId: string) => {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/room/${roomId}/list`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    return;
  }
  const data = await response.json();
  return data;
};

export const updateList = async (
  listId: number,
  roomId: number,
  newName?: string,
  category?: string
) => {
  try {
    let updatedList;
    if (newName) {
      updatedList = { id: listId, name: newName };
    } else if (category) {
      updatedList = { id: listId, category: category };
    } else {
      return;
    }
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/room/${roomId}/list/update`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedList),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating list`, error);
  }
};

export const deleteList = async (listId: number, roomId: number) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/room/${roomId}/list/delete`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: listId,
        }),
      }
    );
    console.log(`List ${response} deleted successfully`);
  } catch (error) {
    console.error("Error deleting list", error);
  }
};
