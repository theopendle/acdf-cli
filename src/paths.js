const path = require('path');

module.exports = {

    /**
     * Resolves the given path relative to the folder in which the cli is being used.
     * 
     * @param  {...any} paths one or more path segments
     * @returns a resolved path
     */
    target: (...paths) => {
        return path.resolve(process.cwd(), ...paths)
    },

    /**
     * Resolves the given path relative to this project's root directory.
     * 
     * @param  {...any} paths one or more path segments
     * @returns a resolved path
     */
    project: (...paths) => {
        return path.resolve(__dirname, "..", ...paths)
    },

    /**
     * Resolves the given path relative to a template directory in this project.
     * 
     * @param  {...any} paths one or more path segments
     * @returns a resolved path
     */
    template: (root, ...paths) => {
        return path.resolve(__dirname, root, "template", ...paths)
    }
}