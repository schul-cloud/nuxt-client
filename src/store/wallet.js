import mergeDeep from "@utils/merge-deep";
import serviceTemplate from "@utils/service-template";
const base = serviceTemplate("wallet");

const module = mergeDeep(base, {
	actions: {
		async sendFile(ctx, payload = {}) {
			console.log(payload);

			const form = new FormData();

			if (payload.userId) {
				form.append("userId", payload.userId);
			}

			form.append("title", payload.title);
			form.append("description", payload.description);
			form.append("file", payload.file);

			return this.$axios.$post("/wallet/files", form);
		},
	},
});

export default module;
