<script setup>
const route = useRoute();
const isShownNav = ref(false);

function toggleNavigation() {
    isShownNav.value = !isShownNav.value;
}

</script>
<template>
    <div class="overflow-hidden">
        <GHeader @toggleNav="toggleNavigation()" />
        <main :class="['mainw transition-transform']">
            <slot></slot>
        </main>
    </div>
</template>
<style>
.mainw,
.mainw>* {
    min-height: calc(100vh - 3.65rem);
}
html {
    margin-top: 3.65rem;
    overflow-y: scroll;
}
</style>