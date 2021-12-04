const path = require('path');

module.exports = {
    target: (...paths) => {
        return path.resolve(process.cwd(), ...paths)
    },

    project: (...paths) => {
        return path.resolve(__dirname, "..", ...paths)
    },

    template: (...paths) => {
        return path.resolve(__dirname, "../template", ...paths)
    }
}