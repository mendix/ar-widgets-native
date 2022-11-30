**Sphere (AR)**

Standard component to show a 3D sphere.

| Sphere (AR)                                                  |
| ------------------------------------------------------------ |
| Position type: enumeration (Static, Attribute, Expression)   |
| PositionX: Decimal, expression(Decimal), attribute(Decimal)  |
| PositionY: Decimal, expression(Decimal) , attribute(Decimal) |
| PositionZ: Decimal, expression(Decimal), attribute(Decimal)  |
| Rotation type: enumeration (Attribute, Expression)           |
| RotationX: Decimal, expression(Decimal), attribute(Decimal)  |
| RotationY: Decimal, expression(Decimal), attribute(Decimal)  |
| RotationZ: Decimal, expression(Decimal), attribute(Decimal)  |
| Scale type: enumeration (Attribute, Expression)              |
| ScaleX: Decimal, expression(Decimal), attribute(Decimal)     |
| ScaleY: Decimal, expression(Decimal), attribute(Decimal)     |
| ScaleZ: Decimal, expression(Decimal), attribute(Decimal)     |
| materialOption: enumeration (Texture, Color)                 |
| Texture: Image                                               |
| Color: String                                                |
| LightingType: enumeration (Simple, Realistic)                |
| Roughness: expression(Decimal)                               |
| Metalness: expression(Decimal)                               |
| Opacity: expression(Decimal)                                 |
| Dragging: boolean                                            |
| EnableDragging: expression(boolean)                          |
| DragType: enumeration(FixedDistance, FixedToWorld)           |
| onDrag(): action                                             |
| Pinching: boolean                                            |
| EnablePinching: expression(boolean)                          |
| EnablePinchToScale: boolean                                  |
| OnPinch(): action                                            |
| OnClick(): action                                            |
| OnHoverEnter(): action                                       |
| OnHoverExit(): action                                        |
