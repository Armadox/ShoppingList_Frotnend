type Item = {
  id: number;
  shoppingListId: number;
  name: string;
  store?: string;
  brand?: string;
  price?: number;
  quantity?: number;
  result?: number;
};

export const createItem = async (listId: number, roomId: number) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/room/${roomId}/list/item/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "TEXT",
          shoppingListId: listId,
        }),
      }
    );
    console.log(`Item ${response} created successfully`);
  } catch (error) {
    console.error(`Error creating item`, error);
  }
};

export const addItemData = async (
  listId: number,
  itemId: number,
  name: string,
  roomId: number
) => {
  try {
    await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/room/${roomId}/list/item/update`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shoppingListId: listId,
          id: itemId,
          name: name,
          brand: "Brand",
          store: "Store",
          price: 1,
          quantity: 1,
        }),
      }
    );
    console.log(`Item updated successfully`);
  } catch (error) {
    console.error(`Error updating item :`, error);
  }
};

export const updateItem = async (updatedItem: Item, roomId: number) => {
  try {
    await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/room/${roomId}/list/item/update`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      }
    );
    console.log(`Item ${updatedItem.id} updated successfully`);
  } catch (error) {
    console.error(`Error updating item ${updatedItem.id}:`, error);
  }
};

export const deleteItem = async (
  listId: number,
  itemId: number,
  roomId: number
) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/room/${roomId}/list/item/delete`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shoppingListId: listId,
          id: itemId,
          name: "",
        }),
      }
    );
    console.log(`Item ${response} deleted successfully`);
  } catch (error) {
    console.error(`Error deleting item`, error);
  }
};
