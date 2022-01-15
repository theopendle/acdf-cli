module.exports = {
    installations: [
        {
            name: "application",
            confGlobs: [
                "src/conf/application/**/*",
            ],
            packageGlobs: [
                "src/packages/common/**/*",
                "src/packages/application/**/*",
            ]
        },
        {
            name: "web",
            confGlobs: [
                "src/conf/web/**/*",
            ],
            packageGlobs: [
                "src/packages/common/**/*",
                "src/packages/web/**/*",
            ]
        }
    ]
}