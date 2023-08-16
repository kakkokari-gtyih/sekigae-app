<script setup lang="ts">
import type { LocaleObject } from '@nuxtjs/i18n/dist/runtime/composables';
import type { DropdownItem } from '@nuxthq/ui/dist/runtime/composables';

const emit = defineEmits<{
    (event: 'toggleNav'): void;
}>();

const { locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const localePath = useLocalePath();

const items = computed(() => {
    return (locales.value as LocaleObject[]).map<DropdownItem>((v) => ({
        label: v.name,
        to: switchLocalePath(v.code),
    }));
})
</script>
<template>
    <header class="h-[3.65rem] p-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-400 fixed top-0 left-0 z-[10000] w-full z-10">
        <UContainer class="h-full flex items-center">
            <NuxtLink :to="localePath('/')" class="block text-xl sm:text-2xl font-bold">
                <img src="/img/logo.png" class="h-7 sm:h-8 w-auto inline-block mr-2" />Sekigae.app
            </NuxtLink>
            <div class="ml-auto flex items-center h-full space-x-3">
                <NuxtLink class="block hover:opacity-70" :to="localePath('/terms/')">
                    {{ $t('common.nav.terms') }}
                </NuxtLink>
                <UDropdown 
                    :items="[
                        [...items],
                        [{
                            label: $t('common.nav.helpTranslate'),
                            to: 'https://crowdin.com/project/sekigae-app',
                            target: '_blank',
                            icon: 'i-heroicons-arrow-top-right-on-square',
                            iconClass: 'order-2 ml-auto',
                        }]
                    ]"
                    :popper="{ placement: 'bottom-end' }"
                >
                    <UButton color="gray" variant="ghost" icon="i-heroicons-language" />
                </UDropdown>
                <UButton class="hidden sm:block" color="gray" variant="ghost" square target="_blank" to="https://github.com/kakkokari-gtyih/sekigae-app">
                    <svg xmlns='http://www.w3.org/2000/svg' class="flex-shrink-0 fill-current h-5 w-5" viewBox="0, 0, 24, 24"><path d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'/></svg>
                </UButton>
                <a class="hidden md:flex items-center bg-[#93251f] text-white hover:opacity-80 tonko-hp px-3 selection:bg-white selection:text-primary-500" target="_blank" href="https://tonko.ed.jp">
                    {{ $t('common.nav.tondabayashiHs') }}<UIcon class="ml-1" name="i-heroicons-arrow-top-right-on-square" />
                </a>
            </div>
        </UContainer>
    </header>
</template>

<style scoped>
.tonko-hp {
    @apply -my-3;
    height: calc(100% + 1.5rem);
}
.bi {
    display: inline-block;
    vertical-align: -.125em;
}
</style>