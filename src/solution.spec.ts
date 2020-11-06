import { describe, it } from "mocha";
import { deepStrictEqual } from "assert";
import { execSync } from "child_process";
import fs from "fs";

describe("테스트", function () {
    const buf2str = (buf: Buffer) => buf.toString().trim();
    for (let i = 1; true; ++i) {
        let input: Buffer;
        let actual: Buffer;
        let expect: Buffer;
        try {
            input = fs.readFileSync(`./src/data/${i}`);
            actual = execSync(`node ./out/solution.js`, { input });
            expect = fs.readFileSync(`./src/data/${i}-ans`);
        } catch (e) {
            break;
        }
        it(`케이스 ${i}`, function () {
            deepStrictEqual(
                buf2str(actual).replace(/\r\n/g, "\n"),
                buf2str(expect).replace(/\r\n/g, "\n"),
            );
        });
    }
});
