/**
 * 일반배열 또는 버퍼배열.
 */
export type ArrayContainer<T> = {
    [n: number]: T;
    length: number;
};
/**
 * 제네릭으로 주어진 배열을 만드는 생성자 함수.
 */
export type ArrayContainerConstructor<T extends ArrayContainer<any>> = {
    new (size: number): T;
};
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
