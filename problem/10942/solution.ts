function solution(io: IO): void {
    const N = io.readInt();
    const num = [...Array(N).keys()].map(() => io.readInt());
    const M = io.readInt();
    const queries = [...Array(M).keys()].map(() => [io.readInt(), io.readInt()]);
    //
    // DP
    const cache = new Map();
    function query(s: number, e: number): boolean {
        if (s + 0 === e) return true;
        if (s + 1 === e) return num[s - 1] === num[e - 1];
        const key = `${s},${e}`;
        if (!cache.has(key)) {
            const localAns = num[s - 1] === num[e - 1] ? query(s + 1, e - 1) : false;
            cache.set(key, localAns);
            return localAns;
        }
        return cache.get(key);
    }
    queries.forEach(([srt, end]) => io.write(Number(query(srt, end))));
}
//
// 입출력 객체
class IO {
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
        return String.fromCharCode(...this.buffer.slice(srt, this.cursor));
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
        return String.fromCharCode(...this.buffer.slice(srt, this.cursor)).trim();
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
const io = new IO();
solution(io);
io.flush();
