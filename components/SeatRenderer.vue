<template>
    <div class="w-full grid gap-1" :style="`grid-template-columns: repeat(${classroom.length}, 1fr)`">
        <div :style="`grid-column: 1 / ${classroom.length + 1}`" class="text-center font-bold p-1" :class="lg ? 'text-3xl' : 'text-xl'">
            <UIcon name="i-heroicons-arrow-small-up" style="height: 1em; width: 1em; vertical-align: -.125em;" />
            前
            <UIcon name="i-heroicons-arrow-small-up" style="height: 1em; width: 1em; vertical-align: -.125em;" />
        </div>
        <div v-for="row, i in classroom" class="space-y-1">
            <template v-for="seat, j in row">
                <div :class="['relative font-bold flex flex-col justify-center', (seats && seats[i][j]) ? 'bg-yellow-200 dark:bg-yellow-600': 'bg-gray-200 dark:bg-gray-800', lg ? 'min-h-[100px]' : 'min-h-[60px]']">
                    <template v-if="seats && seats[i][j]">
                        <template v-if="seats[i][j].name">
                            <div class="absolute top-0 left-0 bg-yellow-400 text-center font-bold rounded-br-md" :class="lg ? 'w-10 text-xl' : 'w-7 text-base'">{{ seats[i][j].studentId }}</div>
                            <div v-if="seats[i][j].furigana" class="text-center" :class="lg ? 'text-base' : 'text-xs'">{{ seats[i][j].furigana }}</div>
                            <div class="text-center" :class="lg ? 'text-4xl' : 'text-2xl'">{{ seats[i][j].name }}</div>
                        </template>
                        <div v-else class="text-center" :class="lg ? 'text-4xl' : 'text-2xl'">
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

const props = withDefaults(defineProps<{
    classroom: Classroom;
    seats?: Student[][];
    lg?: boolean;
}>(), {
    lg: false,
});
</script>

<style scoped></style>