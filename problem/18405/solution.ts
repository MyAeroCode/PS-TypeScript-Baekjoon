type Point = { y: number; x: number };
enum State {
    ALL,
    SAFE,
    INFECTED,
}
function solution(io: NodeIO): void {
    const N = io.readInt(); // 정사각형 한 변의 크기
    const K = io.readInt(); // 바이러스 종류의 개수
    const isVisited = makeArray(N, () => new Set<number>());
    const deltas: Point[] = [
        { y: +1, x: 0 },
        { y: -1, x: 0 },
        { y: 0, x: +1 },
        { y: 0, x: -1 },
    ];
    function point2num({ y, x }: Point): number {
        return y * N + x;
    }
    function num2point(num: number): Point {
        return {
            y: Math.floor(num / N),
            x: num % N,
        };
    }
    //
    // 주어진 조건에 해당하는 상하좌우의 칸의 좌표를 얻는다.
    function getSurronds(point: Point, mode: State): Point[] {
        const { y, x } = point;
        const sourrnds: Point[] = [];
        for (const { y: dy, x: dx } of deltas) {
            const nextY = y + dy;
            const nextX = x + dx;
            if (nextY < 0 || N <= nextY) continue;
            if (nextX < 0 || N <= nextX) continue;
            let ok = false;
            if (mode === State.ALL) ok = true;
            if (mode === State.SAFE && board[nextY][nextX] === 0) ok = true;
            if (mode === State.INFECTED && board[nextY][nextX] !== 0) ok = true;
            if (ok) sourrnds.push({ y: nextY, x: nextX });
        }
        return sourrnds;
    }
    const board = makeArray(N, (y) => {
        const row = [] as number[];
        for (let x = 0; x < N; x++) {
            row[x] = io.readInt();
        }
        return row;
    });
    const [S, Y, X] = makeArray(3, io.readInt);
    //
    // 다음에 전염될 칸의 좌표.
    let targets = new Set<number>();
    let nextTargets = new Set<number>();
    for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
            if (board[y][x] === 0) continue;
            getSurronds({ y, x }, State.SAFE)
                .map((p) => point2num(p))
                .forEach((n) => targets.add(n));
        }
    }
    //
    // BFS;
    let elapsed = 0;
    while (elapsed++ < S) {
        const infected = new Map<number, number>();
        for (const current of targets) {
            const { y, x } = num2point(current);
            if (isVisited[y].has(x)) continue;
            isVisited[y].add(x);
            const infectedType = getSurronds({ y, x }, State.INFECTED)
                .map(({ y, x }) => board[y][x])
                .filter((type) => 0 < type)
                .reduce((a, b) => Math.min(a, b));
            infected.set(point2num({ y, x }), infectedType);
            getSurronds({ y, x }, State.SAFE)
                .map((p) => point2num(p))
                .forEach((n) => nextTargets.add(n));
        }
        infected.forEach((v, k) => {
            const { y, x } = num2point(k);
            board[y][x] = v;
        });
        targets = nextTargets;
        nextTargets = new Set<number>();
    }
    io.write(board[Y - 1][X - 1]);
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
    public readLine(consumeWhiteSpace = true): string {
        const { buffer } = this;
        if (consumeWhiteSpace) this.consumeWhiteSpace();
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
    (sizer: number): number[];
    (sizer: () => number): number[];
    <T>(sizer: number, initializer: (idx: number) => T): T[];
    <T>(sizer: () => number, initializer: (idx: number) => T): T[];
}
function makeArray<T = number>(
    sizer: (() => number) | number,
    initializer?: (idx: number) => T,
): T[] {
    const size = typeof sizer === "function" ? sizer() : sizer;
    const array: any[] = [];
    for (let i = 0; i < size; i++) {
        array.push(initializer ? initializer(i) : i);
    }
    return array;
}
