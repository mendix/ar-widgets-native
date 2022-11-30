export function flattenStyles(defaultStyle, overrideStyles) {
    const styles = [defaultStyle, ...overrideStyles.filter((object) => object !== undefined)];
    return Object.keys(defaultStyle).reduce((flattened, currentKey) => {
        const styleItems = styles.map(object => object[currentKey]);
        return Object.assign(Object.assign({}, flattened), { [currentKey]: flattenObjects(styleItems) });
    }, {});
}
function flattenObjects(objects) {
    return objects.reduce((merged, object) => (Object.assign(Object.assign({}, merged), object)), {});
}
//# sourceMappingURL=styles.js.map