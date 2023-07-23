/** 座席 */
export type Seat = {
    /** 列 */
    row: number;
    /** 行 */
    col: number;
};

/** 生徒オブジェクト */
export type Student = {
    /** 出席番号 */
    studentId: number;
    /** 名前 */
    name?: string;
    /** ふりがな */
    furigana?: string;
    /** 座席位置（固定する場合のみ明示的に指定） */
    seat?: Seat;
    /** 抽選オプション */
    chooseOptions?: {
        x?: null | 'left' | 'right';
        y?: null | 'front' | 'rear';
    };
};

/** 座席配置 */
export type Classroom = boolean[][];

/**
 * 配列内をシャッフルする
 * @param array 
 * @returns 
 */
function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * 抽選に使用できる座席の位置を取得
 * @param classroom 座席配置の二次元配列
 * @returns 座席定義の配列
 */
function getAvailableSeats(classroom: Classroom): Seat[] {
    const seats: Seat[] = [];
    for (let row = 0; row < classroom.length; row++) {
        for (let col = 0; col < classroom[row].length; col++) {
            if (classroom[row][col]) {
                seats.push({ row, col });
            }
        }
    }
    return seats;
}

/**
 * 生徒を座席に割り当てる
 * 
 * 複数オプションが適応されている場合の優先順位: 前 > 後 > 左 > 右
 * @param students 生徒一覧
 * @param classroom 座席配置の二次元配列
 * @param considerOptions 条件を考慮するか？（デフォルト: `true`）
 * @returns 生徒一覧（決定した座席のrow, col入り）
 */
export function assignSeats(students: Student[], classroom: Classroom, considerOptions: boolean = true): Student[] {
    const seats = shuffleArray(getAvailableSeats(classroom));
    const sortedStudents = students.sort((a, b) => {
        if (!considerOptions) {
            return 0;
        }

        const aOptions = a.chooseOptions || {};
        const bOptions = b.chooseOptions || {};

        const aPriority =
            (aOptions.y === 'front' ? 8 : 0) +
            (aOptions.y === 'rear' ? 4 : 0) +
            (aOptions.x === 'left' ? 2 : 0) +
            (aOptions.x === 'right' ? 1 : 0);

        const bPriority =
            (bOptions.y === 'front' ? 8 : 0) +
            (bOptions.y === 'rear' ? 4 : 0) +
            (bOptions.x === 'left' ? 2 : 0) +
            (bOptions.x === 'right' ? 1 : 0);

        return bPriority - aPriority;
    });

    const assignedStudents: Student[] = [];

    for (const student of sortedStudents) {
        if (student.seat && considerOptions) {
            assignedStudents.push(student);
            seats.splice(findSeatIndex(student.seat.row, student.seat.col, seats), 1);
            continue;
        }

        const { row, col } = findBestSeat(student, seats, considerOptions);
        if (row === -1 || col === -1) {
            throw new Error("Not enough seats");
        }

        student.seat = { row, col };
        assignedStudents.push(student);
        seats.splice(findSeatIndex(row, col, seats), 1);
    }

    return assignedStudents;
}

/**
 * 条件にあった最適な席をみつける
 * @param student 生徒
 * @param seats 座席一覧
 * @param considerOptions 条件を考慮するか？（デフォルト: `true`）
 * @returns 生徒に割り当てた座席 (col, row)
 */
function findBestSeat(student: Student, seats: Seat[], considerOptions: boolean = true): Seat {
    const { chooseOptions } = student;
    let bestSeat: Seat | null = null;

    if (!considerOptions) {
        return shuffleArray(seats)[0];
    }

    for (const seat of seats) {
        if (bestSeat === null) {
            bestSeat = seat;
            continue;
        }

        if (chooseOptions) {
            const isBetterSeat =
                (chooseOptions.y === 'front' && seat.row < bestSeat.row) ||
                (chooseOptions.y === 'rear' && seat.row > bestSeat.row) ||
                (chooseOptions.x === 'left' && seat.col < bestSeat.col) ||
                (chooseOptions.x === 'right' && seat.col > bestSeat.col);

            if (isBetterSeat) {
                bestSeat = seat;
            }
        }
    }

    return bestSeat || { row: -1, col: -1 };
}

/**
 * 座席の row, col から、seats 内のインデックスを検索する
 * @param row 座席列番号
 * @param col 座席行番号
 * @param seats 座席一覧
 * @returns インデックス（なかった場合は`-1`）
 */
function findSeatIndex(row: number, col: number, seats: Seat[]): number {
    for (let i = 0; i < seats.length; i++) {
        if (seats[i].row === row && seats[i].col === col) {
            return i;
        }
    }
    return -1;
}

/**
 * 生徒ごとのrow, col一覧を座席表二次元配列形式に変換
 * @param students 生徒一覧（決定した座席のrow, col入り）
 * @param classroom 座席配置の二次元配列
 * @returns 座席配置どおりに生徒一覧を配置した二次元配列（空席は`null`）
 */
export function arrangeSeats(students: Student[], classroom: Classroom): (Student | null)[][] {
    const arrangedSeats: (Student | null)[][] = [];

    for (let row = 0; row < classroom.length; row++) {
        arrangedSeats[row] = [];
        for (let col = 0; col < classroom[row].length; col++) {
            arrangedSeats[row][col] = null;
        }
    }

    for (const student of students) {
        if (student.seat) {
            const { row, col } = student.seat;
            arrangedSeats[row][col] = student;
        }
    }

    return arrangedSeats;
}

/**
 * 指定された座席に対応する利用可能な座席の左からの通し番号を取得
 * @param {Seat} seat - 対象の座席
 * @param {Classroom} classroom 座席配置の二次元配列
 * @returns {number} - 座席の左からの通し番号。利用可能な座席でない場合は`-1`を返します。
 */
export function getSeatNumber(seat: Seat, classroom: Classroom): number {
    let seatNumber = 1;

    for (let row = 0; row < classroom.length; row++) {
        for (let col = 0; col < classroom[row].length; col++) {
            if (classroom[row][col]) {
                if (row === seat.row && col === seat.col) {
                    return seatNumber;
                }
                seatNumber++;
            }
        }
    }

    return -1;
}