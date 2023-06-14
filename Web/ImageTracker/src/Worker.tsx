import {
    RGBLuminanceSource,
    QRCodeReader,
    HybridBinarizer,
    BinaryBitmap,
    BarcodeFormat,
    DecodeHintType,
    MultiFormatReader
} from "@zxing/library";
import { ImageDataLuminanceSource } from "./ImageDataLuminanceSource";

self.onmessage = function (e) {
    console.log("Got message " + e.data);
    const rawImage: ImageData = e.data[2];
    const codeReader = new MultiFormatReader();

    const hints = new Map();
    const formats = [BarcodeFormat.QR_CODE, BarcodeFormat.DATA_MATRIX, BarcodeFormat.PDF_417, BarcodeFormat.AZTEC];

    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

    const reader = new MultiFormatReader();

    reader.setHints(hints);

    const luminanceSource = new ImageDataLuminanceSource(rawImage);

    const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));

    try {
        const hints = new Map();
        hints.set(DecodeHintType.POSSIBLE_FORMATS, BarcodeFormat.QR_CODE);
        hints.set(DecodeHintType.TRY_HARDER, true);

        const result = codeReader.decode(binaryBitmap, hints);
        console.log("qr code result: " + result.getText());
        postMessage(result.getText());
    } catch (NotFoundException) {
        postMessage("No QR Code found");
    }
};
