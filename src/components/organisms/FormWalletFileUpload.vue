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
				<base-icon source="fa" icon="file-text" />
			</template>
		</base-input>

		<input type="file" @change="saveFile" />

		<base-button
			:disabled="!file || uploading"
			type="submit"
			class="w-100 mt--md"
			design="primary"
			><base-icon source="fa" icon="upload" class="mr--xs" />Dokument
			hochladen</base-button
		>

    <loading-modal title="Dokument wird hochgeladen..." description="Dies kann je nach Dateigröße einige Zeit dauern. Wir bitten um etwas Geduld..." :btn-text="$t('common.labels.close')" :active.sync="uploading"></loading-modal>

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
import LoadingModal from "@components/molecules/LoadingModal";
export default {
  components: { LoadingModal },
  props: {
    userId: {
      type: String,
      required: false,
      default: null
    }
  },
	data() {
		return {
			file: null,
			title: "Sprachzertifikat",
			description: "B1-Zertifikat",
      uploading: false
		};
	},
	methods: {
		saveFile(event) {
      console.log(event.target.files[0])

      if (event.target.files[0].size > 2000000) {
			  event.target.files = null;
        this.$toast.error(
            "Die Datei ist zu groß, sie darf maximal 2 MB groß sein!"
        );
      } else {
        this.file = event.target.files[0];
      }
		},
		async uploadDocument() {
		  this.uploading = true;

			this.message = await this.$store.dispatch("wallet/sendFile", {
			  userId: this.userId,
				title: this.title,
				description: this.description,
				file: this.file,
			});

      console.log(this.message);

			if (this.message.id) {
        this.$toast.success(
            this.userId ? "Das Dokument wurde erfolgreich in das Wallet hochgeladen!" : "Das Dokument wurde erfolgreich in dein Wallet hochgeladen!"
        );

        await this.$router.push({
          path: "/wallet",
        });
      } else {
        this.$toast.error(
            "Es gab einen Fehler beim File-Upload!"
        );
      }

			this.uploading = false;
		},
	},
};
</script>
