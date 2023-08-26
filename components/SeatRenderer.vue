<template>
    <div class="w-full grid gap-1" :style="`grid-template-columns: ${showRowCol ? 'auto 1fr' : '1fr'}; grid-template-rows: repeat(${showRowCol ? '3' : '2'}, auto)`">
        <div :style="`grid-column: ${showRowCol ? '2' : '1'}`" class="text-center font-bold p-1" :class="lg ? 'text-3xl' : 'text-xl'">
            <UIcon name="i-heroicons-arrow-small-up" style="height: 1em; width: 1em; vertical-align: -.125em;" />
            {{ $t('seatSelector.front') }}
            <UIcon name="i-heroicons-arrow-small-up" style="height: 1em; width: 1em; vertical-align: -.125em;" />
        </div>
        <div v-if="showRowCol" class="space-y-1 grid grid-cols-1 h-full" style="grid-area: 3/1/4/2">
            <div v-for="seat, i in classroom[0]" class="relative flex after:border-transparent after:border-l-sky-200 dark:after:border-l-sky-800" :class="lg ? 'after:border-y-[50px] after:border-l-[30px]' : 'after:border-y-[30px] after:border-l-[20px]'">
                <div class="bg-sky-200 dark:bg-sky-800 pl-1 rounded-l-lg text-center font-bold" :class="lg ? 'text-2xl' : ''" style="writing-mode: vertical-rl;">
                    <template v-if="locale === 'ja'">
                        <span style="writing-mode: horizontal-tb; line-height: 1.1;">{{ i + 1 }}</span>席
                    </template>
                    <template v-else>
                        {{ $t('seatSelector.row', { row: (i + 1) }) }}
                    </template>
                </div>
            </div>
        </div>
        <div v-if="showRowCol" class="grid space-x-1" style="grid-area: 2/2/3/3;" :style="`grid-template-columns: repeat(${classroom.length}, 1fr);`">
            <div v-for="row, i in classroom" class="relative flex flex-col items-center after:h-full after:border-transparent after:border-t-sky-200 dark:after:border-t-sky-800 after:border-t-[16px]" :class="lg ? 'after:w-[60px] after:border-x-[30px]' : 'after:w-[40px] after:border-x-[20px]'">
                <div class="w-full text-center p-1 font-bold rounded-lg bg-sky-200 dark:bg-sky-800" :class="lg ? 'text-2xl py-2' : ''">
                    {{ $t('seatSelector.col', { col: getAlphabetCode(i + 1) }) }}
                </div>
            </div>
        </div>
        <div v-if="!editable || !realSeats" class="grid gap-1 grid-flow-col" :style="[showRowCol ? 'grid-area: 3/2/4/3;' : 'grid-area: 2/1/3/2;', `grid-template-columns: repeat(${classroom.length}, 1fr); grid-template-rows: repeat(${classroom[0].length}, 1fr)`]">
            <div v-if="realSeats" v-for="seat in realSeats" :class="['relative font-bold flex flex-col justify-center text-gray-900', (seat && Number.isInteger(seat?.studentId)) ? 'bg-yellow-200 dark:bg-yellow-600': 'bg-gray-200 dark:bg-gray-700', lg ? 'h-[100px]' : 'h-[60px]']">
                <template v-if="(seat !== null) && Number.isInteger(seat?.studentId)">
                    <template v-if="seat?.name">
                        <div class="absolute top-0 left-0 bg-yellow-400 text-center font-bold rounded-br-md" :class="lg ? 'w-10 text-xl 2xl:text-2xl' : 'w-7 text-base hidden md:block'">{{ seat?.studentId }}</div>
                        <div v-if="seat?.furigana" class="text-center" :class="lg ? 'text-base 2xl:text-xl' : 'text-xs'">{{ seat?.furigana }}</div>
                        <div class="text-center" :class="lg ? 'lg:text-3xl xl:text-4xl 2xl:text-[2.75rem] 2xl:leading-[3rem]' : 'text-lg lg:text-xl xl:text-2xl'">{{ seat?.name }}</div>
                    </template>
                    <div v-else class="text-center" :class="lg ? 'lg:text-3xl xl:text-4xl 2xl:text-[2.75rem] 2xl:leading-[3rem]' : 'text-lg lg:text-xl xl:text-2xl'">
                        {{ seat?.studentId }}
                    </div>
                </template>
            </div>
            <div v-else v-for="n of classroom.reduce((p, c) => p + c.length, 0)" :class="['relative font-bold flex flex-col justify-center text-gray-900 select-none', 'bg-gray-200 dark:bg-gray-800', lg ? 'h-[100px]' : 'h-[60px]']">

            </div>
        </div>
        <Draggable
            v-else-if="realSeats"
            :list="realSeats"
            handle=".draggable"
            direction="horizontal"
            @change="onDraggerChanges"
            item-key="studentId"
            class="grid gap-1 grid-flow-col"
            :style="[showRowCol ? 'grid-area: 3/2/4/3;' : 'grid-area: 2/1/3/2;', `grid-template-columns: repeat(${classroom.length}, 1fr); grid-template-rows: repeat(${classroom[0].length}, 1fr)`]"
            :animation="150"
            @start="(e) => e.item.classList.add('active')"
            @end="(e) => e.item.classList.remove('active')"
        >
            <template #item="{ element, index }">
                <div :class="['relative font-bold flex flex-col justify-center text-gray-900 select-none', (element && Number.isInteger(element.studentId)) ? 'draggable bg-yellow-200 dark:bg-yellow-600': 'bg-gray-200 dark:bg-gray-800', lg ? 'h-[100px]' : 'h-[60px]']">
                    <template v-if="element !== null && Number.isInteger(element.studentId)">
                        <template v-if="element.name">
                            <div class="absolute top-0 left-0 bg-yellow-400 text-center font-bold rounded-br-md" :class="lg ? 'w-10 text-xl 2xl:text-2xl' : 'w-7 text-base hidden md:block'">{{ element.studentId }}</div>
                            <div v-if="element.furigana" class="text-center" :class="lg ? 'text-base 2xl:text-xl' : 'text-xs'">{{ element.furigana }}</div>
                            <div class="text-center" :class="lg ? 'lg:text-3xl xl:text-4xl 2xl:text-[2.75rem] 2xl:leading-[3rem]' : 'text-lg lg:text-xl xl:text-2xl'">
                                {{ element.name }}
                            </div>
                        </template>
                        <div v-else class="text-center" :class="lg ? 'lg:text-3xl xl:text-4xl 2xl:text-[2.75rem] 2xl:leading-[3rem]' : 'text-lg lg:text-xl xl:text-2xl'">
                            {{ element.studentId }}
                        </div>
                    </template>
                </div>
            </template>

        </Draggable>
    </div>
</template>

<script setup lang="ts">
import { arrangeSeats, Classroom, ClassroomWithStudents, Student } from '../lib/sekigae';
import Draggable from 'vuedraggable';

const props = withDefaults(defineProps<{
    classroom: Classroom;
    seats?: ClassroomWithStudents;
    lg?: boolean;
    showRowCol?: boolean;
    editable?: boolean;
}>(), {
    seats: undefined,
    lg: false,
    showRowCol: false,
    editable: false,
});
const emits = defineEmits<{
    (event: 'changeSeat', to: ClassroomWithStudents | undefined): void;
}>();
const { locale } = useI18n();

function getSeatsForDragger(seats?: ClassroomWithStudents): (Student | { studentId: number; })[] {
    if (!seats) {
        return new Array(props.classroom.length * props.classroom[0].length).fill({ studentId: (Math.random() / 10) + 0.1 });
    }
    // 座席無しの部分は必ず小数の乱数とする
    return seats.map((e, i) => e.map((f) => f ? f : { studentId: (Math.random() / 10) + 0.1 })).flat();
}

function getSeats(draggerSeats?: (Student | { studentId: number; })[]): ClassroomWithStudents {
    const refreshedStudents = draggerSeats?.map((e, i) => {
        // 座席無しの部分は必ず小数の乱数とする
        if (!Number.isInteger(e.studentId)) {
            return null;
        }
        e.seat.col = i % props.classroom[0].length;
        e.seat.row = Math.floor(i / props.classroom[0].length);
        return e;
    }).filter((f) => f != null);
    console.log({ refreshedStudents });
    return arrangeSeats(refreshedStudents as Student[], props.classroom);
}

const realSeats = ref<(Student | { studentId: number; })[] | undefined>(getSeatsForDragger(props?.seats));

watch(() => props.seats, (to) => {
    console.log({ to });
    if (!to) {
        realSeats.value = undefined;
    } else {
        realSeats.value = getSeatsForDragger(to);
    }
});

watch(() => props.classroom, () => {
    realSeats.value = undefined;
}, {
    deep: true,
});

function onDraggerChanges() {
    if (!props.editable) {
        return;
    } else if (!realSeats.value) {
        emits('changeSeat', undefined);
    }
    emits('changeSeat', getSeats(realSeats.value));
}

function getAlphabetCode(numeric_col_index: number): string {
    const RADIX = 26;
    const A = 'A'.charCodeAt(0);
    let n = numeric_col_index;
    let s = "";
    while (n >= 1) {
        n--;
        s = String.fromCharCode(A + (n % RADIX)) + s;
        n = Math.floor(n / RADIX);
    }
    return s;
}
</script>

<style scoped>
.draggable {
    @apply cursor-grab active:cursor-grabbing;
}
</style>