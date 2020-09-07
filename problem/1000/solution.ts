import readline from "readline";
const { stdin, stdout } = process;
const lines = [] as string[];
const rl = readline.createInterface({ input: stdin, output: stdout });
rl.on("line", (line) => lines.push(line)).on("close", solution);

export function solution() {
    const [a, b] = lines[0].split(" ").map(Number);
    console.log(a + b);
}
