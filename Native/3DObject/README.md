**3D Object (AR)**

Standard component to show a 3D object, based on the URL the user enters.

| 3D Object (AR)                                              |
| ----------------------------------------------------------- |
| URL: expression(string)                                     |
| Position type: enumeration (Static, Attribute, Expression)  |
| PositionX: Decimal, expression(Decimal), attribute(Decimal) |
| PositionY: Decimal, expression(Decimal), attribute(Decimal) |
| PositionZ: Decimal, expression(Decimal), attribute(Decimal) |
| Rotation type: enumeration (Static, Attribute, Expression)  |
| RotationX: Decimal, expression(Decimal), attribute(Decimal) |
| RotationY: Decimal, expression(Decimal), attribute(Decimal) |
| RotationZ: Decimal, expression(Decimal), attribute(Decimal) |
| Scale type: enumeration (Static, Attribute, Expression)     |
| ScaleX: Decimal, expression(Decimal), attribute(Decimal)    |
| ScaleY: Decimal, expression(Decimal), attribute(Decimal)    |
| ScaleZ: Decimal, expression(Decimal), attribute(Decimal)    |
| materialOption: enumeration (Object, Texture, Color)        |
| Texture: Image                                              |
| Color: String                                               |
| LightingType: enumeration (Simple, Realistic)               |
| Roughness: expression(Decimal)                              |
| Metalness: expression(Decimal)                              |
| Opacity: expression(Decimal)                                |
| Dragging: boolean                                           |
| Enable Dragging: expression(boolean)                        |
| DragType: enumeration(FixedDistance, FixedToWorld)          |
| onDrag(): action                                            |
| Pinching: boolean                                           |
| Enable Pinching: expression(boolean)                        |
| EnablePinchToScale: boolean                                 |
| OnPinch(): action                                           |
| OnClick(): action                                           |
| OnHoverEnter(): action                                      |
| OnHoverExit(): action                                       |
