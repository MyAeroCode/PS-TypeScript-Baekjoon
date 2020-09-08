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
    const [n] = lines[0].split(" ").map(Number);
    const days = lines.slice(2).map((day) => Number(day) - 1); // 첫 날은 무시한다.

    //
    // mid개의 선박으로, 리스트를 커버할 수 있는가?
    function test(mid: number) {
        const periods: number[] = [];
        const visited = new Set<number>([0]);
        for (const day of days) {
            visited.add(day);
            if (periods.some((period) => day % period === 0 && visited.has(day - period)))
                continue;
            periods.push(day);
            if (mid < periods.length) return false;
        }
        return true;
    }

    //
    // 이분탐색
    let srt = 0;
    let end = 10 ** 9;
    let ans = 0;
    while (srt < end) {
        const mid = (srt + end) >> 1;
        if (test(mid)) {
            end = mid;
            ans = mid;
        } else {
            srt = mid + 1;
        }
    }
    console.log(ans);
}
