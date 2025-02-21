import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

type IconType = {
  width: number;
  height: number;
  color: string;
};

export const TrashIcon = ({ width, height, color }: IconType) => {
  return (
    <Svg width={width} height={height} fill={color} viewBox="0 0 448 512">
      <Path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
    </Svg>
  );
};

export const ArrowLeftIcon = ({ width, height, color }: IconType) => {
  return (
    <Svg width={width} height={height} fill={color} viewBox="0 0 448 512">
      <Path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
    </Svg>
  );
};

export const PlusIcon = ({ width, height, color }: IconType) => {
  return (
    <Svg width={width} height={height} fill={color} viewBox="0 0 448 512">
      <Path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
    </Svg>
  );
};

export const CheckIcon = ({ width, height, color }: IconType) => {
  return (
    <Svg width={width} height={height} fill={color} viewBox="0 0 448 512">
      <Path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
    </Svg>
  );
};
