<script setup lang="ts">
import { Check } from '@lucide/vue'
import { computed } from 'vue'
import type { PricingProps } from './schema'

const { eyebrow, title, subtitle, plans } = defineProps<PricingProps>()

// Full class names so Tailwind can see them at build time.
const layouts: Record<number, string> = {
  1: 'mx-auto max-w-md',
  2: 'mx-auto max-w-4xl @3xl:grid-cols-2',
  3: '@3xl:grid-cols-3',
  4: '@3xl:grid-cols-2 @6xl:grid-cols-4',
}
const layout = computed(() => layouts[plans.length] ?? layouts[3])

const featureList = (features: string) =>
  features
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
</script>

<template>
  <section class="px-6 pt-(--pt) pb-(--pb)">
    <div class="mx-auto max-w-6xl">
      <header v-if="eyebrow || title || subtitle" class="mx-auto max-w-2xl text-center">
        <p v-if="eyebrow" class="text-sm font-semibold tracking-wide text-page-primary uppercase">
          {{ eyebrow }}
        </p>
        <h2
          v-if="title"
          class="mt-3 text-3xl font-semibold tracking-tight text-balance text-page-fg @3xl:text-5xl"
        >
          {{ title }}
        </h2>
        <p v-if="subtitle" class="mt-4 text-lg text-pretty text-page-muted">{{ subtitle }}</p>
      </header>

      <ul :class="['mt-14 grid items-stretch gap-6', layout]">
        <li
          v-for="(plan, index) in plans"
          :key="index"
          :class="[
            'relative flex flex-col rounded-page p-7',
            plan.highlighted
              ? 'bg-page-bg shadow-xl ring-2 shadow-page-primary/10 ring-page-primary'
              : 'border border-page-line bg-page-surface',
          ]"
        >
          <p
            v-if="plan.highlighted"
            class="absolute -top-3 left-7 rounded-full bg-page-primary px-3 py-1 text-xs font-semibold text-page-primary-fg"
          >
            Most popular
          </p>
          <h3 class="text-lg font-semibold text-page-fg">{{ plan.name }}</h3>
          <p v-if="plan.description" class="mt-1 text-sm text-page-muted">
            {{ plan.description }}
          </p>
          <p class="mt-6 flex items-baseline gap-1">
            <span class="text-4xl font-semibold tracking-tight text-page-fg">{{ plan.price }}</span>
            <span v-if="plan.period" class="text-sm text-page-muted">{{ plan.period }}</span>
          </p>
          <ul class="mt-6 mb-8 flex-1 space-y-3 text-sm text-page-fg">
            <li
              v-for="feature in featureList(plan.features)"
              :key="feature"
              class="flex items-start gap-2.5"
            >
              <Check class="mt-0.5 size-4 shrink-0 text-page-primary" aria-hidden="true" />
              {{ feature }}
            </li>
          </ul>
          <a
            v-if="plan.action.label"
            :href="plan.action.href"
            :class="[
              'inline-flex h-11 items-center justify-center rounded-page px-5 text-sm font-medium transition',
              plan.highlighted
                ? 'bg-page-primary text-page-primary-fg hover:brightness-110'
                : 'border border-page-line bg-page-bg text-page-fg hover:bg-page-surface',
            ]"
          >
            {{ plan.action.label }}
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>
