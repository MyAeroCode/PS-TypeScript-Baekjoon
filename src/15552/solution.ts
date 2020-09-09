function solution(scanner = new Scanner()): string {
    const output: number[] = [];
    const N = scanner.getInt();
    for (let i = 0; i < N; i++) {
        const A = scanner.getInt();
        const B = scanner.getInt();
        output.push(A + B);
    }
    return output.join("\n");
}
//
// 스캐너 객체
const debugMode = process.argv.includes("readFromInputFile");
class Scanner {
    private buffer: Buffer = require("fs").readFileSync(debugMode ? "./src/stdin" : 0);
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
    public getInt(): number {
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
    public getWord(): string {
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
    public getLine(): string {
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
}
const output = solution();
debugMode ? console.log(output) : process.stdout.write(output);
process.exit(0);
