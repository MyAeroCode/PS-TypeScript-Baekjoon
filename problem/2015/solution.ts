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
interface AccNode {
    val: number;
    idx: number;
}
function solution() {
    //
    // 부분합의 배열을 생성하고, 오름차순으로 정렬한다.
    const [N, K] = lines[0].split(" ").map(Number);
    const arr = lines[1].split(" ").map(Number);
    const accArr = arr.map((v, i, arr) => {
        if (i === 0) arr[i] = v;
        else arr[i] = arr[i - 1] + v;
        return arr[i];
    });
    const accCnt = accArr.reduce((cnt, acc) => {
        if (!cnt.has(acc)) cnt.set(acc, 1);
        else cnt.set(acc, cnt.get(acc)! + 1);
        return cnt;
    }, new Map<number, number>());

    accArr.unshift(0);
    let answer = 0;
    for (let i = 0; i < arr.length; i++) {
        const prevAcc = accArr[i];
        const thisAcc = accArr[i + 1];
        const cnt = accCnt.get(prevAcc + K) || 0;
        accCnt.set(thisAcc, accCnt.get(thisAcc)! - 1);
        answer += cnt;
    }
    console.log(answer);
}
