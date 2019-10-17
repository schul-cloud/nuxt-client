require("dotenv").config();
const pkg = require("./package");
const themeName = process.env.SC_THEME || "default";
const API_URL = process.env.API_URL || "http://localhost:3030";

const DEFAULT_PORT = 4000;
const DEFAULT_HOST =
	process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";

module.exports = {
	mode: "spa",
	srcDir: "src/",
	theme: "default",
	env: {
		FALLBACK_DISABLED: process.env.FALLBACK_DISABLED || false,
	},
	/*
	 ** Headers of the page
	 */
	head: {
		title: pkg.name,
		meta: [{
				charset: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				hid: "description",
				name: "description",
				content: pkg.description,
			},
		],
		link: [{
			rel: "icon",
			type: "image/png",
			href: "/images/logo/favicon-32.png", //TODO: Fix path
		}, ],
	},

	/*
	 ** Customize the progress-bar color
	 */
	loading: {
		color: "#ccc",
	},

	css: ["@/themes/" + themeName + "/styles"],

	/*
	 ** Global CSS
	 */
	cssSourceMap: true,

	server: {
		port: process.env.PORT || DEFAULT_PORT,
		host: process.env.HOST || DEFAULT_HOST,
	},
	serverMiddleware: ["@serverMiddleware/proxy"],

	router: {
		middleware: [
			// "is-authenticated",
			"links-fallback",
		],
	},

	/*
	 ** Plugins to load before mounting the App
	 */
	plugins: [
		"@plugins/global",
		"@plugins/axios",
		"@plugins/i18n",
		"@plugins/authenticate",
		"@plugins/user",
	],

	/*
	 ** Nuxt.js modules
	 */
	modules: [
		"@nuxtjs/dotenv",
		// Doc: https://github.com/nuxt-community/axios-module#usage
		"@nuxtjs/axios",
		"cookie-universal-nuxt",
		"@nuxtjs/toast",
		"nuxt-babel",
		'@nuxtjs/pwa',
	],

	toast: {
		duration: 3000,
	},
	/*
	 ** Axios module configuration
	 */
	axios: {
		// See https://github.com/nuxt-community/axios-module#options
		baseURL: API_URL,
	},
	/*
	 ** Workbox and PWA config
	 * "@assets/img/logo/logo-image-mono.svg
	 */
	workbox: {
		routerBase: '/',
		runtimeCaching: [{
			// Should be a regex string. Compiles into new RegExp('https://my-cdn.com/.*')
			urlPattern: API_URL + '/.*',
			// Defaults to `networkFirst` if omitted
			// handler: 'networkFirst',
			// Defaults to `GET` if omitted
			// method: 'GET'
		}]
	},
	pwa: {
		icons: {
			/* icon options */
		},
		manifest: {
			name: 'Schulcloud', //TODO Get name rom conf
			lang: 'de'
		}
	},

	/*
	 ** Build configuration
	 */
	build: {
		/*
		 ** You can extend webpack config here
		 */
		extend(config, ctx) {
			Object.assign(config.resolve.alias, require("./aliases.config").webpack);

			// Run ESLint on save
			if (ctx.isDev && ctx.isClient) {
				config.module.rules.push({
					enforce: "pre",
					test: /\.(js|vue)$/,
					loader: "eslint-loader",
					exclude: /(node_modules)/,
					options: {
						fix: true,
					},
				});
			}
		},
		postcss: {
			plugins: [require("postcss-color-mod-function")()],
			preset: {
				autoprefixer: {},
			},
		},
		extractCSS: true,
		vendor: ["vue-i18n"],
	},
	generate: {
		dir: "dist/nuxt",
	},
};
