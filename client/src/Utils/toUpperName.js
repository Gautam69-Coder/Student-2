/**
 * Capitalizes the first letter of a string.
 * @param {string} name
 * @returns {string}
 */
export const toUpperName = (name) => {
    if (typeof name !== 'string') return name;
    return name.charAt(0).toUpperCase() + name.slice(1);
};
