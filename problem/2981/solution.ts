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
    const N = Number(lines[0]);
    const nums: number[] = lines
        .slice(1)
        .map(Number)
        .sort((a, b) => a - b);

    function gcd(numbers: number[]) {
        if (numbers.length === 0) return 0;
        if (numbers.length === 1) return numbers[0];
        function _gcd(a: number, b: number): number {
            if (b === 0) return a;
            return _gcd(b, a % b);
        }
        return numbers.reduce((prev, cur) => _gcd(prev, cur));
    }

    //
    // A[0] % m = r
    // A[1] % m = r 에서,
    // A[0] % m = A[1] % m 이고,
    // A[1] % m - A[0] % m 에서,
    // (A[1] - A[0]) % m = 0 이기 때문에,
    // (A[i+1] - A[i]) % m = 0 이므로,
    // 인접한 항의 차이는 공통된 약수를 가지고 있음을 알 수 있다.
    // 즉, 인접한 항의 차이들의 최대 공약수를 구하고, 그것의 약수를 출력하면 된다.
    const diffs: number[] = [];
    for (let i = 1; i < nums.length; i++) {
        diffs.push(nums[i] - nums[i - 1]);
    }

    const g = gcd(diffs);
    const mSet = new Set<number>();
    for (let m = 1; m <= Math.sqrt(g); m++) {
        if (g % m === 0) {
            if (m !== 1) mSet.add(m);
            mSet.add(g / m);
        }
    }
    console.log(
        Array.from(mSet)
            .sort((a, b) => a - b)
            .join(" "),
    );
}
