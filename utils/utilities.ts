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
