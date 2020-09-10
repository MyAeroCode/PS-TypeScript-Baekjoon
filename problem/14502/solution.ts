function solution(io: NodeIO): void {
    const H = io.readInt();
    const W = io.readInt();
    let initSafeCnt = 0;
    const virusPos = [] as number[];
    const board = [...Array(H).keys()].map((_, h) =>
        [...Array(W).keys()].map((__, w) => {
            const thisCell = io.readInt();
            if (thisCell === 0) ++initSafeCnt;
            if (thisCell === 2) virusPos.push(h * W + w);
            return thisCell;
        }),
    );
    const getY = (raw: number) => Math.floor(raw / W);
    const getX = (raw: number) => raw % W;
    const deltas = [
        [1, 0],
        [-1, 0],
        [0, +1],
        [0, -1],
    ];
    //
    // 3개의 빈칸을 벽으로 막았을 때의 안전영역의 개수를 반환한다.
    function calcSafe(selected: [number, number, number]): number {
        selected.forEach((raw) => (board[getY(raw)][getX(raw)] = 1));
        let safeCnt = initSafeCnt;
        const queue = [...Array(virusPos.length).keys()].map((idx) => virusPos[idx]);
        const isVisted = new Set<number>(virusPos);
        while (queue.length) {
            const raw = queue.shift()!;
            for (const [dy, dx] of deltas) {
                const [nextY, nextX] = [getY(raw) + dy, getX(raw) + dx];
                const nextRaw = nextY * W + nextX;
                if (nextY < 0 || H <= nextY || nextX < 0 || W <= nextX) continue;
                if (isVisted.has(nextRaw)) continue;
                if (board[nextY][nextX] === 0) {
                    isVisted.add(nextRaw);
                    --safeCnt;
                    queue.push(nextRaw);
                }
            }
        }
        selected.forEach((raw) => (board[getY(raw)][getX(raw)] = 0));
        return safeCnt - 3; // 벽으로 대체된 3개 빼기
    }
    //
    // 모든 벽 조합에서 안전영역의 최댓값을 구한다.
    let answer = -Infinity;
    for (let w1 = 0; w1 < H * W; ++w1) {
        if (board[getY(w1)][getX(w1)] !== 0) continue;
        for (let w2 = w1 + 1; w2 < H * W; ++w2) {
            if (board[getY(w2)][getX(w2)] !== 0) continue;
            for (let w3 = w2 + 1; w3 < H * W; ++w3) {
                if (board[getY(w3)][getX(w3)] !== 0) continue;
                answer = Math.max(answer, calcSafe([w1, w2, w3]));
            }
        }
    }
    io.write(answer);
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
