import { storiesOf } from '@storybook/vue'

import LernstoreDetailView from '@components/organisms/LernstoreDetailView'
import { boolean } from '@storybook/addon-knobs'
import { Resource } from '../../../stories/mockData/Resource'

storiesOf('6 Organisms/Content/LernstoreDetailView', module).add(
  'LernstoreDetailView',
  () => ({
    components: { LernstoreDetailView },
    data: () => ({
      role: boolean('isAdmin/Teacher', true),
      resource: {
        ...Resource
      }
    }),

    template: '<lernstore-detail-view :resource="resource" :role="role"/>'
  })
)
