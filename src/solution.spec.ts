import { describe, it } from "mocha";
import { deepStrictEqual } from "assert";
import cp from "child_process";
import fs from "fs";
import path from "path";

describe("테스트", function () {
    const data = [] as { in: Buffer; ans: Buffer }[];
    let cnt = 0;
    while (true) {
        try {
            cnt++;
            const nextIn = fs.readFileSync(path.join(__dirname, "data", `${cnt}`));
            const nextAns = fs.readFileSync(path.join(__dirname, "data", `${cnt}-ans`));
            data.push({ in: nextIn, ans: nextAns });
        } catch (e) {
            break;
        }
    }

    for (let i = 0; i < data.length; i++) {
        it(`케이스 ${i + 1}`, function () {
            const output = cp.execFileSync("node", ["./out/solution.js"], {
                input: data[i].in,
            });
            deepStrictEqual(output.toString().trim(), data[i].ans.toString().trim());
        });
    }
});
