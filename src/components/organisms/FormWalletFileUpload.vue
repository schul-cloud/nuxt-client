<template>
	<form @submit.prevent="uploadDocument">
		<base-input
			v-model="title"
			type="text"
			label="Titel"
			placeholder="Titel"
			class="mt--md"
			required="true"
		>
			<template v-slot:icon>
				<base-icon source="material" icon="edit" />
			</template>
		</base-input>

		<base-input
			v-model="description"
			type="text"
			label="Beschreibung"
			placeholder="Beschreibung"
			class="mt--md"
			required="true"
		>
			<template v-slot:icon>
				<base-icon source="material" icon="ic_default" />
			</template>
		</base-input>

		<input type="file" @change="saveFile" />

		<base-button
			:disabled="!file"
			type="submit"
			class="w-100 mt--md"
			design="primary"
			><base-icon source="material" icon="ic_default" />Dokument
			hochladen</base-button
		>

		<base-button
			class="w-100 mt--sm"
			design="outline"
			text
			@click.prevent="$router.go(-1)"
			>Abbrechen</base-button
		>
	</form>
</template>

<script>
export default {
	data() {
		return {
			file: null,
			title: "Sprachzertifikat",
			description: "B1-Zertifikat",
		};
	},
	methods: {
		saveFile(event) {
			this.file = event.target.files[0];
			console.log(this.file);
		},
		async uploadDocument() {
			this.message = await this.$store.dispatch("wallet/sendFile", {
				title: this.title,
				description: this.description,
				file: this.file,
			});

			this.$toast.success(
				"Das Dokument wurde erfolgreich in dein Wallet hochgeladen!"
			);

			console.log(this.message);

			await this.$router.push({
				path: "/wallet",
			});
		},
	},
};
</script>
