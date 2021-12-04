#!/usr/bin/env node

const init = require("../src/init")

init.updatePackageJson();
init.processTemplateFiles();