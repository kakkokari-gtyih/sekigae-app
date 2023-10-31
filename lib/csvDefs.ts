import type { Student } from "./sekigae";

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...never[]]
type Join<K, P> = K extends string | number
    ? P extends string | number
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
    : never;
type Paths<T, D extends number = 10> = D extends never
    ? never
    : T extends object
    ? {
        [K in keyof T]-?: K extends string | number
        ? K | Join<K, Paths<T[K], Prev[D]>>
        : never
    }[keyof T]
    : never;
    
/**
 * CSVスキーマの定義
 */
export const csvSchemaKVs: Record<
    /** CSV末尾の空列上部のバージョンアイデンティファイヤー */
    string,
    {
        /** CSV書式の名前 */
        name: string;
        /** CSV末尾の空列上部のバージョンアイデンティファイヤー */
        identifier: string | null;
        /** CSVのindexとの対応表 */
        props: Partial<Record<Paths<Student>, number>>;
    }> = {
    v1: {
        name: 'v1',
        identifier: null,
        props: {
            studentId: 0,
            name: 1,
            furigana: 2,
            "chooseOptions.x": 3,
            "chooseOptions.y": 4,
            seat: 5,
        },
    },
    v2: {
        name: 'v2',
        identifier: 'v2',
        props: {
            studentId: 0,
            name: 1,
            furigana: 2,
            "chooseOptions.x": 3,
            "chooseOptions.y": 4,
            "chooseOptions.distantStudentIds": 5,
            "chooseOptions.pairStudentId": 6,
            seat: 7,
        },
    }
};

function _getCSVIndex(key: Paths<Student>, version: keyof typeof csvSchemaKVs = 'v1'): number {
    return csvSchemaKVs[version].props[key] ?? -1;
}

/**
 * CSVのバージョンごとでのプロパティのインデックスを返す関数を作成する関数
 * @param version CSVバージョン
 * @returns キーを指定するとそのバージョンでのインデックスを返す関数（値がない場合は`-1`）
 */
export function createGetCSVIndex(version: keyof typeof csvSchemaKVs) {
    return (key: Paths<Student>) => Reflect.apply(_getCSVIndex, undefined, [key, version]);
}