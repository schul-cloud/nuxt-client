<template>
	<div v-outside-click="removePopup" class="popup">
		<base-button class="icon-button" design="text icon" @click="popup">
			<base-icon :source="source" :icon="icon" :fill="fill" />
		</base-button>

		<div
			ref="popupContent"
			class="popup-content"
			:class="{ visible, 'expand-to-left': shouldExpandToLeft }"
		>
			<slot></slot>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		source: {
			type: String,
			required: true,
		},
		icon: {
			type: String,
			required: true,
		},
		fill: {
			type: String,
			default: "var(--color-tertiary-dark)",
		},
		shouldExpandToLeft: {
			type: Boolean,
		},
	},
	data() {
		return {
			visible: false,
		};
	},
	mounted() {
		this.shouldExpandToLeft =
			this.$refs.popupContent.getBoundingClientRect().right >
			window.innerWidth + 10;
	},
	methods: {
		popup() {
			this.visible = !this.visible;
		},
		removePopup() {
			this.visible = false;
		},
	},
};
</script>

<style lang="scss" scoped>
/* stylelint-disable sh-waqar/declaration-use-variable */
@import "@styles";

.popup {
	position: relative;
	display: inline-block;
	user-select: none;

	--arrow-size: var(--space-xs-2);
	--arrow-offset: 1em;
	--outer-arrow-size: calc(var(--arrow-size) + 1px);

	.icon-button {
		font-size: 20px;
	}

	:focus-within {
		.icon-button {
			background-color: var(--color-gray-light);
		}
	}

	.popup-content {
		position: absolute;
		top: 100%;
		right: 0%;
		z-index: var(--layer-popover);
		visibility: hidden;
		background-color: var(--color-white);
		border: 1px solid var(--color-gray-light);
		border-radius: var(--radius-sm);

		@include breakpoint(tablet) {
			right: initial;
			left: 0%;
		}

		&.visible {
			visibility: visible;
		}

		&.expand-to-left {
			right: 0%;
			left: initial;
		}
	}

	.popup-content::before {
		position: absolute;
		top: calc(-2 * var(--outer-arrow-size));
		right: calc(
			var(--arrow-offset) - (var(--outer-arrow-size) - var(--arrow-size))
		);
		margin-left: calc(-0.5 * var(--arrow-size));
		content: "";
		border-color: transparent transparent var(--color-gray-light) transparent;
		border-style: solid;
		border-width: var(--outer-arrow-size);

		@include breakpoint(tablet) {
			right: initial;
			left: calc(
				var(--arrow-offset) - (var(--outer-arrow-size) - var(--arrow-size))
			);
		}
	}

	.expand-to-left::before {
		@include breakpoint(tablet) {
			right: calc(
				var(--arrow-offset) - (var(--outer-arrow-size) - var(--arrow-size))
			);
			left: initial;
		}
	}

	.popup-content::after {
		position: absolute;
		top: calc(-2 * var(--arrow-size));
		right: var(--arrow-offset);
		margin-left: calc(-0.5 * var(--arrow-size));
		content: "";
		border-color: transparent transparent var(--color-white) transparent;
		border-style: solid;
		border-width: var(--arrow-size);

		@include breakpoint(tablet) {
			right: initial;
			left: var(--arrow-offset);
		}
	}

	.expand-to-left::after {
		@include breakpoint(tablet) {
			right: var(--arrow-offset);
			left: initial;
		}
	}
}
</style>
