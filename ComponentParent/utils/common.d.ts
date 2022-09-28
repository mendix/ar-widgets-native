import { ImageStyle, TextStyle, ViewStyle } from "react-native";
interface CustomStyle {
    [key: string]: string | number;
}
export interface Style {
    [key: string]: CustomStyle | ViewStyle | TextStyle | ImageStyle;
}
export declare function flattenStyles<T extends Style>(defaultStyle: T, overrideStyles: Array<T | undefined>): T;
export {};
