module.exports = {

    /*
     * Place all shared properties here. These properties can then be used in configuration files or 
     * package XML files and will be injected during the build.
     */
    properties: {
        proxyAddress: "dev.campaign.application",
        proxyUser: "dev-proxy",
        proxyPassword: "dev-proxy-password",
        proxyPort: "8080",
    },
    installations: [
        {
            name: "application",

            /* Place properties specific to the 'application' installation here */
            properties: {}
        },
        {
            name: "web",

            /* Place properties specific to the 'web' installation here */
            properties: {}
        }
    ]
};
