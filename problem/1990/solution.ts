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
    const [a, b] = lines[0].split(" ").map(Number);

    function makePalindrome(size: number): string[] {
        const elems = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        if (size === 1) return elems;
        if (size === 2) return elems.map((e) => e.repeat(2));
        return makePalindrome(size - 2).flatMap((prev) => elems.map((e) => e + prev + e));
    }

    //
    // 팰린드롬 목록을 먼저 생성하고, 소수인지 판별.
    const palindromes = [1, 2, 3, 4, 5, 6, 7, 8]
        .flatMap((radix) => makePalindrome(radix))
        .map(Number)
        .filter((n) => a <= n && n <= b)
        .filter((n) => {
            if (n === 1) return false;
            if (n === 2) return true;
            for (let i = 2; i <= Math.sqrt(n); i++) {
                if (n % i === 0) return false;
            }
            return true;
        })
        .sort((a, b) => a - b);

    palindromes.forEach((n) => console.log(n));
    console.log(-1);
}
