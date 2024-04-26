import {
    BarcodeFormat,
    DecodeHintType,
    BinaryBitmap,
    HybridBinarizer,
    BrowserMultiFormatReader,
    QRCodeReader
} from "@zxing/library";

import { ImageDataLuminanceSource } from "./ImageDataLuminanceSource";

let reader: any;

self.onmessage = function (e) {
    if (reader === undefined) {
        reader = new QRCodeReader();
    }
    const rawImage: ImageData = e.data[2];
    const luminanceSource = new ImageDataLuminanceSource(rawImage);
    const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));
    try {
        const result = (reader as QRCodeReader).decode(binaryBitmap);
        postMessage([result.getText(), result.getResultPoints()]);
    } catch (error) {
        postMessage(error);
    }
};
