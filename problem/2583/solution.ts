function solution(io: NodeIO): void {
    const [HEIGHT, WIDTH, K] = makeArray(3, io.readInt);
    const squares = makeArray(K, () => {
        const [lux, luy, rdx, rdy] = makeArray(4, io.readInt);
        return { lux, luy, rdx, rdy };
    });
    function isBlocked(point: { y: number; x: number }): boolean {
        return squares.some((square) => {
            const inY = square.luy <= point.y && point.y < square.rdy;
            const inX = square.lux <= point.x && point.x < square.rdx;
            return inY && inX;
        });
    }
    //
    // BFS
    const isVisited = makeArray(HEIGHT, () => [] as boolean[]);
    const sizes = [];
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            if (isVisited[y][x] === true) continue;
            const head = { y, x };
            if (isBlocked(head)) continue;
            const queue = [head];
            let thisSize = 0;
            while (queue.length) {
                const current = queue.shift()!;
                if (isVisited[current.y][current.x]) continue;
                isVisited[current.y][current.x] = true;
                thisSize++;
                for (const [dy, dx] of [
                    [-1, 0],
                    [+1, 0],
                    [0, -1],
                    [0, +1],
                ]) {
                    const nextY = current.y + dy;
                    const nextX = current.x + dx;
                    if (nextY < 0 || HEIGHT <= nextY) continue;
                    if (nextX < 0 || WIDTH <= nextX) continue;
                    if (isVisited[nextY][nextX]) continue;
                    const next = { y: nextY, x: nextX };
                    if (isBlocked(next)) continue;
                    queue.push(next);
                }
            }
            sizes.push(thisSize);
        }
    }
    sizes.sort((a, b) => a - b);
    io.write(sizes.length);
    io.write(sizes.join(" "));
}
//
// 입출력 객체
class NodeIO {
    private debug: boolean = process.argv.includes("readFromInputFile");
    private buffer: Buffer = require("fs").readFileSync(this.debug ? "./src/stdin" : 0);
    private stdout: any[] = [];
    private cursor: number = 0;
    constructor() {
        this.consumeWhiteSpace = this.consumeWhiteSpace.bind(this);
        this.readInt = this.readInt.bind(this);
        this.readLine = this.readLine.bind(this);
        this.readWord = this.readWord.bind(this);
        this.write = this.write.bind(this);
        this.flush = this.flush.bind(this);
    }
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
            this.stdout.push(message);
        }
    }
    /**
     * 버퍼에 삽입된 메세지를 한꺼번에 출력하고, 프로그램을 종료한다.
     */
    public flush(): void {
        if (this.debug) {
            //
        } else {
            console.log(this.stdout.join("\n"));
            process.exit(0);
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
    <T>(size: number, initializer: (idx: number) => T): T[];
}
function makeArray<T>(size: number, initializer: (idx: number) => T): T[];
function makeArray<T>(size: number): number[];
function makeArray<T>(size: number, initializer?: (idx: number) => T): T[] | number[] {
    const array: any[] = [];
    for (let i = 0; i < size; i++) {
        array.push(initializer ? initializer(i) : i);
    }
    return array;
}
