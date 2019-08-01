import LanguageSwitcher from "./LanguageSwitcher";

describe("@components/LanguageSwitcher", () => {
	it(...isValidComponent(LanguageSwitcher));

	it("Changes language", () => {
		const wrapper = shallowMount(LanguageSwitcher, {
			propsData: {
				value: "de",
			},
			...createComponentMocks({
				stubs: {
					"base-input": true,
				},
				i18n: true,
				store: {
					i18n: {
						state: () => ({
							locales: ["de", "en"],
							locale: "de",
						}),
						mutations: {
							SET_LANG(state, locale) {
								if (state.locales.indexOf(locale) !== -1) {
									state.locale = locale;
								}
							},
						},
					},
				},
			}),
		});
		expect(wrapper.vm.$store.state.i18n.locale).toBe("de");
		wrapper.find("base-input-stub[label=en]").trigger("click");
		expect(wrapper.vm.$store.state.i18n.locale).toBe("en");
	});
});
