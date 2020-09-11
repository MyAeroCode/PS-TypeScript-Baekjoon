function solution(io: NodeIO): void {
    enum RGB {
        R = 1,
        G = 2,
        B = 4,
    }
    const N = io.readInt();
    const board = makeArray(N, () => {
        return io
            .readLine()
            .split("")
            .map((c) => {
                if (c === "R") return RGB.R;
                if (c === "G") return RGB.G;
                if (c === "B") return RGB.B;
                throw new Error();
            });
    });
    const getY = (seq: number) => Math.floor(seq / N);
    const getX = (seq: number) => seq % N;
    const deltas = [
        [+1, 0],
        [-1, 0],
        [0, +1],
        [0, -1],
    ];
    function solve(isColorWeak: boolean): number {
        const group = makeArray(N ** 2, () => -1);
        for (let head = 0; head < N ** 2; head++) {
            if (group[head] !== -1) continue;
            group[head] = head;
            const queue = [head];
            while (queue.length) {
                const thisSeq = queue.shift()!;
                const thisY = getY(thisSeq);
                const thisX = getX(thisSeq);
                const thisVal = board[thisY][thisX];
                for (const [dy, dx] of deltas) {
                    const nextY = thisY + dy;
                    const nextX = thisX + dx;
                    const nextSeq = nextY * N + nextX;
                    if (nextY < 0 || N <= nextY) continue;
                    if (nextX < 0 || N <= nextY) continue;
                    if (group[nextSeq] !== -1) continue;
                    const nextVal = board[nextY][nextX];
                    if (nextVal === thisVal || (isColorWeak && thisVal + nextVal === 3)) {
                        group[nextSeq] = head;
                        queue.push(nextSeq);
                    }
                }
            }
        }
        return new Set(group).size;
    }
    io.write([false, true].map(solve).join(" "));
}
//
// 입출력 객체
class NodeIO {
    private debug: boolean = process.argv.includes("readFromInputFile");
    private buffer: Buffer = require("fs").readFileSync(this.debug ? "./src/stdin" : 0);
    private stdout: any[] = [];
    private cursor: number = 0;
    /**
     * 공백이 아닌 문자를 만날 때 까지 전진한다.
     */
    private consumeWhiteSpace(): void {
        const { buffer } = this;
        while (true) {
            const char = buffer[this.cursor];
            if (char === 10 || char === 13 || char === 32) ++this.cursor;
            else break;
        }
    }
    /**
     * 소수점 없는 부호화된 정수 하나를 읽는다.
     */
    public readInt(): number {
        const { buffer } = this;
        this.consumeWhiteSpace();
        const isNegative = buffer[this.cursor] === 45;
        if (isNegative) ++this.cursor;
        let num = 0;
        while (true) {
            const char = buffer[this.cursor];
            if (48 <= char && char <= 57) {
                num = num * 10 + char - 48;
                ++this.cursor;
            } else break;
        }
        return isNegative ? -num : num;
    }
    /**
     * 단어 하나를 읽는다.
     */
    public readWord(): string {
        const { buffer } = this;
        this.consumeWhiteSpace();
        const srt = this.cursor;
        while (true) {
            const char = buffer[this.cursor];
            if (char === 10 || char === 13 || char === 32 || char === undefined) break;
            else ++this.cursor;
        }
        return this.buffer.slice(srt, this.cursor).toString("utf8");
    }
    /**
     * 라인 하나를 읽는다.
     */
    public readLine(): string {
        const { buffer } = this;
        this.consumeWhiteSpace();
        const srt = this.cursor;
        while (true) {
            const char = buffer[this.cursor];
            if (char === 10 || char === 13 || char === undefined) break;
            else ++this.cursor;
        }
        return this.buffer.slice(srt, this.cursor).toString("utf8");
    }
    /**
     * 메세지를 콘솔에 적는다.
     * 채점 모드에서는 메세지를 버퍼에 삽입한다.
     */
    public write(message: any): void {
        if (this.debug) {
            console.log(message);
        } else {
            if (this.stdout.length === 1000) {
                this.flush(false);
                this.stdout = [];
            }
            this.stdout.push(message);
        }
    }
    /**
     * 버퍼에 삽입된 메세지를 한꺼번에 출력하고, 프로그램을 종료한다.
     */
    public flush(exit = true): void {
        if (this.debug) {
            //
        } else {
            console.log(this.stdout.join("\n"));
            exit && process.exit(0);
        }
    }
}
const nodeIO = new NodeIO();
solution(nodeIO);
nodeIO.flush();
//
// utils
interface makeArray {
    (size: number): number[];
    <T>(size: number, initializer: () => T): T[];
}
function makeArray<T>(size: number, initializer: () => T): T[];
function makeArray<T>(size: number): number[];
function makeArray<T>(size: number, initializer?: () => T): T[] | number[] {
    const array: any[] = [];
    for (let i = 0; i < size; i++) {
        array.push(initializer ? initializer() : i);
    }
    return array;
}
