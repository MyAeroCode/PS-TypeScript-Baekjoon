function solution(io: NodeIO): void {
    const W = io.readInt();
    const H = io.readInt();
    const N = io.readInt();
    const clipedByHorizenal = new Array<number>();
    const clipedByVertical = new Array<number>();

    //
    // 자른 지점을 읽고, 크기 순으로 재정렬한다.
    for (let i = 0; i < N; i++) {
        const type = io.readInt();
        const point = io.readInt();
        type === 0 ? clipedByHorizenal.push(point) : clipedByVertical.push(point);
    }
    clipedByHorizenal.sort((a, b) => a - b);
    clipedByVertical.sort((a, b) => a - b);

    //
    // 수평으로 잘려진 구간의 각 높이를 구한다.
    const heightsOfRange = new Array<number>();
    for (let i = 0; i < clipedByHorizenal.length; i++) {
        const prev = clipedByHorizenal[i - 1] || 0;
        const curr = clipedByHorizenal[i];
        heightsOfRange.push(curr - prev);
    }
    heightsOfRange.push(H - (clipedByHorizenal[clipedByHorizenal.length - 1] || 0));

    //
    // 수직으로 잘려진 구간의 각 너비를 구한다.
    const widthsOfRange = new Array<number>();
    for (let i = 0; i < clipedByVertical.length; i++) {
        const prev = clipedByVertical[i - 1] || 0;
        const curr = clipedByVertical[i];
        widthsOfRange.push(curr - prev);
    }
    widthsOfRange.push(W - (clipedByVertical[clipedByVertical.length - 1] || 0));

    //
    // 가장 너비가 긴 구간의 값과,
    // 가장 높이가 긴 구간의 값을 구한다.
    const maxHeightOfRange = Math.max(...heightsOfRange);
    const maxWidthOfRange = Math.max(...widthsOfRange);

    //
    // 정답 계산
    const ans = maxHeightOfRange * maxWidthOfRange;
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
