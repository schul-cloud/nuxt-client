import mergeDeep from "@utils/merge-deep";
import serviceTemplate from "@utils/service-template";
const base = serviceTemplate("wallet");

const module = mergeDeep(base, {
	actions: {
		sendFile(ctx, payload = {}) {
			console.log(payload);
			// TODO: PATCH /wallet isn't the final solution (POST /wallet/file or something like that would be better)

			const form = new FormData();

			form.append("relationshipId", payload.relationshipId);
			form.append("title", payload.title);
			form.append("description", payload.description);
			form.append("file", payload.file);

			return this.$axios.$post("/wallet/files", form, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
		},
	},
});

export default module;
