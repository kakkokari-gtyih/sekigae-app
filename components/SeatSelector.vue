<template>
    <div class="w-full grid gap-1" :style="`grid-template-columns: repeat(${classroom.length}, 1fr)`">
        <div :style="`grid-column: 1 / ${classroom.length + 1}`" class="text-center p-1">
            <UIcon name="i-heroicons-arrow-small-up" style="height: 1em; width: 1em; vertical-align: -.125em;" />
            前
            <UIcon name="i-heroicons-arrow-small-up" style="height: 1em; width: 1em; vertical-align: -.125em;" />
        </div>
        <div v-for="row, i in classroom" class="space-y-1">
            <template v-for="seat, j in row">
                <button v-if="seat && !isPreservedSeat({ row: i, col: j })"
                    :class="['block w-full h-[30px] p-3', (selectedSeat && selectedSeat.row === i && selectedSeat.col === j) ? 'bg-red-200 dark:bg-red-700' : 'bg-yellow-200 dark:bg-yellow-600']"
                    @click="selectedSeat = { row: i, col: j }">
                </button>
                <div v-else-if="isPreservedSeat({ row: i, col: j })" class="h-[30px] leading-[30px] text-center font-bold bg-gray-800 dark:bg-gray-400 text-white dark:text-black">
                    確保
                </div>
                <div v-else class="h-[30px] p-3 bg-gray-200 dark:bg-gray-800">
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Classroom, Seat } from '../lib/sekigae';

const props = defineProps<{
    classroom: Classroom;
    disabledSeats?: Seat[];
    initial?: Seat;
}>();

const emit = defineEmits<{
    (event: 'change', position: Seat): void;
}>();

const selectedSeat = ref<Seat>();
let realInitial: Seat;

if (props.initial) {
    selectedSeat.value = props.initial;
    realInitial = props.initial;
}

function isPreservedSeat(current: Seat): boolean {
    if (!props.disabledSeats) {
        return false;
    }

    const cols = props.disabledSeats.map((v) => v.col);
    const rows = props.disabledSeats.map((v) => v.row);
    return (cols.includes(current.col) && rows.includes(current.row)) && !(realInitial?.col === current.col && realInitial?.row === current.row);
}

watch(selectedSeat, (to) => {
    if (!to) {
        return;
    }
    emit('change', to);
});

</script>

<style scoped></style>