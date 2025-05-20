import BFButton from './BFButton.vue'
import { shallowMount } from '@vue/test-utils'

describe('BFButton.vue', () => {

  const cmp = shallowMount(BFButton, {
    slots: {
      default: '<div />'
    }
  })

  it('click event emits', async (done) => {
    cmp.setProps({
      disabled: false
    })
    await cmp.trigger('click')
    expect(cmp.emitted('click')).toBeTruthy()
  })
})
