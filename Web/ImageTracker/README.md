**ImageTracker (AR)**

Standard container component to wrap around other widgets and group them together, so they can move/rotate/scale as a
group.

| ImageTracker (AR)                                                          |
| -------------------------------------------------------------------------- |
| Billboard rotation: enumeration(None, Billboard, Billboard X, Billboard Y) |
| Position type: enumeration (Static, Attribute, Expression)                 |
| PositionX: Decimal, expression(Decimal), attribute(Decimal)                |
| PositionY: Decimal, expression(Decimal) , attribute(Decimal)               |
| PositionZ: Decimal, expression(Decimal), attribute(Decimal)                |
| Rotation type: enumeration (Attribute, Expression)                         |
| RotationX: Decimal, expression(Decimal), attribute(Decimal)                |
| RotationY: Decimal, expression(Decimal), attribute(Decimal)                |
| RotationZ: Decimal, expression(Decimal), attribute(Decimal)                |
| Scale type: enumeration (Attribute, Expression)                            |
| ScaleX: Decimal, expression(Decimal), attribute(Decimal)                   |
| ScaleY: Decimal, expression(Decimal), attribute(Decimal)                   |
| ScaleZ: Decimal, expression(Decimal), attribute(Decimal)                   |
| Dragging: boolean                                                          |
| Enable Dragging: expression(boolean)                                       |
| Type: enumeration(FixedDistance, FixedToWorld)                             |
| On drag: action                                                            |
| Pinching: boolean                                                          |
| Enable Pinching: expression(boolean)                                       |
| EnablePinchToScale: boolean                                                |
| OnPinch(): action                                                          |
| OnClick(): action                                                          |
| OnHoverEnter(): action                                                     |
| OnHoverExit(): action                                                      |
