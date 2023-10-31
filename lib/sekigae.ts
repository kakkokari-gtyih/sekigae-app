/** 座席 */
export type Seat = {
    /** 列（左からn番目） */
    row: number | null;
    /** 行（前からn番目） */
    col: number | null;
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
        distantStudentIds?: number[];
        fixed?: boolean;
        pairStudentId?: number | null;
    };
};

/** 座席配置 */
export type Classroom = boolean[][];

/** 生徒つき座席配置 */
export type ClassroomWithStudents = (Student | null)[][];

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
 * @param {Classroom} classroom 座席配置の二次元配列
 * @param {Seat[]} ignore あらかじめ使用できない席を省く際に使用
 * @returns {Seat[]} 座席定義の配列
 */
function getAvailableSeats(classroom: Classroom, ignore: Seat[] = []): Seat[] {
    const ignoreCols = ignore.map((v) => v.col);
    const ignoreRows = ignore.map((v) => v.row);

    const seats: Seat[] = [];
    for (let row = 0; row < classroom.length; row++) {
        for (let col = 0; col < classroom[row].length; col++) {
            if (classroom[row][col] && !(ignoreCols.includes(col) && ignoreRows.includes(row))) {
                seats.push({ row, col });
            }
        }
    }
    return seats;
}


/**
 * 2のn乗の配列をバラバラの順番で返す
 */
function get2PowRandom(min: number = 0, max: number = 3, count: number = 4): number[] {
    const result: number[] = [];
    while (result.length < count) {
        const randomPower = Math.floor(Math.random() * (max - min + 1)) + min;
        const powerOfTwo = Math.pow(2, randomPower);
        if (!result.includes(powerOfTwo)) {
            result.push(powerOfTwo);
        }
    }
    return result;
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

        const aOptions = a.chooseOptions;
        const bOptions = b.chooseOptions;
        const randomWeights = get2PowRandom(0, 3, 4);

        const aPriority =
            (a.seat ? 16 : 0) +
            (aOptions?.y === 'front' ? randomWeights[0] : 0) +
            (aOptions?.y === 'rear' ? randomWeights[1] : 0) +
            (aOptions?.x === 'left' ? randomWeights[2] : 0) +
            (aOptions?.x === 'right' ? randomWeights[3] : 0);

        const bPriority =
            (b.seat ? 16 : 0) +
            (bOptions?.y === 'front' ? randomWeights[0] : 0) +
            (bOptions?.y === 'rear' ? randomWeights[1] : 0) +
            (bOptions?.x === 'left' ? randomWeights[2] : 0) +
            (bOptions?.x === 'right' ? randomWeights[3] : 0);

        return bPriority - aPriority;
    });

    let assignedStudents: Student[] = [];

    for (const student of sortedStudents) {

        // 固定配置
        if (student.seat && student.seat.col && student.seat.row && considerOptions) {
            if (student.chooseOptions) {
                student.chooseOptions.fixed = true;
            } else {
                student.chooseOptions = {
                    fixed: true,
                    pairStudentId: null,
                };
            }
            assignedStudents.push(student);
            seats.splice(findSeatIndex(student.seat.row, student.seat.col, seats), 1);
            continue;
        }

        const { row, col } = findBestSeat(student, seats, classroom, considerOptions);
        if (row === -1 || col === -1) {
            throw new Error("Not enough seats");
        }

        student.seat = { row, col };
        assignedStudents.push(student);
        seats.splice(findSeatIndex(row, col, seats), 1);
    }

    if (considerOptions) {
        assignedStudents = doPostSeatAdjustment([...assignedStudents], classroom);
    }

    return assignedStudents.sort((a, b) => a.studentId - b.studentId);
}

/**
 * より良い席かどうか判定する
 * @param student 生徒
 * @param seat 判定したい座席
 * @param bestSeat 現状のベストな座席
 * @param classroom 教室の配置
 * @returns より良いかどうか
 */
function judgeBetterSeat(student: Student, seat: Seat, bestSeat: Seat, classroom: Classroom): boolean {
    if (!student.chooseOptions || (!student.chooseOptions.x && !student.chooseOptions.y) || !seat.col || !seat.row || !bestSeat.col || !bestSeat.row) {
        return false;
    }

    if (student.chooseOptions.y) {
        if ((student.chooseOptions.y === 'front' && (seat.col < bestSeat.col || seat.col < (classroom[0].length - 1) / 2)) ||
            (student.chooseOptions.y === 'rear' && (seat.col > bestSeat.col || seat.col > (classroom[0].length - 1) / 2))) {
            if (!student.chooseOptions.x) {
                return true;
            }
        } else if (student.chooseOptions.x) {
            return false;
        }
    }

    if (student.chooseOptions.x) {
        if ((student.chooseOptions.x === 'left' && (seat.row < bestSeat.row || seat.row < (classroom.length - 1) / 2)) ||
            (student.chooseOptions.x === 'right' && (seat.row > bestSeat.row || seat.row > (classroom.length - 1) / 2))) {
            return true;
        } else if (student.chooseOptions.y) {
            return false;
        }
    }

    return false;
}

/**
 * 条件にあった最適な席をみつける
 * @param student 生徒
 * @param seats 座席一覧
 * @param considerOptions 条件を考慮するか？（デフォルト: `true`）
 * @returns 生徒に割り当てた座席 (col, row)
 */
function findBestSeat(student: Student, seats: Seat[], classroom: Classroom, considerOptions: boolean = true): Seat {
    const { chooseOptions } = student;
    let bestSeat: Seat | null = null;

    if (!considerOptions) {
        return seats[0];
    }

    if (student.seat) {
        const i = findSeatIndex(student.seat.row ?? -1, student.seat?.col ?? -1, seats);
        if (i >= 0) {
            return seats[i];
        } else {
            throw new Error("Fixed seat is already taken");
        }
    }

    for (const seat of seats) {
        if (bestSeat === null) {
            bestSeat = seat;
            continue;
        }

        if (chooseOptions) {
            if (judgeBetterSeat(student, seat, bestSeat, classroom)) {
                bestSeat = seat;
            }
        }
    }

    return bestSeat || { row: -1, col: -1 };
}

/**
 * 生徒同士を離す・くっつける
 * @param students 生徒一覧（優先順位付けがされた状態）
 * @param classroom 教室の配置
 */
function doPostSeatAdjustment(students: Student[], classroom: Classroom): Student[] {
    const studentsNeedAdjustment = students.filter((v) => (v.chooseOptions?.distantStudentIds && v.chooseOptions.distantStudentIds.length > 0) || v.chooseOptions?.pairStudentId);
    // ↓優先順位高い順に並んでいるので、低い順に引いていくためにひっくり返す
    const reAssignedStudents = [...students].filter((v) => !studentsNeedAdjustment.includes(v)).reverse();

    studentsNeedAdjustment.forEach((targetStudent) => {
        if (!targetStudent.seat || !targetStudent.chooseOptions) {
            throw new Error('Invalid settings');
        }

        let bestSeat: Seat = targetStudent.seat;
        let replaceWithId: number | null = null;

        if (targetStudent.chooseOptions.distantStudentIds && !targetStudent.chooseOptions.pairStudentId && targetStudent.chooseOptions.distantStudentIds.every((v) => !isAdjacent(students.find((w) => w.studentId === v)?.seat, targetStudent.seat))) {
            console.log("近くではないので操作不要");
            reAssignedStudents.unshift(targetStudent);
            return;
        }

        if (targetStudent.chooseOptions.pairStudentId && (!targetStudent.chooseOptions.distantStudentIds || targetStudent.chooseOptions.distantStudentIds.length == 0) && isAdjacent(students.find((w) => w.studentId === targetStudent.chooseOptions?.pairStudentId)?.seat, targetStudent.seat, 'row')) {
            console.log("すでにとなりどうしなので操作不要");
            reAssignedStudents.unshift(targetStudent);
            return;
        }

        let g = 0;
        while (replaceWithId == null) {
            for (let i = 0; i < reAssignedStudents.length; i++) {
                const studentToBeChecked = reAssignedStudents[i];
                if (!studentToBeChecked.seat) break;
    
                // 避けたい生徒自身の場合スキップ
                if (targetStudent.chooseOptions.distantStudentIds && targetStudent.chooseOptions.distantStudentIds.includes(studentToBeChecked.studentId)) {
                    console.log('避ける本人');
                    continue;
                }
    
                // 避けたい生徒と席が近ければスキップ
                if (targetStudent.chooseOptions.distantStudentIds && targetStudent.chooseOptions.distantStudentIds.some((v) => isAdjacent(students.find((w) => w.studentId === v)?.seat, studentToBeChecked.seat))) {
                    console.log('至近距離');
                    continue;
                }

                // 誰かを避けている人・ペアがある人はスキップ
                if ((studentToBeChecked.chooseOptions?.distantStudentIds && studentToBeChecked.chooseOptions.distantStudentIds.length > 0) || studentToBeChecked.chooseOptions?.pairStudentId || studentToBeChecked.studentId === targetStudent.chooseOptions.pairStudentId) {
                    console.log('他条件を尊重 or ペア同士');
                    continue;
                }

                // 固定配置はスキップ
                if (studentToBeChecked.chooseOptions?.fixed) {
                    console.log('固定配置');
                    continue;
                }

                // ペアになりたい人がいればその人の横かどうかを判定
                const isAdjacentBulk = (targetStudent.chooseOptions.pairStudentId == null) ? true : isAdjacent(students.find((w) => w.studentId === targetStudent.chooseOptions?.pairStudentId)?.seat, studentToBeChecked.seat, 'row');
                // さすがに、ペアをあわせる＋座席位置を考慮すると破綻しかねないので無視
                const judgeBetterSeatBulk = (targetStudent.chooseOptions.pairStudentId != null) ? true : judgeBetterSeat(targetStudent, studentToBeChecked.seat, bestSeat, classroom);
        
                // 希望に添えそうな席なら一旦キープ
                // 2回目以降のループでは基準を減らしていく（埒が明かないので）
                if ((isAdjacentBulk || g > 1) && (judgeBetterSeatBulk || g > 0)) {
                    bestSeat = studentToBeChecked.seat;
                    replaceWithId = studentToBeChecked.studentId;
                    console.log('Seat Kept:', JSON.stringify({ bestSeat, replaceWithId }));
                    break;
                }
            }    

            g++;
        }

        // 座席の交換
        if (replaceWithId != null) {
            const replaceStudentIndex = reAssignedStudents.findIndex((w) => w.studentId === replaceWithId);
            const replaceStudentSeat = { ...reAssignedStudents[replaceStudentIndex].seat } as Seat;
            reAssignedStudents[replaceStudentIndex].seat = { ...targetStudent.seat };
            targetStudent.seat = replaceStudentSeat;
            console.log({ targetStudent, studentToBeReplaced: reAssignedStudents[replaceStudentIndex] });
        }

        // 最悪決まらなかったとしても座席表は埋める
        reAssignedStudents.unshift(targetStudent);
    });

    return reAssignedStudents;
}

/**
 * 席は近いかどうか
 * @param seat1 比較対象の席
 * @param seat2 比較対象の席
 * @param validateMode 何処で比較するか（`row`, `col`, `both` デフォルトは `both`）
 * @returns 
 */
function isAdjacent(seat1: Seat | null = null, seat2: Seat | null = null, validateMode: 'row' | 'col' | 'both' = 'both'): boolean {
    if (!seat1?.col || !seat1?.row || !seat2?.col || !seat2?.row) return false;

    const rowDiff = Math.abs(seat1.row - seat2.row);
    const colDiff = Math.abs(seat1.col - seat2.col);

    if (validateMode === 'col') {
        return rowDiff == 0 && colDiff <= 1;
    }
    if (validateMode === 'row') {
        return colDiff == 0 && rowDiff <= 1;
    }
    return rowDiff <= 1 && colDiff <= 1;
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
export function arrangeSeats(students: Student[], classroom: Classroom): ClassroomWithStudents {
    const arrangedSeats: ClassroomWithStudents = [];

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
 * 座席表二次元配列形式から、生徒ごとのrow, col一覧に変換
 * @param seats 座席表の2次元配列
 * @returns 生徒の配列
 */
export function extractStudentsFromSeats(seats: ClassroomWithStudents): Student[] {
    const students: Student[] = [];

    for (let row = 0; row < seats.length; row++) {
        for (let col = 0; col < seats[row].length; col++) {
            const student = seats[row][col];
            if (student !== null) {
                student.seat = { row, col };
                students.push(student);
            }
        }
    }
    return students.sort((a, b) => a.studentId - b.studentId);
}

/**
 * 指定された座席に対応する利用可能な座席の左からの通し番号を取得
 * @param {Seat} seat 対象の座席
 * @param {Classroom} classroom 座席配置の二次元配列
 * @returns {number} 座席の左からの通し番号。利用可能な座席でない場合は`-1`を返します。
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
