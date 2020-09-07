import readline from "readline";
const { stdin, stdout } = process;
const lines = [] as string[];
const rl = readline.createInterface({ input: stdin, output: stdout });
rl.on("line", (line) => lines.push(line)).on("close", solution);

export function solution() {
    const [N, M, K] = lines[0].split(" ").map(Number);
    let matched = Math.min(N >> 1, M);
    let remain = N + M - matched * 3;
    console.log(matched - (K <= remain ? 0 : Math.ceil((K - remain) / 3)));
}
