interface Point3D {
    z: number;
    y: number;
    x: number;
}
function solution(io: NodeIO): void {
    const deltas = [
        { z: +1, y: 0, x: 0 },
        { z: -1, y: 0, x: 0 },
        { z: 0, y: +1, x: 0 },
        { z: 0, y: -1, x: 0 },
        { z: 0, y: 0, x: +1 },
        { z: 0, y: 0, x: -1 },
    ];
    let remain = 0;
    let stack = [] as Point3D[];
    let nextStack = [] as Point3D[];
    const [M, N, H] = [io.readInt(), io.readInt(), io.readInt()];
    const board = makeArray(H, (z) =>
        makeArray(N, (y) =>
            makeArray(M, (x) => {
                const val = io.readInt();
                if (val === 0) remain++;
                if (val === 1) nextStack.push({ z, y, x });
                return val;
            }),
        ),
    );
    function ripen({ z, y, x }: Point3D) {
        if (0 <= z && z < H && 0 <= y && y < N && 0 <= x && x < M) {
            if (board[z][y][x] === 0) {
                nextStack.push({ z, y, x });
                board[z][y][x] = 1;
                remain--;
            }
        }
    }

    let ans = -1;
    while (nextStack.length) {
        stack = nextStack;
        nextStack = [];
        while (stack.length) {
            const { z, y, x } = stack.pop()!;
            for (const delta of deltas) {
                ripen({
                    z: z + delta.z,
                    y: y + delta.y,
                    x: x + delta.x,
                });
            }
        }
        ans++;
    }
    io.write(remain ? -1 : ans);
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
