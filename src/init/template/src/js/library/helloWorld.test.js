require("@acdf/test").unit.library(global, "helloWorld.library.js");

describe("Describe this library test suite", () => {
    
    test("it should be defined", () => {
        expect({{ upperCase namespace }}.helloWorld).toBeDefined();
    });

    test("it should return a greeting", () => {
        // Create mock
        global.logInfo = jest.fn();
        
        const expected = "Hello world from ACDF";
        const actual = {{ upperCase namespace }}.helloWorld("ACDF");
        
        // Assert expectations
        expect(actual).toBe(expected);
        expect(global.logInfo).toBeCalledWith(expected);
    });
});