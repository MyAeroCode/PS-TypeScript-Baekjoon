import fs from "fs";

const input = fs.readFileSync(0).toString().split(" ");
let N = Number(input[0]);
let M = Number(input[1]);
let K = Number(input[2]);

let matched = Math.min(N >> 1, M);
let remain = N + M - matched * 3;
console.log(matched - (K <= remain ? 0 : Math.ceil((K - remain) / 3)));
