const prodShared = require("../prod.env");

module.exports = {
    ...prodShared,
    internalPasswordEncrypted: "",
};
