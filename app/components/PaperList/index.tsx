import React, { useEffect, useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { HubConnection } from "@microsoft/signalr";
import { PlusIcon, TrashIcon } from "@/assets/icons/icons";
import { deleteList, updateList } from "../../api/listApi/route";
import {
  addItemData,
  createItem,
  deleteItem,
  updateItem,
} from "../../api/itemApi/route";

interface PaperListProps {
  id: number;
  roomId: number;
  name: string;
  color: string;
  category: string;
  order: number;
  items: Item[];
  connection: HubConnection | null;
  isConnected: boolean;
}

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

const PaperList: React.FC<PaperListProps> = ({
  id,
  roomId,
  name,
  color,
  category,
  order,
  items,
  connection,
  isConnected,
}) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [listName, setListName] = useState<string>(name);
  const [listColor, setListColor] = useState<string>(color);
  const [listCategory, setListCategory] = useState<string>(category);
  const [listOrder, setListOrder] = useState<number>(order);

  const [itemList, setItemList] = useState<Item[]>(items);

  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleItemChange = (itemId: number, field: keyof Item, value: any) => {
    setItemList((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              [field]: value,
              result:
                field === "price" || field === "quantity"
                  ? (field === "price" ? value : item.price || 0) *
                    (field === "quantity" ? value : item.quantity || 0)
                  : item.result,
            }
          : item
      )
    );

    // Clear the previous timeout if user types again
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set a new timeout to trigger update after 3 seconds
    setTypingTimeout(
      setTimeout(() => {
        const updatedItem = itemList.find((item) => item.id === itemId);
        if (updatedItem) {
          updateItem(
            {
              ...updatedItem,
              [field]: value,
              result:
                field === "price" || field === "quantity"
                  ? (field === "price" ? value : updatedItem.price || 0) *
                    (field === "quantity" ? value : updatedItem.quantity || 0)
                  : updatedItem.result,
            },
            roomId
          );
        }
      }, 500)
    );
  };

  const handleItemCreated = (newItem: Item) => {
    console.log("Item Created!!!!: ", newItem);
    setItemList((prev) => [...prev, newItem]);
  };

  const handleItemDeleted = (deletedItem: Item | number) => {
    console.log("Item Deleted!!!!: ", deletedItem);
    if (typeof deletedItem != "number") {
      setItemList((prev) =>
        prev.some((item) => item.id === deletedItem.id)
          ? prev
              .map((item) => (item.id === deletedItem.id ? deletedItem : item))
              .filter(
                (item) =>
                  item.store !== undefined ||
                  item.price !== undefined ||
                  item.brand !== undefined ||
                  item.quantity !== undefined
              )
          : prev
      );
    } else {
      setItemList((prev) => prev.filter((item) => item.id !== deletedItem));
    }
  };

  const handleItemUpdated = (updatedItem: Item) => {
    setItemList((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  useEffect(() => {
    if (!connection || !isConnected) return;

    connection.on(`editedList-${id}`, (list) => {
      console.log("List Updated: ", list);
      setListName(list.name);
      setListCategory(list.category);
    });

    connection.on(`createdItem-${id}`, handleItemCreated);
    connection.on(`deletedItem-${id}`, handleItemDeleted);
    connection.on(`updatedItem-${id}`, handleItemUpdated);

    return () => {
      connection.off(`editedList-${id}`);
      connection.off(`deletedItem-${id}`);
      connection.off(`updatedItem-${id}`);
    };
  }, [connection, id]);

  const handleSelect = (id: number) => {
    setSelectedId(id);
  };

  const handleDeselect = () => {};

  return (
    <View className="w-[330px] mt-[40px] rounded-lg min-h-[50px] shadow-lg">
      {/*DELETE BUTTON*/}
      <TouchableOpacity
        className="absolute flex w-6 h-6 items-center justify-center top-2 left-2 z-30"
        onPress={() => deleteList(id, roomId)}
      >
        <Text
          style={{ fontFamily: "IndieFlower" }}
          className="text-xl text-red-700"
        >
          x
        </Text>
      </TouchableOpacity>

      {/*ADD BUTTON*/}
      <TouchableOpacity
        className="absolute flex w-6 h-6 items-center justify-center top-2 right-2 z-30"
        onPress={() => createItem(id, roomId)}
      >
        <Text
          style={{ fontFamily: "IndieFlower" }}
          className="text-xl text-green-700"
        >
          +
        </Text>
      </TouchableOpacity>

      {/*COLOR OVERLAY*/}
      <View
        className="absolute w-full h-full"
        style={{ backgroundColor: listColor }}
      />

      {/*LIST NAME*/}
      <TextInput
        style={{ fontFamily: "IndieFlower", textAlign: "center" }}
        className="text-lg text-gray-700 focus:text-gray-400 border-b border-blue-400 pt-2 pb-2 w-full focus:outline-0 z-10"
        placeholder="Enter List Name"
        maxLength={30}
        value={listName}
        onChangeText={(text) => setListName(text)}
        onBlur={() => updateList(id, roomId, listName, undefined)}
      />

      {/*ITEMS*/}
      {itemList.map(
        ({
          id,
          name,
          shoppingListId,
          store,
          brand,
          price,
          quantity,
          result,
        }) => (
          <View key={id}>
            <View className="border-b border-blue-400 w-full py-0">
              {selectedId === id && (
                <TouchableOpacity
                  className="absolute left-3 w-3 h-full flex items-center justify-center z-30"
                  onPress={() => deleteItem(shoppingListId, id, roomId)}
                >
                  <TrashIcon width={15} height={15} color={"red"} />
                </TouchableOpacity>
              )}
              {selectedId === id &&
                store == null &&
                brand == null &&
                price == null &&
                quantity == null && (
                  <TouchableOpacity
                    className="absolute left-9 w-3 h-full flex items-center justify-center z-30"
                    onPress={() =>
                      addItemData(shoppingListId, id, name, roomId)
                    }
                  >
                    <PlusIcon width={15} height={15} color={"green"} />
                  </TouchableOpacity>
                )}
              <TextInput
                style={{ fontFamily: "IndieFlower" }}
                className="text-md text-gray-700 pl-14 py-1 focus:outline-0"
                placeholderTextColor="#aaa"
                maxLength={25}
                value={itemList.find((item) => item.id === id)?.name || " "}
                onFocus={() => handleSelect(id)}
                onBlur={handleDeselect}
                onChangeText={(text) => handleItemChange(id, "name", text)}
              />
            </View>

            <View className="border-b border-blue-400 pl-1 flex flex-row items-center">
              {brand !== null && (
                <>
                  <Text
                    style={{ fontFamily: "IndieFlower" }}
                    className="text-[10px] text-gray-500 focus:outline-0 pr-1 py-0 my-0"
                  >
                    By:
                  </Text>
                  <TextInput
                    style={{ fontFamily: "IndieFlower" }}
                    className="text-[11px] text-gray-500 focus:outline-0 w-[70px] pr-2 underline py-0 my-0"
                    placeholder=" "
                    maxLength={10}
                    value={itemList.find((item) => item.id === id)?.brand || ""}
                    onChangeText={(text) => handleItemChange(id, "brand", text)}
                  />
                </>
              )}
              {store !== null && (
                <>
                  <Text
                    style={{ fontFamily: "IndieFlower" }}
                    className="text-[10px] text-gray-500 focus:outline-0 pr-1 py-0 my-0"
                  >
                    @
                  </Text>
                  <TextInput
                    style={{ fontFamily: "IndieFlower" }}
                    className="text-[11px] text-gray-500 focus:outline-0 w-[70px] pr-3 underline py-0 my-0"
                    placeholder=" "
                    maxLength={10}
                    value={itemList.find((item) => item.id === id)?.store || ""}
                    onChangeText={(text) => handleItemChange(id, "store", text)}
                  />
                </>
              )}
              {price != null && quantity != null && (
                <>
                  <Text
                    style={{ fontFamily: "IndieFlower" }}
                    className="text-[10px] text-gray-500 focus:outline-0 py-0 my-0"
                  >
                    For:
                  </Text>
                  <TextInput
                    style={{ fontFamily: "IndieFlower" }}
                    className="text-[11px] text-gray-500 focus:outline-0 w-[23px] text-right py-0 my-0"
                    placeholder="0"
                    keyboardType="decimal-pad"
                    maxLength={5}
                    value={
                      itemList
                        .find((item) => item.id === id)
                        ?.price?.toString() || ""
                    }
                    onChangeText={(text) => {
                      const regex = /^[0-9]*(\.[0-9]{0,2})?$/;

                      if (regex.test(text)) {
                        handleItemChange(id, "price", text || 0);
                      }
                    }}
                  />
                </>
              )}
              {price != null && quantity != null && (
                <>
                  <Text
                    style={{ fontFamily: "IndieFlower" }}
                    className="text-xs text-gray-500 focus:outline-0 py-0 my-0"
                  >
                    x
                  </Text>
                  <TextInput
                    style={{ fontFamily: "IndieFlower" }}
                    className="text-[11px] text-gray-500 focus:outline-0 w-[20px] py-0 my-0"
                    placeholder="Quantity"
                    keyboardType="numeric"
                    maxLength={2}
                    value={
                      itemList
                        .find((item) => item.id === id)
                        ?.quantity?.toString() || ""
                    }
                    onChangeText={(text) => {
                      const validText = text.replace(/[^0-9]/g, "");
                      handleItemChange(
                        id,
                        "quantity",
                        validText ? parseInt(validText) : 0
                      );
                    }}
                  />
                </>
              )}
              {price != null &&
                quantity != null &&
                itemList.find((item) => item.id === id)?.result !==
                  undefined && (
                  <Text
                    style={{ fontFamily: "IndieFlower" }}
                    className="text-md text-gray-500 underline py-0 my-0"
                  >
                    ={" "}
                    {(
                      itemList.find((item) => item.id === id)?.result ?? 0
                    ).toFixed(2)}
                  </Text>
                )}
            </View>
          </View>
        )
      )}

      {/*CATEGORY*/}
      <View className="flex justify-center items-end py-0 my-0">
        <TextInput
          style={{
            fontFamily: "IndieFlower",
            textAlign: "center",
            transform: [{ rotate: "-15deg" }, { translateY: -10 }],
          }}
          className="text-xs text-gray-700 focus:outline-0 w-[60px] focus:text-gray-400 py-0 my-0"
          placeholder="Category"
          maxLength={10}
          value={listCategory}
          onChangeText={(text) => setListCategory(text)}
          onBlur={() => updateList(id, roomId, undefined, listCategory)}
        />
      </View>
    </View>
  );
};

export default PaperList;
