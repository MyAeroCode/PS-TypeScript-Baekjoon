interface Ant {
    idx: number; // 개미의 번호.
    pos: number; // 개미의 위치.
    dir: number; // 개미의 진행방향. (+1 or -1)
}

function solution(io: NodeIO): void {
    const N = io.readInt();
    const L = io.readInt();
    const ants = makeArray<Ant[]>(Array, N, (idx) => {
        const v = io.readInt();
        return {
            idx: idx + 1,
            pos: Math.abs(v),
            dir: Math.sign(v),
        };
    }).sort((a, b) => a.pos - b.pos);

    //
    // 왼쪽 또는 오른쪽으로 떨어지는 시각을 구한다.
    const l_elapsed = ants.filter((a) => a.dir === -1).map((a) => 0 + a.pos);
    const r_elapsed = ants.filter((a) => a.dir === +1).map((a) => L - a.pos);
    const l_elapsed_max = Math.max(...l_elapsed);
    const r_elapsed_max = Math.max(...r_elapsed);

    //
    // 부딪힌 개미가 있는지 검사한다.
    let isCrossed = false;
    for (let i = 1; i < ants.length; i++) {
        if (ants[i - 1].dir === +1 && ants[i].dir === -1) {
            isCrossed = true;
            break;
        }
    }

    const idx = l_elapsed.length + (l_elapsed_max > r_elapsed_max ? -1 : 0);
    io.write(`${ants[idx].idx} ${Math.max(l_elapsed_max, r_elapsed_max)}`);
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
/**
 * 일반배열 또는 버퍼배열.
 */
type ArrayContainer<T> = {
    [n: number]: T;
    length: number;
};
/**
 * 제네릭으로 주어진 배열을 만드는 생성자 함수.
 */
type ArrayContainerConstructor<T extends ArrayContainer<any>> = {
    new (size: number): T;
};
/**
 * null, undefined, NaN이 아닌 첫번째 값을 반환한다.
 *
 * @author aerocode.net
 */
function collapse<T>(...vals: (T | undefined | null)[]): T {
    for (const val of vals) {
        if (val === undefined || val === null || isNaN(val as any)) continue;
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
/**
 * 배열을 고정크기 데크로 사용할 수 있게 도와주는 어댑터.
 *
 * @author aerocode.net
 */
export class FixedArrayAdaptor<L extends ArrayContainer<any>> {
    private holderConstructor: ArrayContainerConstructor<L>;
    private holder: L;
    private head: number;
    private rear: number;
    readonly capacity: number;
    constructor(holderConstructor: ArrayContainerConstructor<L>, size: number) {
        this.holderConstructor = holderConstructor;
        this.holder = new this.holderConstructor(size + 1) as L;
        this.capacity = size;
        this.head = 0;
        this.rear = 0;
    }
    /**
     * 현재 데이터가 담겨있는 컨테이너를 반환한다.
     */
    getHolder(): L {
        return this.holder;
    }
    /**
     * 데크의 범위를 벗어나지 않도록 모듈러 연산을 취한 값을 반환한다.
     */
    private adjust(idx: number): number {
        return (idx + this.holder.length) % this.holder.length;
    }
    /**
     * 0을 기준으로 idx번째의 val을 가져온다.
     */
    private rawGet(idx: number): L[number] {
        return this.holder[this.adjust(idx)];
    }
    /**
     * 0을 기준으로 idx번째에 val를 삽입한다.
     */
    private rawSet(idx: number, val: L[number]): void {
        (this.holder[idx] as any) = val;
    }
    /**
     * this.head + idx의 val을 가져온다.
     */
    get(idx: number): L[number] {
        if (idx < 0 || this.size() <= idx) throw new Error(`아웃 오브 바운드`);
        return this.rawGet(this.adjust(this.head + idx));
    }
    /**
     * this.head + idx에 val를 삽입한다.
     */
    set(idx: number, val: L[number]): void {
        if (idx < 0 || this.size() <= idx) throw new Error(`아웃 오브 바운드`);
        return this.rawSet(this.adjust(this.head + idx), val);
    }
    /**
     * 현재 데크에 저장된 요소의 개수를 반환한다.
     */
    size(): number {
        const diff = this.rear - this.head;
        if (0 <= diff) return diff;
        return this.holder.length + diff;
    }
    /**
     * 현재 데크가 비어있는가?
     */
    isEmpty(): boolean {
        return this.size() === 0;
    }
    /**
     * 현재 데크가 꽉 찼는가?
     */
    isFull(): boolean {
        return this.size() === this.capacity;
    }
    /**
     * 현재 데크에 저장된 모든 요소를 제거한다.
     */
    clear(): void {
        this.head = 0;
        this.rear = 0;
    }
    /**
     * 뒤쪽에 데이터를 하나 추가한다.
     * 가용공간이 없다면 에러가 발생한다.
     */
    push(data: L[number]): void {
        if (this.isFull()) throw Error(`스택에 가용공간이 없습니다.`);
        this.rawSet(this.rear, data);
        this.rear = this.adjust(this.rear + 1);
    }
    /**
     * 앞쪽에 데이터를 하나 추가한다.
     * 가용공간이 없다면 에러가 발생한다.
     */
    unshift(data: L[number]): void {
        if (this.isFull()) throw Error(`스택에 가용공간이 없습니다.`);
        this.head = this.adjust(this.head - 1);
        this.rawSet(this.head, data);
    }
    /**
     * 뒷쪽 데이터를 빼낸다.
     * 데크가 비어있을 경우 예외가 발생한다.
     */
    pop(): void {
        if (this.isEmpty()) throw Error(`스택이 비어있습니다.`);
        this.rear = this.adjust(this.rear - 1);
    }
    /**
     * 앞쪽 데이터를 빼낸다.
     * 데크가 비어있을 경우 예외가 발생한다.
     */
    shift(): void {
        if (this.isEmpty()) throw Error(`스택이 비어있습니다.`);
        this.head = this.adjust(this.head + 1);
    }
    /**
     * 뒷쪽 데이터를 반환한다.
     * 데크가 비어있는 경우 undefined가 반환된다.
     */
    back(): L[number] | undefined {
        return this.isEmpty() ? undefined : this.rawGet(this.rear - 1);
    }
    /**
     * 앞쪽 데이터를 반환한다.
     * 데크가 비어있는 경우 undefined가 반환된다.
     */
    front(): L[number] | undefined {
        return this.isEmpty() ? undefined : this.rawGet(this.head);
    }
    /**
     * 저장된 요소를 순회하는 이터레이터를 반환.
     * for-of 구문에 사용할 수 있다.
     */
    [Symbol.iterator]() {
        const arr = this;
        let idx = 0;
        const iterator = {
            next(): { value: L[number]; done: boolean } {
                if (idx < arr.size()) {
                    return { value: arr.get(idx++), done: false };
                }
                return { value: null as any, done: true };
            },
        };
        return iterator;
    }
    /**
     * 현재 데이터가 담겨있는 부분을 깊은복사하여 반환한다.
     */
    asArray(): L {
        const array = new this.holderConstructor(this.size()) as any;
        const sz = this.size();
        for (let i = 0; i < sz; i++) {
            array[i] = this.get(i);
        }
        return array;
    }
}

const nodeIO = new NodeIO();
solution(nodeIO);
nodeIO.flush();
process.exit(0);
