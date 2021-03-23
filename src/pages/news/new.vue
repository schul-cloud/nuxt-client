<template>
  <div>
    <base-breadcrumb
      :inputs="[
        {
          to: { name: 'news' },
          text: $t('pages.news.title'),
        },
        {
          text: $t('pages.news.new.title'),
        },
      ]"
    />
    <h1 :aria-label="$t('pages.news.new.title')" />
    <form-news #actions="{ cancel }" action="create">
      <form-actions>
        <template #primary>
          <base-button
            design="primary"
            type="submit"
            data-testid="btn_news_submit"
          >
            <base-icon source="material" icon="check" />
            {{ $t("pages.news.new.create") }}
          </base-button>
          <base-button design="text" @click.prevent="cancel">
            <base-icon source="material" icon="clear" />
            {{ $t("common.actions.discard") }}
          </base-button>
        </template>
      </form-actions>
    </form-news>
  </div>
</template>

<script lang="ts">
import FormNews from '@components/organisms/FormNews.vue'
import FormActions from '@components/molecules/FormActions.vue'

import Vue from 'vue'

export default Vue.extend({
  components: {
    FormNews,
    FormActions
  },
  meta: {
    requiredPermissions: ['NEWS_CREATE']
  },
  created () {
	  this.test('Test')
  },
  methods: {
	  test (a: number) {
	    console.log(a)
    }
  },
  head () {
    return {
      title: this.$ts('pages.news.new.title')
    }
  }
})
</script>
