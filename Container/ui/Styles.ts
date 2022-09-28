import { Style } from "@mendix/pluggable-widgets-tools/dist/native/common";
import { FlexStyle, Platform, TextStyle, ViewStyle } from "react-native";

const blue = "rgb(0, 122, 255)";

export interface ContainerStyle extends Style {
    container: FlexStyle;
    button: ViewStyle;
    buttonText: TextStyle;
    debugText: TextStyle;
}

export const defaultViewStyle: ContainerStyle = {
    container: { flex: 1 },
    button: {
        borderRadius: 0,
        backgroundColor: Platform.select({ ios: blue, default: "#CCC" })
    },
    buttonText: {
        color: "white",
        textAlign: "center",
        margin: 10,
        fontSize: 15
    },
    debugText: {
        fontSize: 12,
        color: "yellow",
        position: "absolute",
        margin: 10
    }
};
