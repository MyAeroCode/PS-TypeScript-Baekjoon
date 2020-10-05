function solution(io: NodeIO): void {
    const token = io.readLine();
    try {
        io.write(evalToken(token));
    } catch (e) {
        io.write(0);
    }
    //
    // 주어진 올바른 토큰의 값을 계산한다.
    function evalToken(input: string): number {
        if (input.length & 1) throw new Error();
        const tokens = splitToken(input);
        if (tokens.length === 1) {
            if (input === "(]") throw new Error();
            if (input === "[)") throw new Error();
            if (input === "()") return 2;
            if (input === "[]") return 3;
            const innerToken = input.slice(1, input.length - 1);
            const innerValue = evalToken(innerToken);
            if (input[0] === "(" && input[input.length - 1] === ")")
                return 2 * innerValue;
            if (input[0] === "[" && input[input.length - 1] === "]")
                return 3 * innerValue;
            throw new Error();
        }
        return tokens.map((token) => evalToken(token)).reduce((a, b) => a + b, 0);
    }
    //
    // 연결된 괄호를 풀어낸다.
    function splitToken(input: string): string[] {
        const tokens: string[] = [];
        let srt = 0;
        let level = 1;
        for (let i = 1; i < input.length; i++) {
            if (input[i] === "(" || input[i] === "[") level++;
            if (input[i] === ")" || input[i] === "]") level--;
            if (level === 0) {
                tokens.push(input.slice(srt, i + 1));
                srt = i + 1;
            }
        }
        if (srt !== input.length) throw new Error();
        return tokens;
    }
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
// null 또는 undefined가 아닌 첫번째 값을 반환한다.
function collapse<T>(...vals: (T | undefined | null)[]): T {
    for (const val of vals) {
        if (val === undefined || val === null) continue;
        return val;
    }
    throw new Error(`적어도 하나는 유효한 값이여야 합니다.`);
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
function makeArray<L extends Container<any>>(
    holderConstructor: ContainerConstructor<L>,
    size: number,
    initializer: (idx: number) => L[number],
): L {
    const holder = new holderConstructor(size);
    for (let i = 0; i < size; i++) {
        holder[i] = initializer(i);
    }
    return holder;
}
//
// 평균실행시간
function testing(func: () => void, count: number): number {
    let elapsed = 0;
    for (let i = 0; i < count; i++) {
        const srt = Date.now();
        func();
        const end = Date.now();
        elapsed += end - srt;
    }
    return Math.floor(elapsed / count);
}
