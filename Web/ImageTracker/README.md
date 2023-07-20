**ImageTracker (AR)**

When enabled the ImageTracker (AR) widget continuously scans for QR codes. When it finds one it sets the data in the QR
code and position in an attribute and calls the 'OnDataChanged' action.

| ImageTracker (AR)                |
| -------------------------------- |
| ScannedResult: Attribute(String) |
| X: Attribute(Decimal)            |
| Y: Attribute(Decimal)            |
| Z: Attribute(Decimal)            |
| OnDataChanged(): action          |
