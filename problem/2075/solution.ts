import { createInterface } from "readline";
import fs from "fs";
import { exit } from "process";

class PriorityQueue<T> {
    private holder = [] as T[];
    private comparator: (a: T, b: T) => number;
    constructor(comparator: (a: T, b: T) => number) {
        this.comparator = comparator;
        this.holder.push(null as any);
    }

    private swap(i: number, j: number): void {
        if (i !== j) {
            const t = this.holder[i];
            this.holder[i] = this.holder[j];
            this.holder[j] = t;
        }
    }

    push(v: T): void {
        this.holder.push(v);
        let n = this.holder.length - 1;
        while (1 < n) {
            const parent = this.holder[n >> 1];
            const r = this.comparator(parent, v);
            if (0 < r) {
                this.swap(n >> 1, n);
                n >>= 1;
            } else {
                break;
            }
        }
    }

    pop(): T | undefined {
        if (this.size() === 0) return undefined;
        else {
            this.swap(1, this.holder.length - 1);
            const willReturn = this.holder.pop();
            let n = 1;
            while (true) {
                const lidx = n * 2 + 0;
                const ridx = n * 2 + 1;
                const v = this.holder[n];
                const l = this.holder[lidx];
                const r = this.holder[ridx];

                //
                // 자식노드가 둘 다 없음.
                if (l === undefined) {
                    break;
                }
                //
                // 왼쪽 자식노드만 있음.
                else if (r === undefined) {
                    if (this.comparator(l, v) < 0) {
                        this.swap(n, lidx);
                        n = lidx;
                    } else {
                        break;
                    }
                }
                //
                // 양쪽 자식노드가 있음.
                else {
                    const target = this.comparator(l, r) < 0 ? lidx : ridx;
                    if (this.comparator(this.holder[target], v) < 0) {
                        this.swap(n, target);
                        n = target;
                    } else {
                        break;
                    }
                }
            }
            return willReturn;
        }
    }

    peek(): T | undefined {
        if (this.size() === 0) return undefined;
        return this.holder[1];
    }

    size(): number {
        return this.holder.length - 1;
    }
}

//
// 기존에 사용하던 NodeIO는 메모리 제한에 걸림.
const isDebug = process.argv.includes("readFromInputFile");
const rl = createInterface({
    input: isDebug ? fs.createReadStream("./src/stdin") : process.stdin,
    output: process.stdout,
    terminal: false,
});

let N = 0;
let lineNumber = 0;
const pq = new PriorityQueue<number>((a, b) => a - b);
rl.on("line", function (line) {
    lineNumber++;
    if (lineNumber === 1) {
        N = parseInt(line);
    } else {
        //
        // Top-N Algolihtm
        const numbers = line.split(" ").map(Number);
        if (lineNumber === 2) {
            numbers.forEach((n) => pq.push(n));
        } else {
            numbers.forEach((n) => {
                if (pq.peek()! < n) {
                    pq.pop()!;
                    pq.push(n);
                }
            });
        }
    }
    if (lineNumber === N + 1) {
        console.log(pq.peek()!);
        exit(0);
    }
});
