import { mount } from '@vue/test-utils'
import ModalFooterActions from './ModalFooterActions'

describe('@components/molecules/ModalFooterAction', () => {
  it(...isValidComponent(ModalFooterActions))

  it('renders with some slots', () => {
    const wrapper = mount(ModalFooterActions, {
      slots: {
        left: 'left',
        right: 'right'
      }
    })

    expect(wrapper.find('.slot-container').text()).toBe('left')
    expect(wrapper.find('.right-container').text()).toBe('right')
  })
})
