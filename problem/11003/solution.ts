//
// Look At
// https://code0xff.tistory.com/168
function solution(io: NodeIO): void {
    //
    // 효율적인 데크.
    class Deque {
        readonly capacity: number;
        buffer: Int32Array;
        head: number = 0;
        rear: number = 0;
        constructor(n: number) {
            this.capacity = n;
            this.buffer = new Int32Array(this.capacity + 1);
        }
        //
        // 주어진 인덱스가 범위 안에 들어오도록 조정한다.
        adjust(idx: number): number {
            if (idx === -1) return this.capacity;
            if (idx === this.buffer.length) return 0;
            return idx;
        }
        //
        // 저장된 요소의 크기
        size(): number {
            const delta = this.rear - this.head;
            if (0 <= delta) return delta;
            return this.buffer.length + delta;
        }
        //
        // 앞쪽 요소의 값을 가져온다.
        // 없는 경우 undefined.
        front(): number | undefined {
            if (this.size() === 0) return undefined;
            return this.buffer[this.head];
        }
        //
        // 뒤쪽 요소의 값을 가져온다.
        // 없는 경우 undefined.
        back(): number | undefined {
            if (this.size() === 0) return undefined;
            return this.buffer[this.adjust(this.rear - 1)];
        }
        //
        // 뒷쪽에 요소를 추가
        push(n: number) {
            if (this.size() !== this.capacity) {
                this.buffer[this.rear] = n;
                this.rear = this.adjust(this.rear + 1);
            }
        }
        //
        // 앞쪽에 요소를 추가
        unshift(n: number) {
            if (this.size() !== this.capacity) {
                this.head = this.adjust(this.head - 1);
                this.buffer[this.head] = n;
            }
        }
        //
        // 뒷쪽 요소를 제거
        pop() {
            if (this.size() !== 0) {
                this.rear = this.adjust(this.rear - 1);
            }
        }
        //
        // 앞쪽 요소를 제거
        shift() {
            if (this.size() !== 0) {
                this.head = this.adjust(this.head + 1);
            }
        }
        asArray(): Int32Array {
            const s = this.size();
            const array = new Int32Array(s);
            for (let i = 0; i < s; i++) {
                array[i] = this.buffer[this.adjust(this.head + i)];
            }
            return array;
        }
    }
    //
    // 문제풀이
    const [N, L] = makeArray(2, io.readInt);
    const list = new Int32Array(N);
    const answer = new Int32Array(N);
    for (let i = 0; i < N; i++) {
        list[i] = io.readInt();
    }
    const deque = new Deque(L);
    for (let thisIdx = 0; thisIdx < N; thisIdx++) {
        if (deque.front() === thisIdx - L) deque.shift();
        while (true) {
            if (deque.size() === 0) {
                deque.push(thisIdx);
                break;
            } else {
                const lastIdx = deque.back()!;
                if (list[thisIdx] <= list[lastIdx]) {
                    deque.pop();
                } else {
                    deque.push(thisIdx);
                    break;
                }
            }
        }
        answer[thisIdx] = list[deque.front()!];
        // io.write(deque.asArray());
    }
    io.write(answer.join(" "));
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
function getOr<T>(v: T | undefined | null, defaultValue: T): T {
    if (v === undefined || v === null) return defaultValue;
    return v;
}
