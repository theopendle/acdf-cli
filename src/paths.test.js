const path = require("path")
const { target, project, template } = require("./paths");

const TARGET_DIR = "/tmp/target";
const SAMPLE_FILE = "sample.txt"

describe('Paths', () => {

    beforeAll(() => {
        jest.spyOn(process, 'cwd').mockReturnValue(TARGET_DIR);
    });

    it("should return the target directory", () => {
        expect(target()).toBe(TARGET_DIR);
    })

    it("should return a path in the target directory", () => {
        expect(target("sample.txt")).toBe(TARGET_DIR + "/" + SAMPLE_FILE);
    })

    it("should return the project directory", () => {
        expect(project()).toBe(path.resolve(__dirname, ".."));
    })

    it("should return a path in the project directory", () => {
        expect(target("sample.txt")).toBe(path.resolve(__dirname, "../", TARGET_DIR + "/" + SAMPLE_FILE));
    })

    it("should return the template directory", () => {
        expect(template()).toBe(path.resolve(__dirname, "../template"));
    })

    it("should return a path in the template directory", () => {
        expect(target("sample.txt")).toBe(path.resolve(__dirname, "../template", TARGET_DIR + "/" + SAMPLE_FILE));
    })
});