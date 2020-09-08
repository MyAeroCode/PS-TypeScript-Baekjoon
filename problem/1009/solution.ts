//
// 표준입력에서 데이터 읽기
import readline from "readline";
import fs from "fs";
import { argv } from "process";
const lines = [] as string[];
if (argv.includes("readFromInputFile")) {
    lines.push(...fs.readFileSync("./src/stdin").toString().split("\n"));
    solution();
} else {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.on("line", (line) => lines.push(line.trim())).on("close", solution);
}

//
// 솔루션 함수
function solution() {
    lines.slice(1).forEach((line) => {
        let [a, b] = line.split(" ").map(Number);
        a %= 10;

        //
        // 마지막 숫자만 보고 순환패턴을 알아낸다.
        const cycle: number[] = [];
        for (let nextN = a; nextN !== cycle[0]; nextN = (nextN * a) % 10) {
            cycle.push(nextN);
        }

        b = (b - 1) % cycle.length;
        console.log(cycle[b] === 0 ? 10 : cycle[b]);
    });
}
