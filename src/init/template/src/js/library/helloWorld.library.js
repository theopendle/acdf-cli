(() => {

    /**
     * Prints and returns a greeting from the person with the provided name.
     * 
     * Usage:
     * ```js
     * const message = helloWorld("ACDF"); // Logs "Hello world from ACDF"
     * logInfo(message); // Logs the same again
     * ```
     * 
     * @param {string} name your name
     * @returns a greeting 
     */
    function helloWorld(name) {
        const message = `Hello world from ${name}`;
        logInfo(message)
        return message;
    }

    /* Assign the function to the {{ upperCase namespace }} namespace */
    {{ upperCase namespace }}.helloWorld = helloWorld;
})();