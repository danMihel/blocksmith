<script setup lang="ts">
import type { CtaProps } from './schema'

const { title, subtitle, action, tone } = defineProps<CtaProps>()

const tones: Record<CtaProps['tone'], { card: string; button: string }> = {
  accent: {
    card: 'bg-page-primary text-page-primary-fg',
    button: 'bg-page-primary-fg text-page-primary hover:opacity-90',
  },
  subtle: {
    card: 'border border-page-line bg-page-surface text-page-fg',
    button: 'bg-page-primary text-page-primary-fg hover:brightness-110',
  },
}
</script>

<template>
  <section class="px-4 pt-(--pt) pb-(--pb) @3xl:px-6">
    <div
      :class="[
        'relative isolate mx-auto max-w-5xl overflow-hidden rounded-[calc(var(--page-radius)*2)] px-6 py-14 text-center @3xl:px-16 @3xl:py-20',
        tones[tone].card,
      ]"
    >
      <!-- Decorative rings -->
      <!-- Smaller and pushed to the corners on narrow screens so they never sit under the text -->
      <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 opacity-15">
        <div
          class="absolute -top-20 -right-20 size-44 rounded-full border-[24px] border-current @3xl:-top-24 @3xl:-right-16 @3xl:size-72 @3xl:border-[40px]"
        />
        <div
          class="absolute -bottom-24 -left-24 size-48 rounded-full border-[28px] border-current @3xl:-bottom-32 @3xl:-left-20 @3xl:size-80 @3xl:border-[48px]"
        />
      </div>

      <h2
        class="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance @3xl:text-4xl"
      >
        {{ title }}
      </h2>
      <p v-if="subtitle" class="mx-auto mt-4 max-w-xl text-lg text-pretty opacity-80">
        {{ subtitle }}
      </p>
      <a
        v-if="action.label"
        :href="action.href"
        :class="[
          'mt-8 inline-flex h-12 items-center justify-center rounded-page px-7 font-medium shadow-sm transition',
          tones[tone].button,
        ]"
      >
        {{ action.label }}
      </a>
    </div>
  </section>
</template>
