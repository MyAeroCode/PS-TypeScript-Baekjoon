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
