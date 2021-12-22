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
        expect(template("init")).toBe(path.resolve(__dirname, "init/template"));
    })

    it("should return a path in the template directory", () => {
        expect(template("init", "sample.txt")).toBe(path.resolve(__dirname, "init/template", SAMPLE_FILE));
    })
});