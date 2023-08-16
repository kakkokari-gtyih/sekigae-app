<template>
    <div class="w-full grid gap-1" :style="`grid-template-columns: ${showRowCol ? 'auto ' : ''}repeat(${classroom.length}, 1fr)`">
        <div :style="`grid-column: ${showRowCol ? '2' : '1'} / ${classroom.length + (showRowCol ? 2 : 1)}`" class="text-center font-bold p-1" :class="lg ? 'text-3xl' : 'text-xl'">
            <UIcon name="i-heroicons-arrow-small-up" style="height: 1em; width: 1em; vertical-align: -.125em;" />
            {{ $t('seatSelector.front') }}
            <UIcon name="i-heroicons-arrow-small-up" style="height: 1em; width: 1em; vertical-align: -.125em;" />
        </div>
        <div v-if="showRowCol" class="space-y-1 grid grid-cols-1 h-full">
            <div :class="lg ? 'h-16' : 'h-12'"></div>
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
        <div v-for="row, i in classroom" class="space-y-1">
            <div v-if="showRowCol" class="relative flex flex-col items-center after:h-full after:border-transparent after:border-t-sky-200 dark:after:border-t-sky-800 after:border-t-[16px]" :class="lg ? 'after:w-[60px] after:border-x-[30px]' : 'after:w-[40px] after:border-x-[20px]'">
                <div class="w-full text-center p-1 font-bold rounded-lg bg-sky-200 dark:bg-sky-800" :class="lg ? 'text-2xl py-2' : ''">
                    {{ $t('seatSelector.col', { col: getAlphabetCode(i + 1) }) }}
                </div>
            </div>
            <template v-if="!editable || !realSeats" v-for="seat, j in row">
                <div :class="['relative font-bold flex flex-col justify-center text-gray-900', (seats && seats[i][j] && Number.isInteger(seats[i][j]?.studentId)) ? 'bg-yellow-200 dark:bg-yellow-600': 'bg-gray-200 dark:bg-gray-700', lg ? 'h-[100px]' : 'h-[60px]']">
                    <template v-if="seats && (seats[i][j] !== null) && Number.isInteger(seats[i][j]?.studentId)">
                        <template v-if="seats[i][j]?.name">
                            <div class="absolute top-0 left-0 bg-yellow-400 text-center font-bold rounded-br-md" :class="lg ? 'w-10 text-xl 2xl:text-2xl' : 'w-7 text-base hidden md:block'">{{ seats[i][j]?.studentId }}</div>
                            <div v-if="seats[i][j]?.furigana" class="text-center" :class="lg ? 'text-base 2xl:text-xl' : 'text-xs'">{{ seats[i][j]?.furigana }}</div>
                            <div class="text-center" :class="lg ? 'lg:text-3xl xl:text-4xl 2xl:text-[2.75rem] 2xl:leading-[3rem]' : 'text-lg lg:text-xl xl:text-2xl'">{{ seats[i][j]?.name }}</div>
                        </template>
                        <div v-else class="text-center" :class="lg ? 'lg:text-3xl xl:text-4xl 2xl:text-[2.75rem] 2xl:leading-[3rem]' : 'text-lg lg:text-xl xl:text-2xl'">
                            {{ seats[i][j]?.studentId }}
                        </div>
                    </template>
                </div>
            </template>
            <Draggable
                v-else-if="realSeats"
                class="space-y-1"
                :list="realSeats[i]"
                handle=".draggable"
                @change="onDraggerChanges"
                group="seats"
                item-key="studentId"
            >
                <template #item="{ element }">
                    <div :class="['relative font-bold flex flex-col justify-center text-gray-900 select-none', (element && Number.isInteger(element.studentId)) ? 'draggable bg-yellow-200 dark:bg-yellow-600': 'bg-gray-200 dark:bg-gray-800', lg ? 'h-[100px]' : 'h-[60px]']">
                        <template v-if="element !== null && Number.isInteger(element.studentId)">
                            <template v-if="element.name">
                                <div class="absolute top-0 left-0 bg-yellow-400 text-center font-bold rounded-br-md" :class="lg ? 'w-10 text-xl 2xl:text-2xl' : 'w-7 text-base hidden md:block'">{{ element.studentId }}</div>
                                <div v-if="element.furigana" class="text-center" :class="lg ? 'text-base 2xl:text-xl' : 'text-xs'">{{ element.furigana }}</div>
                                <div class="text-center" :class="lg ? 'lg:text-3xl xl:text-4xl 2xl:text-[2.75rem] 2xl:leading-[3rem]' : 'text-lg lg:text-xl xl:text-2xl'">{{ element.name }}</div>
                            </template>
                            <div v-else class="text-center" :class="lg ? 'lg:text-3xl xl:text-4xl 2xl:text-[2.75rem] 2xl:leading-[3rem]' : 'text-lg lg:text-xl xl:text-2xl'">
                                {{ element.studentId }}
                            </div>
                        </template>
                    </div>
                </template>
            </Draggable>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Classroom, ClassroomWithStudents, Student } from '../lib/sekigae';
import Draggable from 'vuedraggable';

const props = withDefaults(defineProps<{
    classroom: Classroom;
    seats?: ClassroomWithStudents;
    lg?: boolean;
    showRowCol?: boolean;
    editable?: boolean;
}>(), {
    lg: false,
    showRowCol: false,
    editable: false,
});
const emits = defineEmits<{
    (event: 'changeSeat', to: ClassroomWithStudents): void;
}>();
const { locale } = useI18n();

function getRealSeats(seats: ClassroomWithStudents): (Student | { studentId: number; })[][] {
    if (!seats) {
        return undefined;
    }
    return seats.map((e, i) => e.map((f) => f ? f : { studentId: (Math.random() / 10) + 0.1 }))
}

const realSeats = ref<(Student | { studentId: number; })[][]>(getRealSeats(props.seats));
watch(() => props.seats, (to) => {
    if (!to) {
        realSeats.value = undefined;
    } else {
        realSeats.value = getRealSeats(to);
    }
});

function onDraggerChanges() {
    if (!props.editable || !realSeats.value) {
        return;
    }
    emits('changeSeat', realSeats.value.map((e, i) => e.map((f) => Number.isInteger(f.studentId) ? f : null).filter((f, j) => f != null || props.classroom[i][j] != undefined)));
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