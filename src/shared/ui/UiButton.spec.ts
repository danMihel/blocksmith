import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import UiButton from './UiButton.vue'

describe('UiButton', () => {
  it('renders the default slot and is type="button" by default', () => {
    const wrapper = mount(UiButton, { slots: { default: 'Save' } })

    expect(wrapper.text()).toBe('Save')
    expect(wrapper.attributes('type')).toBe('button')
  })

  it('applies variant classes', () => {
    const wrapper = mount(UiButton, { props: { variant: 'primary' } })

    expect(wrapper.classes()).toContain('bg-accent')
  })

  it('emits click when enabled and ignores it when disabled', async () => {
    const enabled = mount(UiButton)
    await enabled.trigger('click')
    expect(enabled.emitted('click')).toHaveLength(1)

    const disabled = mount(UiButton, { props: { disabled: true } })
    await disabled.trigger('click')
    expect(disabled.emitted('click')).toBeUndefined()
  })
})
