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
        <div    
            class="grid gap-1"
            :style="[showRowCol ? 'grid-area: 3/2/4/3;' : 'grid-area: 2/1/3/2;', `grid-template-columns: repeat(${classroom.length}, 1fr);`]"
        >
            <div
                v-if="seats"
                v-for="row, rowIndex in seats"
                ref="dragger"
                :data-index="rowIndex"
                class="grid gap-1"
                :style="`grid-template-rows: repeat(${classroom[0].length}, 1fr)`"
            >
                <template v-for="seat, colIndex in row">
                    <div v-if="seat != null" :key="`seat-${seat.studentId}`" :class="['relative font-bold flex flex-col justify-center text-gray-900 bg-yellow-200 dark:bg-yellow-600', lg ? 'h-[100px]' : 'h-[60px]']">
                        <template v-if="seat.name">
                            <div class="absolute top-0 left-0 bg-yellow-400 text-center font-bold rounded-br-md" :class="lg ? 'w-10 text-xl 2xl:text-2xl' : 'w-7 text-base hidden md:block'">{{ seat.studentId }}</div>
                            <div v-if="seat.furigana" class="text-center" :class="lg ? 'text-base 2xl:text-xl' : 'text-xs'">{{ seat.furigana }}</div>
                            <div class="text-center" :class="lg ? 'lg:text-3xl xl:text-4xl 2xl:text-[2.75rem] 2xl:leading-[3rem]' : 'text-lg lg:text-xl xl:text-2xl'">{{ seat.name }}</div>
                        </template>
                        <div v-else class="text-center" :class="lg ? 'lg:text-3xl xl:text-4xl 2xl:text-[2.75rem] 2xl:leading-[3rem]' : 'text-lg lg:text-xl xl:text-2xl'">
                            {{ seat.studentId }}
                        </div>
                    </div>
                    <div v-else :key="`empty-seat-${rowIndex}-${colIndex}`" :class="['relative font-bold flex flex-col justify-center text-gray-900 select-none bg-gray-200 dark:bg-gray-800 no-drag', lg ? 'h-[100px]' : 'h-[60px]']">

                    </div>
                </template>
            </div>
            <div    
                v-else
                v-for="row, rowIndex in classroom"
                class="grid gap-1"
                :style="`grid-template-rows: repeat(${classroom[0].length}, 1fr)`"
            >
                <div v-for="col, colIndex in row" :key="`placeholder-row-${rowIndex}`">
                    <div :key="`placeholder-seat-${rowIndex}-${colIndex}`" class="relative font-bold flex flex-col justify-center text-gray-900 select-none bg-gray-200 dark:bg-gray-800" :class="lg ? 'h-[100px]' : 'h-[60px]'"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { swap, updateConfig } from '@formkit/drag-and-drop';
import { dragAndDrop } from '@formkit/drag-and-drop/vue';
import type { Classroom, ClassroomWithStudents } from '@/lib/sekigae';

const props = withDefaults(defineProps<{
    classroom: Classroom;
    lg?: boolean;
    showRowCol?: boolean;
    editable?: boolean;
}>(), {
    lg: false,
    showRowCol: false,
    editable: false,
});

const seats = defineModel<ClassroomWithStudents | undefined>({
    required: true,
    set: (to) => {
        if (to == null) return to;

        // row, colを編集してから返す
        to.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                if (col == null) return;
                if (col.seat == null) {
                    col.seat = {
                        row: rowIndex,
                        col: colIndex,
                    };
                } else {
                    col.seat.row = rowIndex;
                    col.seat.col = colIndex;
                }
            });
        });

        return to;
    },
});

const refEdSeats = computed({
    get: () => {
        if (seats.value == null) return undefined;
        return seats.value.map((v) => toRef(v.filter((va) => va != null)));
    },
    set: (to) => {
        if (to == null) {
            seats.value = undefined;
        } else {
            seats.value = to.map((v, i) => props.classroom[i].map((f, j) => f ? v.value[j] : null));
        }
    },
});

const { locale } = useI18n();

const draggers = useTemplateRef<HTMLDivElement[]>('dragger');

function initDrag() {
    if (refEdSeats.value != null && draggers.value && Array.isArray(draggers.value)) {
        draggers.value.forEach((dragger) => {
            const rowIndex = dragger.dataset.index ? parseInt(dragger.dataset.index) : null;
            if (rowIndex == null) return;
            dragAndDrop({
                parent: dragger,
                values: refEdSeats.value![rowIndex],
                group: 'seats',
                draggable: (el) => {
                    return !el.classList.contains('no-drag');
                },
                plugins: [
                    swap(),
                ],
            })
        });
    }
}

watch(() => props.editable, (to) => {
    draggers.value?.forEach((dragger) => {
        updateConfig(dragger, { disabled: !to });
    });
});

watch(seats, () => {
    nextTick(() => {
        initDrag();
    });
});

watch(() => props.classroom, () => {
    seats.value = undefined;
    initDrag();
}, { deep: true });

onMounted(() => {
    if (import.meta.client) {
        initDrag();
    }
});

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