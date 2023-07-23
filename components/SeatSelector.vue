<template>
    <div class="w-full grid gap-1" :style="`grid-template-columns: repeat(${classroom.length}, 1fr)`">
        <div :style="`grid-column: 1 / ${classroom.length + 1}`" class="text-center p-1">
            <UIcon name="i-heroicons-arrow-small-up" style="height: 1em; width: 1em; vertical-align: -.125em;" />
            前
            <UIcon name="i-heroicons-arrow-small-up" style="height: 1em; width: 1em; vertical-align: -.125em;" />
        </div>
        <div v-for="row, i in classroom" class="space-y-1">
            <template v-for="seat, j in row">
                <button v-if="seat"
                    :class="['block w-full min-h-[30px] p-3', (selectedSeat && selectedSeat.row === i && selectedSeat.col === j) ? 'bg-red-200 dark:bg-red-700' : 'bg-yellow-200 dark:bg-yellow-600']"
                    @click="selectedSeat = { row: i, col: j }">
                </button>
                <div v-else class="min-h-[30px] p-3 bg-gray-200 dark:bg-gray-800">
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Classroom, Seat } from '../lib/sekigae';

const props = defineProps<{
    classroom: Classroom;
    initial?: Seat;
}>();

const emit = defineEmits<{
    (event: 'change', position: Seat): void;
}>();

const selectedSeat = ref<Seat>();

if (props.initial) {
    selectedSeat.value = props.initial;
}

watch(selectedSeat, (to) => {
    if (!to) {
        return;
    }
    emit('change', to);
});

</script>

<style scoped></style>