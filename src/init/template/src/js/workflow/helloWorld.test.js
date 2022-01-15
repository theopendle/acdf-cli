require("@acdf/test").unit.activity(global);

const SCRIPT_PATH = "./helloWorld.activity.js";

describe("Describe this activity test suite", () => {
    beforeEach(() => {
        jest.resetModules();
    });

    test("it should store a greeting message in the workflow instance variables", () => {
        // Mock the workflow instance.vars object found in Campaign workflow activities
        global.instance = { vars: {} };

        // Execute your activity like so:
        require(SCRIPT_PATH);

        // Assert the message is found in the instance vars
        expect(instance.vars.message).toBeDefined()
    });
});
