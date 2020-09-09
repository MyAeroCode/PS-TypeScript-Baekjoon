//
// 표준입력에서 데이터 읽기
import readline from "readline";
import fs from "fs";
import { argv } from "process";
const input = [] as string[];
if (argv.includes("readFromInputFile")) {
    input.push(...fs.readFileSync("./src/stdin").toString().split("\n"));
    solution();
} else {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.on("line", (line) => input.push(line.trim())).on("close", solution);
}

//
// 솔루션 함수
function solution() {
    const N = Number(input[0]);
    const lines = input
        .slice(1)
        .map((l) => l.split(" ").map(Number))
        .sort((a, b) => {
            if (a[0] !== b[0]) return a[0] - b[0];
            return a[1] - b[1];
        });

    const projects = [lines[0]];
    lines.forEach((thisLine, idx) => {
        if (idx === 0) return;

        const lastLine = projects[projects.length - 1];
        if (thisLine[0] <= lastLine[1]) {
            //
            // 항상 다음선분의 끝이, 이전선분의 끝보다 크다는 보장이 없다.
            // 2 5
            // 3 4
            // lastLine[1] = thisLine[1];
            lastLine[1] = Math.max(lastLine[1], thisLine[1]);
        } else {
            projects.push(thisLine);
        }
    });

    const ans = projects.reduce((prev, cur) => prev + cur[1] - cur[0], 0);
    console.log(ans);
}
