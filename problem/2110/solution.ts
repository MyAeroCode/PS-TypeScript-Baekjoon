//
// 표준입력에서 데이터 읽기
import readline from "readline";
import fs from "fs";
import { argv } from "process";
const lines = [] as string[];
if (argv.includes("readFromInputFile")) {
    lines.push(...fs.readFileSync("./src/stdin").toString().split("\n"));
    console.log(lines);
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
    const [N, C] = lines[0].split(" ").map(Number);
    const houses = lines
        .slice(1)
        .map(Number)
        .sort((a, b) => a - b);

    //
    // 두 공유기 사이의 간격이 mid와 같거나 클 수 있는가?
    function test(mid: number): boolean {
        let prevPoint = houses[0];
        let remain = C - 1;
        for (let i = 1; i < N; i++) {
            if (mid <= houses[i] - prevPoint) {
                --remain;
                prevPoint = houses[i];
            }
        }
        return remain <= 0;
    }

    //
    // 그러한 mid의 최댓값을 이분탐색으로 찾는다.
    let srt = 0;
    let end = houses[N - 1];
    let ans = 0;
    while (srt < end) {
        const mid = (srt + end) >> 1;
        if (test(mid)) {
            srt = mid + 1;
            ans = mid;
        } else {
            end = mid;
        }
    }
    console.log(ans);
}
