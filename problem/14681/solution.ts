import readline from "readline";
const { stdin, stdout } = process;
const lines = [] as string[];
const rl = readline.createInterface({ input: stdin, output: stdout });
rl.on("line", (line) => lines.push(line)).on("close", solution);

export function solution() {
    let x = Number(lines[0]);
    let y = Number(lines[1]);
    if (0 < x && 0 < y) console.log(1);
    if (x < 0 && 0 < y) console.log(2);
    if (x < 0 && y < 0) console.log(3);
    if (0 < x && y < 0) console.log(4);
}
