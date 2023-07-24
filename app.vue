<template>
    <div>
        <UContainer class="mt-10 space-y-6">
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-200 mb-2">
                高機能席替えアプリ
            </h1>

            <nav class="flex items-center text-xl">
                <button
                    :class="['p-4 border-b-2 hover:opacity-75', (settingsTab === 'classroom') ? 'border-slate-800 dark:border-slate-300' : 'border-transparent']"
                    @click="settingsTab = 'classroom'">
                    ①座席の配置
                </button>
                <UIcon name="i-heroicons-chevron-right" class="pb-0.5" />
                <button
                    :class="['p-4 border-b-2 hover:opacity-75', (settingsTab === 'students') ? 'border-slate-800 dark:border-slate-300' : 'border-transparent']"
                    @click="settingsTab = 'students'">
                    ②メンバーの情報
                </button>
                <UIcon name="i-heroicons-chevron-right" class="pb-0.5" />
                <button
                    :class="['p-4 border-b-2 hover:opacity-75', (settingsTab === 'exec') ? 'border-slate-800 dark:border-slate-300' : 'border-transparent']"
                    @click="settingsTab = 'exec'">
                    ③席替え実行
                </button>
                <NuxtLink to="https://github.com/kakkokari-gtyih/sekigae-app" target="_blank"
                    class="ml-auto text-base hover:opacity-75">
                    ソースコードはこちら
                </NuxtLink>
            </nav>

            <UCard v-if="settingsTab === 'classroom'" class="flex flex-col flex-1 overflow-y-auto">
                <div class="flex items-center mb-4">
                    <p>{{ classroom.length }}列 × {{ classroom[0].length }}行&emsp;選択済み: <b>{{ availableSeats }}</b> 席 （生徒数:
                        <b>{{
                            students.length }}</b> 人）
                    </p>
                </div>
                <div class="w-full grid gap-1" :style="`grid-template-columns: auto repeat(${classroom.length}, 1fr) auto`">
                    <div :style="`grid-column: 1 / ${classroom.length + 3}`" class="text-center text-lg font-bold p-1">
                        <UIcon name="i-heroicons-arrow-small-up"
                            style="height: 1em; width: 1em; vertical-align: -.125em;" />
                        前方
                        <UIcon name="i-heroicons-arrow-small-up"
                            style="height: 1em; width: 1em; vertical-align: -.125em;" />
                    </div>
                    <div class="space-y-1 grid grid-cols-1 h-full">
                        <div class="h-1"></div>
                        <UButton v-for="seat, i in classroom[0]" :block="true" color="white" icon="i-heroicons-x-mark"
                            @click="delCol(i)">
                        </UButton>
                    </div>
                    <div v-for="row, i in classroom" class="space-y-1">
                        <UButton :block="true" color="white" icon="i-heroicons-x-mark" @click="delRow(i)">
                        </UButton>
                        <button v-for="seat, j in row"
                            :class="['block w-full min-h-[60px] p-3', seat ? 'bg-yellow-200 dark:bg-yellow-600' : 'bg-gray-200 dark:bg-gray-800']"
                            @click="classroom[i][j] = !seat">
                        </button>
                    </div>
                    <div class="space-y-1 grid h-full" style="grid-template-rows: 32px 1fr;">
                        <div></div>
                        <UButton :block="true" icon="i-heroicons-plus" style="writing-mode: vertical-rl;" @click="addRow()">
                            列を追加
                        </UButton>
                    </div>
                    <UButton :block="true" icon="i-heroicons-plus" :style="`grid-column: 2 / ${classroom.length + 2}`"
                        @click="addCol()">
                        行を追加
                    </UButton>
                </div>
            </UCard>

            <UCard v-if="settingsTab === 'students'" class="flex flex-col flex-1 overflow-y-auto">
                <div class="flex items-center mb-4">
                    <div>
                        <p><b>{{ availableSeats }}</b> 席に対して、現在の人数 <b>{{ students.length }}</b> 人</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                            このプログラムはブラウザ上で動作が完結しているため、入力したデータがインターネット上に出ることはありません。</p>
                    </div>
                    <div class="ml-auto">
                        <UButton icon="i-heroicons-user-plus" label="メンバーの追加" color="primary" class="mr-2"
                            @click="openStudentEdit()" />
                        <UDropdown :items="[
                            [
                                {
                                    label: 'かんたん一括挿入',
                                    icon: 'i-heroicons-clipboard-document-list',
                                    click: openStudentEasyInput,
                                },
                                {
                                    label: 'インポート',
                                    icon: 'i-heroicons-arrow-up-tray',
                                    click: importFromCSV,
                                },
                                {
                                    label: 'エクスポート',
                                    icon: 'i-heroicons-arrow-down-tray',
                                    click: exportToCSV,
                                },
                            ],
                            [
                                {
                                    label: 'CSVひな型ダウンロード',
                                    icon: 'i-heroicons-arrow-down-tray',
                                    click: downloadCSV,
                                }
                            ]
                        ]">
                            <UButton icon="i-heroicons-chevron-down-20-solid" color="gray" />
                        </UDropdown>
                    </div>
                </div>
                <UTable :columns="[
                    { key: 'studentId', label: '出席番号' },
                    { key: 'name', label: '名前' },
                    { key: 'fixed', label: '固定配置' },
                    { key: 'condition', label: '優先配置' },
                    { key: 'actions' },
                ]" :rows="students">
                    <template #fixed-data="{ row }" class="w-auto">
                        {{ row.seat !== undefined ? 'あり' : 'なし' }}
                    </template>
                    <template #condition-data="{ row }" class="w-auto">
                        <!-- @vue-ignore -->
                        {{ Object.values(row?.chooseOptions ?? {}).some((e) => ['left', 'right', 'front', 'rear'].includes(e ?? '')) ? 'あり' : 'なし' }}
                    </template>
                    <template #actions-data="{ row }" class="w-auto">
                        <UDropdown :items="studentActionItems(row)">
                            <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                        </UDropdown>
                    </template>
                </UTable>
            </UCard>

            <UCard v-if="settingsTab === 'exec'" class="flex flex-col flex-1 overflow-y-auto">
                <div class="mb-4 flex space-x-2 justify-center">
                    <USelect v-model="effect" option-attribute="name"
                        :options="[{ name: 'エフェクトなし', value: 'none' }, { name: 'スロット', value: 'slot' }]" />
                    <UButton color="primary" variant="solid" label="席替え実施" :disabled="effectState === 'running'"
                        @click="execSekigae()" />
                </div>
                <SeatRenderer id="seats" :classroom="classroom" :seats="resultForRendering" class="mb-4" />
                <div class="flex space-x-2 justify-center">
                    <UButton v-if="effect === 'slot' && effectState !== 'done'" color="primary" size="lg" variant="solid"
                        label="ストップ！" :disabled="!slotSpinning" @click="slotSpinning = false" />
                    <template v-else-if="effectState === 'done'">
                        <UButton color="white" label="CSVでダウンロード" @click="exportResultToCSV()" />
                    </template>
                </div>
            </UCard>

            <UModal v-model="modalIsOpen" @close="resetStudentEdit()">
                <UCard v-if="modalState === 'studentEdit'"
                    :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                    <template #header>
                        <div class="flex items-center justify-between">
                            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                                メンバーの追加 / 編集
                            </h3>
                            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                                @click="modalState = null" />
                        </div>
                    </template>
                    <div class="space-y-2" v-if="currentEditObject">
                        <UFormGroup name="studentId" label="出席番号">
                            <UInput type="number" v-model="currentEditObject.studentId" />
                        </UFormGroup>
                        <UFormGroup name="name" label="名前" hint="任意">
                            <UInput v-model="currentEditObject.name" />
                        </UFormGroup>
                        <UFormGroup name="furigana" label="ふりがな" hint="任意">
                            <UInput v-model="currentEditObject.furigana" />
                        </UFormGroup>
                        <div class="py-1 flex items-center">
                            <UToggle v-model="enableFixedPosition" />
                            <button class="text-sm ml-1"
                                @click="enableFixedPosition = !enableFixedPosition">固定配置を有効にする</button>
                        </div>
                        <div v-if="enableFixedPosition">
                            <SeatSelector :classroom="classroom" :initial="currentEditObject.seat"
                                @change="studentEditSeatHandler" />
                        </div>
                        <div class="py-1 flex items-center">
                            <UToggle v-model="enableCondition" />
                            <button class="text-sm ml-1" @click="enableCondition = !enableCondition">優先配置を有効にする</button>
                        </div>
                        <div v-if="enableCondition && currentEditObject.chooseOptions" class="space-y-4">
                            <div class="space-y-2">
                                <!-- @vue-ignore -->
                                <URadio v-model="currentEditObject.chooseOptions.x" :value="'left'" name="chooseOptionsLR"
                                    label="左側優先" />
                                <!-- @vue-ignore -->
                                <URadio v-model="currentEditObject.chooseOptions.x" :value="'right'" name="chooseOptionsLR"
                                    label="右側優先" />
                                <!-- @vue-ignore -->
                                <URadio v-model="currentEditObject.chooseOptions.x" :value="null" name="chooseOptionsLR"
                                    label="左右の希望なし" />
                            </div>
                            <div class="space-y-2">
                                <!-- @vue-ignore -->
                                <URadio v-model="currentEditObject.chooseOptions.y" :value="'front'" name="chooseOptionsFB"
                                    label="前方優先" />
                                <!-- @vue-ignore -->
                                <URadio v-model="currentEditObject.chooseOptions.y" :value="'rear'" name="chooseOptionsFB"
                                    label="後方優先" />
                                <!-- @vue-ignore -->
                                <URadio v-model="currentEditObject.chooseOptions.y" :value="null" name="chooseOptionsFB"
                                    label="前後の希望なし" />
                            </div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">
                                <span
                                    class="text-yellow-700 dark:text-yellow-400 font-bold">【免責事項】</span>席の割り当ては、上記の設定に基づいて行われますが、条件に反した席が選ばれる可能性があります。希望に基づいて席を割り当てるために優先順位を考慮していますが、希望に合致する席が利用可能な場合にのみ割り当てが行われるため、利用可能な席が希望に合致しない場合や、席が不足している場合には、条件に反した席が選ばれる可能性があります。
                            </div>
                        </div>
                    </div>
                    <template #footer>
                        <div class="text-end">
                            <UButton color="white" label="キャンセル" class="mr-2" @click="modalState = null" />
                            <UButton label="保存" @click="saveStudentEdit()" />
                        </div>
                    </template>
                </UCard>

                <UCard v-if="modalState === 'easyInput'"
                    :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                    <template #header>
                        <div class="flex items-center justify-between">
                            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                                かんたん一括挿入
                            </h3>
                            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                                @click="modalState = null" />
                        </div>
                    </template>
                    <UFormGroup name="students" label="メンバーの名前（一人ずつ改行で入力）" help="すでにメンバーが居る場合は、その出席番号に続けて末尾に挿入されます。">
                        <UTextarea :autofocus="true" :rows="10" v-model="studentEasyInput" />
                    </UFormGroup>
                    <template #footer>
                        <div class="text-end">
                            <UButton color="white" label="キャンセル" class="mr-2" @click="modalState = null" />
                            <UButton label="実行" @click="execStudentEasyInput()" />
                        </div>
                    </template>
                </UCard>

            </UModal>
        </UContainer>
        <UNotifications />
    </div>
</template>
<script setup lang="ts">
import type { Classroom, Student, Seat } from '@/lib/sekigae';
import { arrangeSeats, assignSeats, getSeatNumber } from '@/lib/sekigae';

const settingsTab = ref<'classroom' | 'students' | 'exec'>('classroom');

const modalState = ref<null | 'studentEdit' | 'easyInput'>(null);
const modalIsOpen = ref<boolean>(false);
watch(modalState, (to) => {
    modalIsOpen.value = (to !== null);
    if (to === null) {
        resetStudentEdit();
    }
});

const students = ref<Student[]>([]);
const classroom = ref<Classroom>([
    [true, true, true, true, true],
    [true, true, true, true, true],
    [true, true, true, true, true],
    [true, true, true, true, true],
    [true, true, true, true, true],
    [true, true, true, true, true],
]);
const availableSeats = computed(() => classroom.value.map((row) => row.reduce((p, c) => p + (c ? 1 : 0), 0)).reduce((p, c) => p + c));

function addRow() {
    classroom.value.push(new Array(classroom.value[0].length).fill(true));
}

function delRow(n: number) {
    if (classroom.value.length <= 1) {
        alert("これ以上削除できません");
        return;
    }
    classroom.value.splice(n, 1);
}

function addCol() {
    classroom.value.forEach((v) => {
        v.push(true);
    });
}

function delCol(n: number) {
    if (classroom.value[0].length <= 1) {
        alert("これ以上削除できません");
        return;
    }
    classroom.value.forEach((v) => {
        v.splice(n, 1);
    });
}

// StudentEasyInput START
const studentEasyInput = ref<string>();
function openStudentEasyInput() {
    modalState.value = 'easyInput';
    studentEasyInput.value = '';
}

function execStudentEasyInput() {
    if (Array.isArray(students.value)) {
        students.value?.push(...(studentEasyInput.value?.split(/\n/g).map<Student>((e, i) => ({ studentId: (i + (students.value?.length ?? 0) + 1), name: e })) || []));
    }
    modalState.value = null;
}
// StudentEasyInput END

// CSVUpload START
function downloadCSV() {
    if (process.client) {
        const a = document.createElement('a');
        a.download = 'csvTemplate.csv';
        a.href = '/static/csvTemplate.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
    }
}
function importFromCSV() {
    if (process.client) {
        const file = document.createElement('input');
        file.type = 'file';
        file.accept = 'text/csv';
        file.style.display = 'none';
        file.addEventListener('change', (ev) => {
            if (!ev.target) {
                return;
            }
            //@ts-ignore
            const file = ev.target.files as FileList;
            const reader = new FileReader();
            try {
                reader.readAsText(file[0]);
                reader.addEventListener('load', (ev) => {
                    const result = ev.target?.result;

                    if (typeof result === 'string') {
                        const rawStudents = result.split(/\n/g);

                        if (rawStudents[0].match(/^(")*出席番号/)) {
                            rawStudents.shift();
                        }

                        const parsedStudents = rawStudents.filter((v) => v.includes(',')).map<Student>((v) => {
                            let parsedStudent = v.split(",");
                            let seat: Seat | undefined = undefined;
                            //@ts-ignore
                            parsedStudent = parsedStudent.map((e) => e.match(/^"(.*)"$/) !== null ? e.match(/^"(.*)"$/)[1] : e);

                            switch (parsedStudent[3]?.toUpperCase() ?? '') {
                                case 'L':
                                    parsedStudent[3] = 'left';
                                    break;
                                case 'R':
                                    parsedStudent[3] = 'right';
                                    break;
                                default:
                                    parsedStudent[3] = '';
                            }

                            switch (parsedStudent[4]?.toUpperCase() ?? '') {
                                case 'F':
                                    parsedStudent[4] = 'front';
                                    break;
                                case 'R':
                                    parsedStudent[4] = 'rear';
                                    break;
                                default:
                                    parsedStudent[4] = '';
                            }

                            if (parsedStudent[5].includes('_')) {
                                let p = parsedStudent[5].split('_');
                                seat = {
                                    col: (parseInt(p[0]) - 1),
                                    row: (parseInt(p[1]) - 1),
                                };
                            }

                            return {
                                studentId: parseInt(parsedStudent[0]),
                                name: parsedStudent[1] == '' ? undefined : parsedStudent[1],
                                furigana: parsedStudent[2] == '' ? undefined : parsedStudent[2],
                                chooseOptions: {
                                    x: parsedStudent[3] == '' ? undefined : parsedStudent[3],
                                    y: parsedStudent[4] == '' ? undefined : parsedStudent[4],
                                },
                                seat,
                            } as Student;
                        });

                        students.value.push(...parsedStudents);
                    } else {
                        alert("CSVの読み込み中にエラーが発生しました。");
                    }
                });
            } catch (e) {
                alert("CSVの読み込み中にエラーが発生しました。");
            }
        });
        document.body.appendChild(file);
        file.click();
        file.remove();
    }

}
// CSVUpload END

// CSVDownload START
const toast = useToast();

function exportToCSV() {
    if (students.value.length == 0) {
        toast.add({
            id: 'add_students',
            title: 'メンバー情報がありません',
            description: 'メンバーを追加してからエクスポートしてください',
        });
        return;
    }
    if (process.client) {
        const stringified = students.value.map((e) => {
            let x = '', y = '';
            switch (e.chooseOptions?.x) {
                case 'left':
                    x = 'L';
                    break;
                case 'right':
                    x = 'R';
                    break;
                default:
                    x = '';
            }

            switch (e.chooseOptions?.y) {
                case 'front':
                    y = 'F';
                    break;
                case 'rear':
                    y = 'R';
                    break;
                default:
                    y = '';
            }

            return [
                e.studentId.toString(),
                e.name ?? '',
                e.furigana ?? '',
                x,
                y,
                (e.seat) ? [(e.seat.col + 1), (e.seat.row + 1)].join('_') : '',
            ].map((f) => `"${f}"`).join(',');
        });

        stringified.unshift('出席番号,名前,ふりがな,"左右の希望（L または R で記入。L＝左, R＝右）","前後の希望（F または R で記入。F＝前, R＝後ろ）",座席指定（左からn番目・前からm番目のとき→[n_m]のようにアンダーバーで区切る）');

        downloadCSVFile(stringified.join('\r\n'), 'sekigae.csv');
    }
}

function downloadCSVFile(content: string, filename: string) {
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const blob = new Blob([bom, content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = filename;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    a.remove();
}
// CSVDownload END

// StudentEdit START
const currentEditObject = ref<Student>();
const currentEditId = ref<number>();
let currentEditIndex: number;
const enableFixedPosition = ref<boolean>(false);
const enableCondition = ref<boolean>(false);

watch(enableFixedPosition, (to) => {
    if (!currentEditObject.value) {
        return;
    }

    if (to && !currentEditObject.value.seat) {
        currentEditObject.value.seat = {
            row: 0,
            col: 0,
        };
    } else if (!to) {
        currentEditObject.value.seat = undefined;
    }
});

watch(enableCondition, (to) => {
    if (!currentEditObject.value) {
        return;
    }

    if (to && !currentEditObject.value.chooseOptions) {
        currentEditObject.value.chooseOptions = {
            x: null,
            y: null,
        };
    } else if (!to) {
        currentEditObject.value.chooseOptions = undefined;
    }
});

function studentEditSeatHandler(position: Seat) {
    if (!currentEditObject.value) {
        return;
    }
    currentEditObject.value.seat = position;
}

function openStudentEdit(id?: number) {
    if (id) {
        currentEditId.value = id;
        currentEditIndex = students.value?.findIndex((v) => v.studentId === id);
        currentEditObject.value = JSON.parse(JSON.stringify(students.value?.find((v) => v.studentId === id)));
        enableFixedPosition.value = (currentEditObject.value?.seat !== undefined);
        enableCondition.value = Object.values(currentEditObject.value?.chooseOptions ?? {}).some((e) => ['left', 'right', 'front', 'rear'].includes(e ?? ''));
    } else {
        currentEditObject.value = { studentId: students.value.length + 1 };
    }
    modalState.value = 'studentEdit';
}

function resetStudentEdit() {
    modalState.value = null;
    currentEditObject.value = { studentId: students.value.length + 1 };
    enableFixedPosition.value = false;
    enableCondition.value = false;
}

function saveStudentEdit() {
    if (currentEditObject.value === undefined) {
        return;
    }

    if (!currentEditId.value && students.value?.some((v) => v.studentId === currentEditObject.value?.studentId)) {
        alert("出席番号が重複しています");
        return;
    }

    if (!students.value) {
        students.value = [currentEditObject.value];
    } else {

        if (currentEditIndex >= 0) {
            students.value[currentEditIndex] = currentEditObject.value;
        } else {
            students.value.push(currentEditObject.value);
        }
    }

    modalState.value = null;
}

function delStudent(id: number) {
    const index = students.value?.findIndex((v) => v.studentId === id);

    if (index !== -1) {
        students.value.splice(index, 1);
    }
}
// StudentEdit END

const studentActionItems = (row: Student) => [
    [
        {
            label: '編集',
            icon: 'i-heroicons-pencil-square',
            click: () => { openStudentEdit(row.studentId); },
        },
        {
            label: '削除',
            icon: 'i-heroicons-trash',
            click: () => { delStudent(row.studentId); },
        }
    ],
];

// Sekigae START
const result = ref<Student[]>();
const resultForRendering = computed<(Student | null)[][]>(() => arrangeSeats(result.value ?? [], classroom.value));
const effect = ref<'none' | 'slot'>('none');
const effectState = ref<'beforeRun' | 'running' | 'done'>('beforeRun');
const slotSpinning = ref<boolean>(false);
function execSekigae() {
    if (students.value.length !== availableSeats.value) {
        toast.add({
            id: 'student_and_seats_unmatched',
            title: 'メンバー数と座席数が合いません',
            description: 'メンバー数と座席数を合わせてから実行してください',
        });
        return;
    }

    if (effectState.value === 'running') {
        return;
    }

    const copiedStudents = JSON.parse(JSON.stringify(students.value)) as Student[];
    const copiedClassroom = JSON.parse(JSON.stringify(classroom.value)) as Classroom;

    // slotを回すとなぜか配列がいじられてしまうのでJSONで保管
    const realResult = JSON.stringify(assignSeats(copiedStudents, copiedClassroom));

    if (effect.value === 'slot') {
        effectState.value = 'running';
        function spin() {
            result.value = assignSeats(copiedStudents, copiedClassroom, false);
            if (!slotSpinning.value) {
                if (slotSpeed <= 150) {
                    slotSpeed += 10;
                } else {
                    slotSpeed += 50;
                }
            }
            if (slotSpeed <= 800) {
                setTimeout(spin, slotSpeed);
            } else {
                result.value = JSON.parse(realResult);
                effectState.value = 'done';
            }
        }
        let slotSpeed: number = 50;
        slotSpinning.value = true;
        spin();
    } else if (effect.value = 'none') {
        result.value = JSON.parse(realResult);
        effectState.value = 'done';
    }
}
// Sekigae END

// PostSekigae START
function exportResultToCSV() {
    if (!result.value) {
        toast.add({
            id: 'csv_no_data',
            title: 'データがありません',
            description: '席替えを実施していない場合は実施してからダウンロードしてください',
        });

        return;
    }

    const out = result.value.map((e) => [
        e.studentId.toString(),
        e.name ?? '',
        e.furigana ?? '',
        (e.seat) ? (e.seat.row + 1) : '',
        (e.seat) ? (e.seat.col + 1) : '',
        (e.seat) ? getSeatNumber(e.seat, classroom.value).toString() : '',
        (e.seat) ? [(e.seat.col + 1), (e.seat.row + 1)].join('_') : '',
    ].map((f) => `"${f}"`).join(','));
    out.unshift('出席番号,名前,ふりがな,行,列,座席通し番号,座席指定(R_C)');
    downloadCSVFile(out.join('\r\n'), 'sekigaeResult.csv');
}
// PostSekigae END
</script>