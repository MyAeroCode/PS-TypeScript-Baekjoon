//
// npx mocha -r ts-node/register ./src/dataStructure/fixedArrayAdaptor.spec.ts
import { describe, it } from "mocha";
import { deepStrictEqual, notDeepStrictEqual, throws } from "assert";
import { FixedArrayAdaptor, ArrayContainer } from "./fixedArrayAdaptor";

describe("FixedArrayAdaptor", function () {
    const holderTypes = [
        Float64Array,
        Float32Array,
        Uint32Array,
        Uint16Array,
        Uint8Array,
        Int32Array,
        Int16Array,
        Int8Array,
        Array,
    ];
    const sz = 5;
    const loopCnt = 50;
    const targets: FixedArrayAdaptor<ArrayContainer<number>>[] = [];
    it("기존 배열, 버퍼 배열과 호환되는가?", () => {
        for (const holderType of holderTypes) {
            targets.push(new FixedArrayAdaptor<ArrayContainer<number>>(holderType, sz));
        }
    });

    it("캐퍼시티와 초기 사이즈가 올바른가?", () => {
        for (const target of targets) {
            deepStrictEqual(target.capacity, sz);
            deepStrictEqual(target.size(), 0);
        }
    });

    it("push, pop를 반복해도 문제가 없는가?", () => {
        for (const target of targets) {
            deepStrictEqual(target.size(), 0);
            for (let i = 1; i <= loopCnt; i++) {
                if (i & 1) {
                    target.push(i);
                    deepStrictEqual(target.size(), 1);
                    deepStrictEqual(target.get(0), i);
                    target.set(0, 2 * i);
                    deepStrictEqual(target.size(), 1);
                    deepStrictEqual(target.get(0), 2 * i);
                } else {
                    target.pop();
                    deepStrictEqual(target.size(), 0);
                }
            }
            deepStrictEqual(target.size(), 0);
        }
    });

    it("push, shift를 반복해도 문제가 없는가?", () => {
        for (const target of targets) {
            deepStrictEqual(target.size(), 0);
            for (let i = 1; i <= loopCnt; i++) {
                if (i & 1) {
                    target.push(i);
                    deepStrictEqual(target.size(), 1);
                    deepStrictEqual(target.get(0), i);
                    target.set(0, 2 * i);
                    deepStrictEqual(target.size(), 1);
                    deepStrictEqual(target.get(0), 2 * i);
                } else {
                    target.shift();
                    deepStrictEqual(target.size(), 0);
                }
            }
            deepStrictEqual(target.size(), 0);
        }
    });

    it("unshift, pop를 반복해도 문제가 없는가?", () => {
        for (const target of targets) {
            deepStrictEqual(target.size(), 0);
            for (let i = 1; i <= loopCnt; i++) {
                if (i & 1) {
                    target.unshift(i);
                    deepStrictEqual(target.size(), 1);
                    deepStrictEqual(target.get(0), i);
                    target.set(0, 2 * i);
                    deepStrictEqual(target.size(), 1);
                    deepStrictEqual(target.get(0), 2 * i);
                } else {
                    target.pop();
                    deepStrictEqual(target.size(), 0);
                }
            }
            deepStrictEqual(target.size(), 0);
        }
    });

    it("unshift, shift를 반복해도 문제가 없는가?", () => {
        for (const target of targets) {
            deepStrictEqual(target.size(), 0);
            for (let i = 1; i <= loopCnt; i++) {
                if (i & 1) {
                    target.unshift(i);
                    deepStrictEqual(target.size(), 1);
                    deepStrictEqual(target.get(0), i);
                    target.set(0, 2 * i);
                    deepStrictEqual(target.size(), 1);
                    deepStrictEqual(target.get(0), 2 * i);
                } else {
                    target.shift();
                    deepStrictEqual(target.size(), 0);
                }
            }
            deepStrictEqual(target.size(), 0);
        }
    });

    it("비어있는 상태에서 요소를 제거하면 에러를 반환하는가?", () => {
        for (const target of targets) {
            for (let i = 0; i < loopCnt; i++) {
                throws(() => target.pop());
                throws(() => target.shift());
            }
        }
    });

    it("캐퍼시티만큼 삽입될 수 있는가?", () => {
        for (const target of targets) {
            deepStrictEqual(target.size(), 0);
            for (let i = 0; i < sz; i++) {
                if (i & 1) target.push(i);
                else target.unshift(i);
            }
            deepStrictEqual(target.size(), sz);
        }
    });

    it("캐퍼시티를 초과하면 에러가 발생하는가?", () => {
        for (const target of targets) {
            deepStrictEqual(target.size(), sz);
            for (let i = 0; i < sz; i++) {
                throws(() => target.push(0));
                throws(() => target.unshift(0));
            }
            deepStrictEqual(target.size(), sz);
        }
    });

    it("초기화가 정상적으로 작동하는가?", () => {
        for (const target of targets) {
            deepStrictEqual(target.size(), sz);
            target.clear();
            deepStrictEqual(target.size(), 0);
        }
    });

    it("저장되지 않은 데이터에 접근시 에러가 발생하는가?", () => {
        for (const target of targets) {
            deepStrictEqual(target.size(), 0);
            throws(() => target.get(0));
            throws(() => target.set(1, 1));
            deepStrictEqual(target.size(), 0);
        }
    });

    it("순회 가능한가?", () => {
        for (const target of targets) {
            const a = [] as number[];
            const b = [] as number[];
            for (let i = 0; i < sz; i++) {
                a.push(i);
                target.push(i);
            }
            //
            // for-of
            for (const elem of target) {
                b.push(elem);
            }
            deepStrictEqual(a, b);

            //
            // downlevel-iterator
            const c = [...target];
            deepStrictEqual(a, c);
        }
    });

    it("깊은 복사가 정상적으로 이루어지는가?", () => {
        for (const target of targets) {
            const cloned = target.asArray();

            //
            // 깊은 복사된 컨테이너와, 기존 컨테이너의 타입이 같아야 한다.
            deepStrictEqual(target.getHolder().constructor, cloned.constructor);

            //
            // 두 컨테이너에 저장된 데이터의 개수가 동일해야 한다.
            deepStrictEqual(target.size(), cloned.length);

            //
            // 두 컨테이너의 순열은 서로 같아야 한다.
            for (let i = 0; i < cloned.length; i++) {
                deepStrictEqual(target.get(i), cloned[i]);
            }

            //
            // 깊은 복사된 컨테이너가 변경되더라도,
            // 기존 컨테이너에 영향을 끼쳐서는 안된다.
            cloned[0] = 54321;
            notDeepStrictEqual(target.get(0), cloned[0]);
        }
    });
});
