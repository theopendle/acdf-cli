
// const init = require("./init");
// const fs = require('fs');
// const mock = require('mock-fs');

// const { target } = require("../paths");

// const TARGET_DIR = "/tmp/target";
// const SIMPLE_SAMPLE_CONTENT = "sample";

// function runTest(argv, templateMockFs, filepath) {
//     mock({
//         "src": {
//             "init": {
//                 "template": templateMockFs
//             }
//         }
//     });
//     jest.spyOn(process, 'cwd').mockReturnValue(TARGET_DIR);

//     init.processTemplateFiles(argv);

//     expect(fs.existsSync(target(filepath))).toBe(true)
//     return {
//         path: filepath,
//         content: fs.readFileSync(target(filepath)).toString()
//     }
// }

// describe('Initialization', () => {
//     beforeAll(() => {
//         mock({});
//     });

//     it("it should copy a template file into the target directory", async () => {
//         const filename = "sample.txt";
//         const content = runTest({}, { [filename]: SIMPLE_SAMPLE_CONTENT }, filename).content
//         expect(content).toStrictEqual(SIMPLE_SAMPLE_CONTENT);
//     })

//     it("it should rename a template file if required", async () => {
//         runTest({ namespace: "acdf" }, { "{{namespace}}.txt": "" }, "acdf.txt").content
//     })

//     afterAll(() => {
//         mock.restore();
//     });
// });