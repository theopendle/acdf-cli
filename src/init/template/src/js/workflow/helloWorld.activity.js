((instanceVars) => {

    // Load a library like so:
    loadLibrary("{{ namespace }}:helloWorld.library.js");

    // Store a message in the workflow instance variables 
    instanceVars.message = {{ upperCase namespace }}.helloWorld("ACDF");
    
})(instance.vars);