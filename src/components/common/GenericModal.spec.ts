import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GenericModal from './GenericModal.vue'

describe('GenericModal', () => {
  it('renders slot content when isOpen is true', () => {
    const wrapper = mount(GenericModal, {
      props: {
        isOpen: true
      },
      slots: {
        default: '<div class="test-content">Hello Modal</div>'
      }
    })
    
    expect(wrapper.find('.test-content').exists()).toBe(true)
    expect(wrapper.text()).toContain('Hello Modal')
  })

  it('does not render when isOpen is false', () => {
    const wrapper = mount(GenericModal, {
      props: {
        isOpen: false
      }
    })
    
    expect(wrapper.find('.fixed').exists()).toBe(false)
  })

  it('emits close event when button is clicked', async () => {
    const wrapper = mount(GenericModal, {
      props: {
        isOpen: true
      }
    })
    
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('close')
  })
})
