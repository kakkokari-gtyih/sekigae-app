<template>
    <div class="w-full grid gap-1" :style="`grid-template-columns: repeat(${classroom.length}, 1fr)`">
        <div :style="`grid-column: 1 / ${classroom.length + 1}`" class="text-center text-xl font-bold p-1">
            <UIcon name="i-heroicons-arrow-small-up" style="height: 1em; width: 1em; vertical-align: -.125em;" />
            前
            <UIcon name="i-heroicons-arrow-small-up" style="height: 1em; width: 1em; vertical-align: -.125em;" />
        </div>
        <div v-for="row, i in classroom" class="space-y-1">
            <template v-for="seat, j in row">
                <div :class="['min-h-[60px] relative font-bold flex flex-col justify-center', (seats && seats[i][j]) ? 'bg-yellow-200 dark:bg-yellow-600': 'bg-gray-200 dark:bg-gray-800']">
                    <template v-if="seats && seats[i][j]">
                        <template v-if="seats[i][j].name">
                            <div class="absolute top-0 left-0 bg-yellow-400 w-7 text-center font-bold rounded-br-md">{{ seats[i][j].studentId }}</div>
                            <div v-if="seats[i][j].furigana" class="text-xs text-center">{{ seats[i][j].furigana }}</div>
                            <div class="text-2xl text-center">{{ seats[i][j].name }}</div>
                        </template>
                        <div v-else class="text-2xl text-center">
                            {{ seats[i][j].studentId }}
                        </div>
                    </template>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Classroom, Student } from '../lib/sekigae';

const props = defineProps<{
    classroom: Classroom;
    seats?: Student[][];
}>();
</script>

<style scoped></style>