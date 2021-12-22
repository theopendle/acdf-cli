const path = require('path');

module.exports = {
    target: (...paths) => {
        return path.resolve(process.cwd(), ...paths)
    },

    project: (...paths) => {
        return path.resolve(__dirname, "..", ...paths)
    },

    template: (root, ...paths) => {
        return path.resolve(__dirname, root, "template", ...paths)
    }
}