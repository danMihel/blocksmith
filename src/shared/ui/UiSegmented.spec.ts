import { mount, type VueWrapper } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { SegmentedOption } from './types'
import UiSegmented from './UiSegmented.vue'

type Device = 'desktop' | 'tablet' | 'mobile'

const options: SegmentedOption<Device>[] = [
  { value: 'desktop', label: 'Desktop' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'mobile', label: 'Mobile' },
]

function factory(modelValue: Device = 'desktop') {
  // Emulates v-model: feed every emitted value back as the new prop.
  const wrapper: VueWrapper = mount(UiSegmented, {
    attachTo: document.body,
    props: {
      options,
      label: 'Device',
      modelValue,
      'onUpdate:modelValue': (value: string | number) =>
        void wrapper.setProps({ modelValue: value }),
    },
  })
  return wrapper
}

const checkedLabel = (wrapper: VueWrapper) => wrapper.find('[aria-checked="true"]').text()

describe('UiSegmented', () => {
  it('marks the selected option and keeps only it tabbable', () => {
    const wrapper = factory('tablet')
    const radios = wrapper.findAll('[role="radio"]')

    expect(checkedLabel(wrapper)).toBe('Tablet')
    expect(radios.map((r) => r.attributes('tabindex'))).toEqual(['-1', '0', '-1'])
  })

  it('selects an option on click', async () => {
    const wrapper = factory()

    await wrapper.findAll('[role="radio"]')[2]!.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['mobile']])
    expect(checkedLabel(wrapper)).toBe('Mobile')
  })

  it('moves selection with arrow keys and wraps around', async () => {
    const wrapper = factory('mobile')
    const group = wrapper.find('[role="radiogroup"]')

    await group.trigger('keydown', { key: 'ArrowRight' })
    expect(checkedLabel(wrapper)).toBe('Desktop')

    await group.trigger('keydown', { key: 'ArrowLeft' })
    expect(checkedLabel(wrapper)).toBe('Mobile')

    await group.trigger('keydown', { key: 'Home' })
    expect(checkedLabel(wrapper)).toBe('Desktop')
  })
})
