import { storiesOf } from "@storybook/vue";
import { withMarkdownNotes } from "@storybook/addon-notes";
import baseDoc from "@docs/components/base.md";

import BaseButton from "@components/ui/BaseButton.vue";
import BaseCard from "@components/ui/BaseCard.vue";
import BaseIcon from "@components/ui/BaseIcon.vue";
import BaseInput from "@components/ui/BaseInput.vue";
import BaseLink from "@components/ui/BaseLink.vue";

storiesOf("Base Components", module)
	.addDecorator(withMarkdownNotes(baseDoc))
	.add("Base Button Primary", () => ({
		components: { BaseButton },
		template: "<BaseButton class ='is-primary'>Primary</BaseButton>",
		methods: {},
	}))
	.add("Base Button Secondary", () => ({
		components: { BaseButton },
		template: "<BaseButton class ='is-secondary'>Secondary</BaseButton>",
		methods: {},
	}))
	.add("Base Card", () => ({
		components: { BaseCard },
		template: "<Card/>",
		methods: {},
	}))
	.add("Base Icon", () => ({
		components: { BaseIcon },
		template: "<BaseIcon :name='fa-bell'/>",
	}))
	.add("Base Input", () => ({
		components: { BaseInput },
		template: "<BaseInput />",
		methods: {},
	}))
	.add("Base Switch", () => ({
		components: { BaseInput },
		template: "<BaseInput type='checkbox' />",
	}))
	.add("Base Radio Button", () => ({
		components: { BaseInput },
		template: "<BaseInput type='radio' />",
	}))
	.add("Base Link", () => ({
		components: { BaseLink },
		template:
			"<BaseLink href='https://www.google.com'> Link content</BaseLink>",
		methods: {},
	}));
