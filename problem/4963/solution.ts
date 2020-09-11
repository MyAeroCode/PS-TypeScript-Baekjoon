function solution(io: NodeIO): void {
    const deltas = [
        { dy: +1, dx: 0 },
        { dy: -1, dx: 0 },
        { dy: 0, dx: +1 },
        { dy: 0, dx: -1 },
        { dy: +1, dx: +1 },
        { dy: -1, dx: -1 },
        { dy: +1, dx: -1 },
        { dy: -1, dx: +1 },
    ];
    while (true) {
        const [w, h] = [io.readInt(), io.readInt()];
        if (w + h === 0) break;
        const board = makeArray(h, () => makeArray(w, () => io.readInt()));
        const group = makeArray(h, () => makeArray(w, () => -1));
        let groupCnt = 0;
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                if (board[y][x] === 0) continue;
                if (group[y][x] !== -1) continue;
                const head = groupCnt++;
                const queue = [{ y, x }];
                group[y][x] = head;
                while (queue.length) {
                    const { y: thisY, x: thisX } = queue.shift()!;
                    for (const { dy, dx } of deltas) {
                        const nextY = thisY + dy;
                        const nextX = thisX + dx;
                        if (nextY < 0 || h <= nextY) continue;
                        if (nextX < 0 || w <= nextX) continue;
                        if (board[nextY][nextX] === 0) continue;
                        if (group[nextY][nextX] !== -1) continue;
                        group[nextY][nextX] = head;
                        queue.push({ y: nextY, x: nextX });
                    }
                }
            }
        }
        io.write(groupCnt);
    }
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
