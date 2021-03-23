import { storiesOf } from '@storybook/vue'
import { text } from '@storybook/addon-knobs'

import faker from 'faker/locale/en' // any static number will do the job

import MintEcPageHeader from './MintEcPageHeader'
// set a seed to have a consistent fake for the screenshot tests
faker.seed(512)

storiesOf('5 Molecules/MintEcPageHeader', module).add('default', () => ({
  components: { MintEcPageHeader },
  template: '<MintEcPageHeader :heading="heading" :teaser="teaser" :image="image"  />',
  data: () => ({
    heading: text('heading', 'Schule informieren'),
    teaser: text('teaser', 'Ein Teaser'),
    image: text('image', faker.image.dataUri(1, 1))
  })
}))
