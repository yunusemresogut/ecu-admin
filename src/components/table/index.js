const components = import.meta.glob('./*.vue', { eager: true });

export default Object.keys(components).reduce((acc, path) => {
    const componentName = path.split('/').pop().replace('.vue', '');
    acc[componentName] = components[path].default;
    return acc;
}, {});