import { QRCodeReader, HybridBinarizer, BinaryBitmap, BarcodeFormat, DecodeHintType } from "@zxing/library";
import { ImageDataLuminanceSource } from "./ImageDataLuminanceSource";

self.onmessage = function (e) {
    const rawImage: ImageData = e.data[2];
    const codeReader = new QRCodeReader();

    const luminanceSource = new ImageDataLuminanceSource(rawImage);

    const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));

    try {
        const hints = new Map();
        hints.set(DecodeHintType.POSSIBLE_FORMATS, BarcodeFormat.QR_CODE);
        hints.set(DecodeHintType.TRY_HARDER, true);

        const result = codeReader.decode(binaryBitmap, hints);
        postMessage([result.getText(), result.getResultPoints()]);
    } catch (NotFoundException) {
        postMessage(null);
    }
};
