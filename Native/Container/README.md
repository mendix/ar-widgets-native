**Container (AR)**

Starts AR experience, has static light to illuminate the scene. If UsePBR is selected an hdr image is used to calculate
lighting. For this to work, Realistic lighting should be enabled on both this widget and the target 3D object widget. A
Container (AR) widget cannot be alone in the scene, and should always have something embedded in it.

A preview can optionally be enabled, showing the embedded 3D model without AR preparing the enduser for what they're
looking for in the AR scene. If this is enabled the enduser has to press a button to start the AR scene.

Options on widget:

| Container (AR)                           |
| ---------------------------------------- |
| Show preview: boolean                    |
| Camera distance: decimal                 |
| Add realistic lighting: boolean          |
| Environment map path: expression(String) |
