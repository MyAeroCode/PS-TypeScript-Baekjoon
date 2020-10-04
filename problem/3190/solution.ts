type Node = {
    y: number;
    x: number;
};
enum Direction {
    UP = "up",
    DOWN = "down",
    LEFT = "left",
    RIGHT = "right",
}
function solution(io: NodeIO): void {
    //
    // N : 보드의 크기
    // K : 사과의 개수
    const [N, K] = makeArray(2, io.readInt);
    //
    // y,x 좌표를 인덱스로 변환
    function yx2idx(y: number, x: number): number {
        return y * N + x;
    }
    //
    // 인덱스를 y,x 좌표로 변환
    function idx2yx(idx: number): Node {
        return {
            y: Math.floor(idx / N),
            x: idx % N,
        };
    }
    //
    // 사과가 있는 칸의 인덱스 집합
    const apples = makeArray(K, () => {
        const [y, x] = makeArray(2, io.readInt);
        return yx2idx(y - 1, x - 1);
    }).reduce((untilNow, cur) => {
        untilNow.add(cur);
        return untilNow;
    }, new Set<number>());
    //
    // 방향변환 명령어의 스택
    // 먼저 실행해야 할 명령어가 마지막에 위치한다.
    const commandsStack = makeArray(io.readInt(), () => {
        const time = io.readInt();
        const info = io.readWord();
        return { time, info };
    }).reverse();
    //
    // 방향별 위치 변화량
    const delta = {
        [Direction.UP]: { y: -1, x: 0 },
        [Direction.DOWN]: { y: +1, x: 0 },
        [Direction.LEFT]: { y: 0, x: -1 },
        [Direction.RIGHT]: { y: 0, x: +1 },
    };
    //
    // 현재 뱀이 차지하고 있는 칸의 인덱스 정보
    // snake[+0] = 꼬리 (첫번째 요소)
    // snake[-1] = 머리 (마지막 요소)
    const snakeArr = [yx2idx(0, 0)];
    const snakeSet = new Set<number>(snakeArr);
    let direction = Direction.RIGHT;
    let time = 0;
    while (true) {
        //
        // 1초 늘린다.
        time++;
        //
        // 다음 머리가 위치할 칸을 계산한다.
        const head = snakeArr[snakeArr.length - 1];
        const { y, x } = idx2yx(head);
        const { y: dy, x: dx } = delta[direction];
        const nextY = y + dy;
        const nextX = x + dx;
        const next = yx2idx(nextY, nextX);
        //
        // 머리부터 늘리고본다.
        // 단, 겹치지 말아야 한다.
        if (snakeSet.has(next)) break;
        snakeArr.push(next);
        snakeSet.add(next);
        //
        // 사과를 섭취했는가?
        if (apples.has(next)) {
            apples.delete(next);
        } else {
            //
            // 꼬리를 제거한다.
            const removed = snakeArr[0];
            snakeArr.shift()!;
            snakeSet.delete(removed);
        }
        //
        // 벽 또는 자기 자신에 부딪혔는지 검사한다.
        if (nextY < 0 || N <= nextY) break;
        if (nextX < 0 || N <= nextX) break;
        //
        // 방향 전환이 주어졌는가?
        // io.write(`${time} [${snakeArr.join(", ")}]`);
        if (commandsStack.length) {
            const lastCommand = commandsStack[commandsStack.length - 1];
            if (lastCommand.time === time) {
                switch (lastCommand.info) {
                    //
                    // 왼쪽으로 90도 회전
                    case "L":
                        if (direction === Direction.RIGHT) {
                            direction = Direction.UP;
                        } else if (direction === Direction.LEFT) {
                            direction = Direction.DOWN;
                        } else if (direction === Direction.UP) {
                            direction = Direction.LEFT;
                        } else {
                            direction = Direction.RIGHT;
                        }
                        break;
                    //
                    // 오른쪽으로 90도 회전
                    case "D":
                        if (direction === Direction.RIGHT) {
                            direction = Direction.DOWN;
                        } else if (direction === Direction.LEFT) {
                            direction = Direction.UP;
                        } else if (direction === Direction.UP) {
                            direction = Direction.RIGHT;
                        } else {
                            direction = Direction.LEFT;
                        }
                        break;
                }
                //
                // 해당 명령어를 빼낸다.
                commandsStack.pop();
            }
        }
    }
    io.write(time);
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
