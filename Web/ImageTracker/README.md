**ImageTracker (AR)**

When enabled the ImageTracker (AR) widget continuously scans for QR codes. When it finds one it sets the data in the QR
code and position in an attribute and calls the 'OnDataChanged' action.

| ImageTracker (AR)                  |
| ---------------------------------- |
| mxScannedResult: Attribute(String) |
| mxPositionX: Attribute(Decimal)    |
| mxPositionY: Attribute(Decimal)    |
| mxPositionZ: Attribute(Decimal)    |
| OnDataChanged(): action            |
