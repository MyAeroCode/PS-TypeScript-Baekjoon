function solution(io: NodeIO): void {
    const n = io.readInt();
    const arr = makeArray<Int32Array[]>(Array, 4, () => new Int32Array(n));
    for (let row = 0; row < n; row++) {
        for (let col = 0; col < 4; col++) {
            arr[col][row] = io.readInt();
        }
    }

    //
    // ab, cd 합의 쌍을 구한다.
    const pairMaps = makeArray<Map<number, number>[]>(Array, 2, () => new Map());
    for (let base = 0; base < 2; base++) {
        const pairMap = pairMaps[base];
        for (let first = 0; first < n; first++) {
            for (let second = 0; second < n; second++) {
                const term = arr[base * 2][first] + arr[base * 2 + 1][second];
                pairMap.set(term, (pairMap.get(term) || 0) + 1);
            }
        }
    }

    //
    // 두 합의 쌍이 0인 것을 구한다
    let ans = 0;
    for (const [val, cnt] of pairMaps[0]) {
        const oppositeCnt = pairMaps[1].get(-val) || 0;
        ans += cnt * oppositeCnt;
    }
    io.write(ans);
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
     * 모든 입력을 읽는다.
     */
    public readAll(): string {
        this.cursor = this.buffer.length;
        return this.buffer.toString("utf-8");
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
     * 버퍼에 삽입된 메세지를 한꺼번에 출력한다.
     */
    public flush(): void {
        if (this.debug) {
            //
        } else {
            console.log(this.stdout.join("\n"));
        }
    }
}

//
// 배열생성 스니펫
type Container<T> = {
    [n: number]: T;
    length: number;
};
type ContainerConstructor<T> = {
    new (size: number): T;
};
/**
 * 주어진 배열 생성자와 이니셜라이져를 사용하여 배열을 생성한다.
 *
 * @author aerocode.net
 */
function makeArray<L extends Container<any>>(
    holderConstructor: ContainerConstructor<L>,
    size: number,
    initializer?: (idx: number) => L[number],
): L {
    const holder = new holderConstructor(size);
    if (initializer) {
        for (let i = 0; i < size; i++) {
            holder[i] = initializer(i);
        }
    }
    return holder;
}

const nodeIO = new NodeIO();
solution(nodeIO);
nodeIO.flush();
process.exit(0);
