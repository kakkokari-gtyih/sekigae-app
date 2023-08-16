<script setup lang="ts">
import type { Graph, Thing } from 'schema-dts';

const { t, locale } = useI18n();
const route = useRoute();
const baseUrl = useRuntimeConfig().public.baseUrl as string;

const getDescription = (): string => {
    if (route.meta.description != null && route.meta.description != "") {
        return route.meta.description;
    } else {
        return t('seo.defaultDescription');
    }
}
const getTitle = () => route.meta.title ? `${route.meta.title} | Sekigae.app` : "Sekigae.app";
const getLdJson = (additionalGraphes: Thing[] = []): string => {
    const ldJson: Graph = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": `${baseUrl}/#Organization`,
                "name": "Sekigae.app",
                "url": `${baseUrl}/`,
                "sameAs": [
                    "https://tonko.ed.jp/",
					"https://tonko-forum.pages.dev/",
                ],
                "logo": {
                    "@type": "ImageObject",
                    // TODO
                    "url": `${baseUrl}/img/logo.png`
                }
            },
            {
                "@type": "WebSite",
                "@id": `${baseUrl}/#WebPage`,
                "name": "Sekigae.app",
                "inLanguage": locale.value,
                "url": `${baseUrl}${route.path}`,
                "publisher": {
                    "@type": "Organization",
                    "@id": `${baseUrl}/#Organization`
                },
                "headline": getTitle(),
                "description": getDescription()
            },
        ]
    };
    ldJson['@graph'] = ldJson['@graph'].concat(additionalGraphes);
    return JSON.stringify(ldJson);
};

const head = useLocaleHead({
    addSeoAttributes: true
});

useHead((): Record<string, any> => ({
    htmlAttrs: {
        lang: locale.value,
    },
    title: getTitle(),
    meta: [
        {
            name: "description",
            content: getDescription(),
        },
        {
            property: "og:title",
            content: getTitle(),
        },
        {
            property: "og:site_name",
            content: "Sekigae.app",
        },
        {
            property: "og:description",
            content: getDescription(),
        },
        {
            property: "og:image",
            // TODO
            content: () => route.meta.thumbnail ? route.meta.thumbnail : `${baseUrl}/img/logo.png`,
        },
        ...(head.value.meta?.map((e) => ({ property: e.property, content: e.content, })) || []),
    ],
    link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Inter:wght@400;500;700&display=swap' },
        ...(head.value.link?.map((e) => ({ rel: e.rel, href: (e.href.endsWith('/') ? e.href : e.href + '/'), hreflang: e.hreflang, })) || []),
    ],
    script: [
        { type: "application/ld+json", children: getLdJson(route.meta.graph) }
    ],
}));
</script>
<template>
	<div>
		<noscript class="block bg-primary-800 text-white text-center py-1.5 px-3 keep-all relative z-[10005]">Please turn on Javascript from your browser's settings.</noscript>
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</div>
</template>

<style>
body {
    font-feature-settings: "palt" 1;
}
</style>