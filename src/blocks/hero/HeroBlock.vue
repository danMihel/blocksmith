<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'
import type { HeroProps } from './schema'

const { eyebrow, title, subtitle, primaryAction, secondaryAction, align } = defineProps<HeroProps>()
</script>

<template>
  <section class="relative isolate overflow-hidden px-6 pt-(--pt) pb-(--pb)">
    <div
      aria-hidden="true"
      class="absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_50%_0%,color-mix(in_oklch,var(--page-primary)_22%,transparent),transparent_70%)]"
    />
    <div
      aria-hidden="true"
      class="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--page-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--page-line)_1px,transparent_1px)] mask-[radial-gradient(70%_60%_at_50%_0%,black,transparent)] bg-size-[48px_48px] opacity-60"
    />

    <div
      :class="[
        'mx-auto flex max-w-5xl flex-col',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
      ]"
    >
      <p
        v-if="eyebrow"
        class="inline-flex items-center gap-2 rounded-full border border-page-line bg-page-bg/70 px-3 py-1 text-sm font-medium text-page-muted shadow-xs backdrop-blur"
      >
        <span class="size-1.5 rounded-full bg-page-primary" aria-hidden="true" />
        {{ eyebrow }}
      </p>

      <h1
        class="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-balance text-page-fg @3xl:text-6xl @5xl:text-7xl"
      >
        {{ title }}
      </h1>

      <p
        v-if="subtitle"
        class="mt-6 max-w-2xl text-lg/relaxed text-pretty text-page-muted @3xl:text-xl/relaxed"
      >
        {{ subtitle }}
      </p>

      <div
        v-if="primaryAction.label || secondaryAction.label"
        :class="[
          'mt-10 flex w-full flex-col gap-3 @md:w-auto @md:flex-row',
          align === 'center' && 'justify-center',
        ]"
      >
        <a
          v-if="primaryAction.label"
          :href="primaryAction.href"
          class="group inline-flex h-12 items-center justify-center gap-2 rounded-page bg-page-primary px-6 font-medium text-page-primary-fg shadow-lg shadow-page-primary/25 transition hover:brightness-110"
        >
          {{ primaryAction.label }}
          <ArrowRight
            class="size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </a>
        <a
          v-if="secondaryAction.label"
          :href="secondaryAction.href"
          class="inline-flex h-12 items-center justify-center rounded-page border border-page-line bg-page-bg px-6 font-medium text-page-fg transition hover:bg-page-surface"
        >
          {{ secondaryAction.label }}
        </a>
      </div>
    </div>
  </section>
</template>
