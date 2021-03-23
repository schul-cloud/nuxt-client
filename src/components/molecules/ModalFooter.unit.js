import { shallowMount } from '@vue/test-utils'
import ModalFooter from './ModalFooter'

describe('@components/molecules/ModalFooter', () => {
  it(...isValidComponent(ModalFooter))

  it('Render with some slots', () => {
    const wrapper = shallowMount(ModalFooter, {
      slots: {
        left: 'left',
        right: 'right'
      }
    })
    expect(wrapper.find('.left-container').text()).toBe('left')
    expect(wrapper.find('.right-container').text()).toBe('right')
  })
})
