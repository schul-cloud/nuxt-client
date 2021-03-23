import Vue from 'vue'

// BaseComponents
import '@/components/base/_globals'

import VueMq from 'vue-mq'

import './directives'
import './filter'

// Theme
import Theme from '@theme/config'

// Dialog
import BaseDialog from '@/components/base/BaseDialog/BaseDialogProgrammatic'

// EventBus
import './eventBus'

// uiState
import uiState from './uiState'
Vue.use(VueMq, {
  breakpoints: {
    mobile: 750,
    tabletPortrait: 770,
    tablet: 991,
    desktop: 1200,
    large: Infinity
  },
  defaultBreakpoint: 'mobile'
})
Vue.prototype.$theme = Theme
Vue.use(BaseDialog)
Vue.use(uiState)
