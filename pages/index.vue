<template>
    <div>
        <UContainer class="relative mt-5 space-y-6">
            <div :class="['fixed top-0 left-0 w-screen h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200 z-[300] flex items-center transition-opacity duration-300', {'opacity-0 pointer-events-none': isMounted}]">
                <div class="w-full text-center font-bold text-2xl">
                    <div class="flex justify-center mb-5">
                        <div class="animate-spin h-10 w-10 border-4 border-primary-500 rounded-full border-t-transparent"></div>
                    </div>
                    読み込み中…
                </div>
            </div>
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-200">
                高機能席替えアプリ
            </h1>
            <p>座席位置の希望（固定・前方/後方/左右）をかなえる席替えが可能です。</p>

            <UTabs :items="settingsTab" :default-index="0" v-model="settingsTabIndex">
                <template #classroom>
                    <UCard class="flex flex-col flex-1 overflow-y-auto">
                        <div class="mb-4">
                            <p class="text-lg"><b>{{ classroom[0].length }}</b> 列 × <b>{{ classroom.length }}</b> 行&emsp;選択済み: <b>{{ availableSeats }}</b> 席 （生徒数: <b>{{ students.length }}</b> 人）</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">教室のタテ・ヨコの机の数と合わせたあと、存在しない席を選択して灰色にしてください。</p>
                        </div>
                        <div class="w-full grid gap-1" :style="`grid-template-columns: auto repeat(${classroom.length}, 1fr) auto`">
                            <div :style="`grid-column: 1 / ${classroom.length + 3}`" class="text-center text-lg font-bold p-1">
                                <UIcon name="i-heroicons-arrow-small-up"
                                    style="height: 1em; width: 1em; vertical-align: -.125em;" />
                                前
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
                                    行を追加
                                </UButton>
                            </div>
                            <UButton :block="true" icon="i-heroicons-plus" :style="`grid-column: 2 / ${classroom.length + 2}`"
                                @click="addCol()">
                                列を追加
                            </UButton>
                        </div>
                    </UCard>
                </template>

                <template #students>
                    <UCard class="flex flex-col flex-1 overflow-y-auto">
                        <div class="flex items-center mb-4">
                            <div>
                                <p class="text-lg">座席数 <b>{{ availableSeats }}</b> 席に対して、現在の人数 <b>{{ students.length }}</b> 人</p>
                                <p class="text-sm text-gray-500 dark:text-gray-400">右側の「メンバーの追加」から席替えするメンバーを登録するか、メンバー一覧のCSVデータをインポートしてください。</p>
                                <p class="text-sm text-gray-500 dark:text-gray-400">このプログラムはブラウザ上で動作が完結しているため、入力したデータがインターネット上に出ることはありません。</p>
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
                        <UTable
                            :columns="[
                                { key: 'studentId', label: '出席番号' },
                                { key: 'name', label: '名前' },
                                { key: 'fixed', label: '固定配置' },
                                { key: 'condition', label: '優先配置' },
                                { key: 'actions' },
                            ]"
                            :rows="students"
                            :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: '読み込み中…' }"
                            :loading="isUploadingCSV"
                            :ui="{
                                th: { size: 'text-base' },
                                td: { size: 'text-base' },
                            }">
                            <template #empty-state>
                                <div class="flex flex-col items-center justify-center py-6 space-y-3">
                                    <p class="text-sm text-center">
                                        メンバーが誰も追加されていません。
                                    </p>
                                    <div class="flex space-x-2">
                                        <UButton icon="i-heroicons-user-plus" label="メンバーの追加" @click="openStudentEdit()" />
                                        <UButton icon="i-heroicons-arrow-up-tray" color="gray" label="CSVインポート" @click="importFromCSV()" />
                                    </div>
                                    <p class="text-xs text-center">
                                        <button class="text-primary-500 font-medium border-b border-b-transparent hover:border-b-primary-500 focus:border-b-primary-500" @click="downloadCSV()">CSVのひな型をダウンロード</button>
                                    </p>
                                </div>
                            </template>
                            <template #fixed-data="{ row }" class="w-auto">
                                <div :class="row.seat !== undefined && 'font-bold'">
                                    {{ row.seat !== undefined ? 'あり' : 'なし' }}
                                </div>
                            </template>
                            <template #condition-data="{ row }" class="w-auto">
                                <!-- @vue-ignore -->
                                <div :class="Object.values(row?.chooseOptions ?? {}).some((e) => ['left', 'right', 'front', 'rear'].includes(e ?? '')) && 'font-bold'">
                                    <!-- @vue-ignore -->
                                    {{ Object.values(row?.chooseOptions ?? {}).some((e) => ['left', 'right', 'front', 'rear'].includes(e ?? '')) ? 'あり' : 'なし' }}
                                </div>
                            </template>
                            <template #actions-data="{ row }" class="w-auto">
                                <UDropdown :items="studentActionItems(row)">
                                    <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                                </UDropdown>
                            </template>
                        </UTable>
                    </UCard>
                </template>

                <template #exec>
                    <UCard>
                        <div class="mb-4">
                            <template v-if="availableSeats === students.length">
                                <p class="text-lg font-bold text-primary-500">席替えを実行できます。</p>
                                <p class="text-sm text-gray-500 dark:text-gray-400">演出エフェクトを選んで、「席替え実施」をクリックしてください。「全画面表示」はスクリーンへの投影などに便利です。</p>
                                <p class="text-sm text-gray-500 dark:text-gray-400">席替え実施後、座席をドラッグアンドドロップすることで並べ替えが可能です。並べ替えたデータはCSVでの出力データにも反映されます。</p>
                            </template>
                            <template v-else>
                                <p class="text-lg font-bold text-red-700">席替えを実行できません。</p>
                                <p class="text-sm text-gray-500 dark:text-gray-400">座席数とメンバーの人数を合致させてください。</p>
                            </template>
                        </div>
                        <div ref="sekigaeResultView" class="flex flex-col flex-1 overflow-y-auto p-1 bg-white dark:bg-slate-950" :class="isFullScreen && 'p-6 justify-center'">
                            <div class="mb-4 flex space-x-2 justify-center">
                                <USelect icon="i-heroicons-sparkles-solid" v-model="effect" option-attribute="name" :disabled="effectState === 'running'"
                                    :options="[{ name: 'エフェクトなし', value: 'none' }, { name: 'スロット', value: 'slot' }, { name: 'カウントダウン', value: 'timer' }]" />
                                <UButton color="primary" variant="solid" label="席替え実施" icon="i-heroicons-play" :disabled="effectState === 'running'"
                                    @click="execSekigae()" />
                                <div class="border-l"></div>
                                <UButton color="white" :icon="isFullScreen ? 'i-heroicons-arrows-pointing-in' : 'i-heroicons-arrows-pointing-out'" :label="isFullScreen ? '全画面表示を解除' : '全画面表示'" @click="toggleFullScreen()" />
                                <UPopover>
                                    <UButton color="white" label="その他のオプション" trailing-icon="i-heroicons-chevron-down-20-solid" />

                                    <template #panel>
                                        <UCard>
                                            <div class="space-y-2">
                                                <UCheckbox v-model="seatRendererOptions.showRowCol" name="showRowCol" label="座席位置（席番号）表示" />
                                                <UCheckbox v-model="seatRendererOptions.disableEditing" name="editable" label="ドラッグアンドドロップ無効" />
                                            </div>
                                        </UCard>
                                    </template>
                                </UPopover>
                            </div>
                            <div class="relative mb-4" :class="isFullScreen ? 'overflow-y-auto' : 'overflow-hidden'">
                                <LazySeatRenderer
                                    id="seats"
                                    :classroom="classroom"
                                    :seats="resultForRendering"
                                    :show-row-col="seatRendererOptions.showRowCol"
                                    :lg="isFullScreen"
                                    :editable="effectState === 'done' && !seatRendererOptions.disableEditing"
                                    @change-seat="changeSeatHandler"
                                ></LazySeatRenderer>
                                <div v-for="n of 3" :class="['absolute z-10 text-5xl lg:text-9xl font-bold top-1/2 left-1/2 opacity-0 text-red-500 select-none pointer-events-none', timerCount === n && $style.countAnim]">{{ n }}</div>
                            </div>
                            <div class="flex space-x-2 justify-center">
                                <UButton v-if="effect === 'slot' && effectState !== 'done'" color="primary" size="lg" variant="solid"
                                    label="ストップ！" :disabled="!slotSpinning" @click="slotSpinning = false" />
                                <template v-else-if="effectState === 'done'">
                                    <UButton color="white" label="CSVでダウンロード" icon="i-heroicons-arrow-down-tray" @click="exportResultToCSV()" />
                                </template>
                            </div>
                            <UNotifications v-if="isFullScreen" />
                        </div>
                    </UCard>
                </template>
            
            </UTabs>

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
                        <div v-if="enableFixedPosition" class="pb-2">
                            <SeatSelector :classroom="classroom" :initial="currentEditObject.seat" :disabled-seats="manuallySelectedSeats"
                                @change="studentEditSeatHandler" />
                            <div class="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                このメンバーを配置する席を、座席表からクリックして選択してください。<br>
                                【確保】となっている場合は、すでに他のメンバーが座席指定をしているため選択できません。
                            </div>
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
                    <UFormGroup name="students" label="メンバーの名前（一人ずつ改行で入力）" :ui="{ help: 'mt-2 text-sm text-gray-500 dark:text-gray-400' }" help="すでにメンバーが居る場合は、その出席番号に続けて末尾に挿入されます。">
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

<style module>
.countAnim :global {
    animation-name: count-anim;
    animation-duration: 950ms;
    animation-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1);
    animation-fill-mode: forwards;
    animation-iteration-count: 1;
}

@keyframes :global(count-anim) {
    0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(3);
    }
    50% {
        opacity: 1;
    }
    100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(1);
    }
}
</style>

<script setup lang="ts">
import type { Classroom, ClassroomWithStudents, Student, Seat } from '@/lib/sekigae';
import { arrangeSeats, assignSeats, getSeatNumber, extractStudentsFromSeats } from '@/lib/sekigae';

const isMounted = ref<boolean>(false);
onMounted(() => {
    isMounted.value = true;
})

const settingsTab = [
    {
        slot: 'classroom',
        label: '①座席の配置'
    },
    {
        slot: 'students',
        label: '②メンバーの情報'
    },
    {
        slot: 'exec',
        label: '③席替え実行'
    }
];
const settingsTabIndex = ref<number>();

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
const manuallySelectedSeats = computed<Seat[]>(() => students.value.map((e) => e.seat ? e.seat : null).filter<Seat>((e) => e !== null));

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
const isUploadingCSV = ref<boolean>(false);

function downloadCSV() {
    if (process.client) {
        const a = document.createElement('a');
        a.download = 'csvTemplate.csv';
        a.href = '/static/csvTemplate.csv';
        a.target = '_blank';
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
            isUploadingCSV.value = true;

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
                    isUploadingCSV.value = false;
                });
            } catch (e) {
                alert("CSVの読み込み中にエラーが発生しました。\nCSVを読み込めません。ファイル形式を確認してください。\n文字コードを「UTF-8」にして保存してください。");
                isUploadingCSV.value = false;
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

        stringified.unshift('出席番号,名前,ふりがな,"左右の希望（L または R で記入。L＝左, R＝右）","前後の希望（F または R で記入。F＝前, R＝後ろ）",座席指定（左からr番目・前からc番目のとき→[r_c]のようにアンダーバーで区切る）');

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
            row: null,
            col: null,
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
const resultForRendering = computed<ClassroomWithStudents | undefined>(() => result.value ? arrangeSeats(result.value, classroom.value) : undefined);
const seatRendererOptions = ref({
    showRowCol: false,
    disableEditing: false,
});
const effect = ref<'none' | 'slot' | 'timer'>('none');
const effectState = ref<'beforeRun' | 'running' | 'done'>('beforeRun');
const slotSpinning = ref<boolean>(false);
const timerCount = ref<number | null>(null);
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
    } else if (effect.value === 'timer') {
        result.value = undefined;
        effectState.value = 'running';
        timerCount.value = 4;
        function decl() {
            if (timerCount.value && timerCount.value > 1) {
                timerCount.value--;
                setTimeout(decl, 1000);
            } else {
                timerCount.value = 0;
                result.value = JSON.parse(realResult);
                effectState.value = 'done';
            }
        }
        decl();
    } else if (effect.value === 'none') {
        result.value = JSON.parse(realResult);
        effectState.value = 'done';
    }
}

function changeSeatHandler(to: ClassroomWithStudents): void {
    console.log('fired', to);
    result.value = extractStudentsFromSeats(to);
}

function calculateOptionProbability(students: Student[], classroom: Classroom, iterations: number): void {
    const totalStudents = students.length;
    const optionCounts: { [key: string]: number } = {};
    const randomOptionCounts: { [key: string]: number } = {};

    const studentsB = JSON.parse(JSON.stringify(students));
    const classroomB = JSON.parse(JSON.stringify(classroom));

    for (let i = 0; i < iterations; i++) {
        const assignedStudents = assignSeats(students, classroom);
        const randomStudents = assignSeats(studentsB, classroomB, false);
        console.log({assignedStudents, randomStudents});
        for (const student of assignedStudents) {
            const { chooseOptions, seat } = student;
            if (seat) {
                const seatOption = getSeatOption(classroom, seat?.row, seat?.col);
                const optionKey = JSON.stringify(chooseOptions);
                optionCounts[optionKey] = (optionCounts[optionKey] || 0);
                if (chooseOptions && seatOption && (!chooseOptions.x || chooseOptions.x === seatOption.x) && (!chooseOptions.y || chooseOptions.y === seatOption.y)) {
                    optionCounts[optionKey] = (optionCounts[optionKey] || 0) + 1;
                }
            }
        }
        for (const student of randomStudents) {
            const { chooseOptions, seat } = student;
            if (seat) {
                const seatOption = getSeatOption(classroom, seat?.row, seat?.col);
                const optionKey = JSON.stringify(chooseOptions);
                randomOptionCounts[optionKey] = (randomOptionCounts[optionKey] || 0);
                if (chooseOptions && seatOption && (!chooseOptions.x || chooseOptions.x === seatOption.x) && (!chooseOptions.y || chooseOptions.y === seatOption.y)) {
                    randomOptionCounts[optionKey] = (randomOptionCounts[optionKey] || 0) + 1;
                }
            }
        }
    }

    console.log('希望通りになる確率:');
    for (const optionKey in optionCounts) {
        const count = optionCounts[optionKey];
        const probability = count / (totalStudents * iterations);
        console.log(`${optionKey}: ${probability * 100}%`);
    }

    console.log('ランダム配置時に希望通りになる確率:');
    for (const optionKey in optionCounts) {
        const count = randomOptionCounts[optionKey];
        const probability = count / (totalStudents * iterations);
        console.log(`${optionKey}: ${probability * 100}%`);
    }

}

function getSeatOption(classroom: Classroom, row: number, col: number): Student['chooseOptions'] {
    const numRows = classroom.length - 1;
    const numCols = classroom[0].length - 1;
    const x = row < numRows / 2 ? 'left' : 'right';
    const y = col < numCols / 2 ? 'front' : 'rear';
    return { x, y };
}

if (process.client) {
    //@ts-ignore
    window.calcU = () => {
        const studentsA = JSON.parse(JSON.stringify(students.value));
        const classroomA = JSON.parse(JSON.stringify(classroom.value));
        calculateOptionProbability(studentsA, classroomA, 1000);
    };
}
// Sekigae END

// PostSekigae START
const sekigaeResultView = ref<HTMLElement>();

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
        e.chooseOptions.x ? e.chooseOptions.x.slice(0, 1).toUpperCase() : '',
        e.chooseOptions.y ? e.chooseOptions.y.slice(0, 1).toUpperCase() : '',
        '',
        (e.seat) ? [(e.seat.row + 1), (e.seat.col + 1)].join('_') : '',
        (e.seat) ? (e.seat.row + 1) : '',
        (e.seat) ? (e.seat.col + 1) : '',
        (e.seat) ? getSeatNumber(e.seat, classroom.value).toString() : '',
    ].map((f) => `"${f}"`).join(','));
    out.unshift('出席番号,名前,ふりがな,左右の希望,前後の希望,座席指定を流用する場合はこの列を削除,座席指定(R_C),行,列,座席通し番号');
    downloadCSVFile(out.join('\r\n'), 'sekigaeResult.csv');
}

const isFullScreen = ref<boolean>(false);
function resetFullScreenState() {
    if (!document.fullscreenElement) {
        isFullScreen.value = false;
    }
}

function toggleFullScreen() {
    if (process.client) {
        if (document.fullscreenElement) {
            document.exitFullscreen().then(() => {
                isFullScreen.value = false;
                document.removeEventListener('fullscreenchange', resetFullScreenState);
            });
        } else if(sekigaeResultView.value) {
            sekigaeResultView.value?.requestFullscreen().then(() => {
                isFullScreen.value = true;
                document.addEventListener('fullscreenchange', resetFullScreenState);
            });
        }
    }
}
// PostSekigae END
</script>