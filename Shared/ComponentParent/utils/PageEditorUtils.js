export function hidePropertyIn(propertyGroups, _value, key, nestedPropIndex, nestedPropKey) {
    modifyProperty((_, index, container) => container.splice(index, 1), propertyGroups, key, nestedPropIndex, nestedPropKey);
}
export function hidePropertiesIn(propertyGroups, _value, keys) {
    keys.forEach(key => modifyProperty((_, index, container) => container.splice(index, 1), propertyGroups, key, undefined, undefined));
}
export function changePropertyIn(propertyGroups, _value, modify, key, nestedPropIndex, nestedPropKey) {
    modifyProperty(modify, propertyGroups, key, nestedPropIndex, nestedPropKey);
}
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function modifyProperty(modify, propertyGroups, key, nestedPropIndex, nestedPropKey) {
    propertyGroups.forEach(propGroup => {
        var _a;
        if (propGroup.propertyGroups) {
            modifyProperty(modify, propGroup.propertyGroups, key, nestedPropIndex, nestedPropKey);
        }
        (_a = propGroup.properties) === null || _a === void 0 ? void 0 : _a.forEach((prop, index, array) => {
            if (prop.key === key) {
                if (nestedPropIndex === undefined || nestedPropKey === undefined) {
                    modify(prop, index, array);
                }
                else {
                    if (!prop.properties) {
                        throw new Error("Wrong parameters");
                    }
                    modifyProperty(modify, prop.properties[nestedPropIndex], nestedPropKey);
                }
            }
        });
    });
}
//# sourceMappingURL=PageEditorUtils.js.map