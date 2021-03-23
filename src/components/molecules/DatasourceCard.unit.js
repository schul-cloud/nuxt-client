import ExampleImage from '@assets/img/datasources/logo-webuntis.png'
import DatasourceCard from './DatasourceCard'

describe('@components/molecules/DatasourceCard', () => {
  it(...isValidComponent(DatasourceCard))

  it('renders text props', () => {
    const title = 'testTitle'
    const subtitle = 'testSubTitle'
    const wrapper = shallowMount(DatasourceCard, {
      propsData: {
        image: ExampleImage,
        title,
        subtitle
      }
    })
    expect(wrapper.text()).toContain(title)
    expect(wrapper.text()).toContain(subtitle)
  })

  it(
    ...rendersSlotContent(DatasourceCard, ['title', 'subtitle', 'actions'], {
      propsData: {
        image: ExampleImage
      }
    })
  )
})
