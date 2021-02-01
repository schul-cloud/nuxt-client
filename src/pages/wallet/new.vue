<template>
	<section>
    <base-breadcrumb :inputs="breadcrumbs" class="mb--md"/>
		<div>
			<step-progress :steps="steps" :current-step="currentStep"></step-progress>
		</div>
		<section v-if="!relationshipId" class="section">
			<h1 class="h3">QR-Code scannen</h1>
			Scanne diesen QR-Code mit deiner Wallet-App auf deinem Smartphone.
			Schließe dort dann die Verbindungsanfrage ab und wenn du dort bestätigt
			hast, klicke hier auf "Verbindung abschließen".
			<div>
				<div class="qrcode">
					<img v-if="qrcode" :src="qrcode" />
					<base-spinner v-else class="mb--xl mt--xl"></base-spinner>
				</div>
				<base-button
					design="success"
					class="w-100"
					:disabled="disabled"
					@click="acceptRequest"
					><base-icon source="material" icon="check" />Verbindung
					abschließen</base-button
				>
			</div>
		</section>
		<section v-else class="section">
			<h2 class="h2">Verbindung abgeschlossen!</h2>
			Du hast dein Wallet erfolgreich verbunden. Dokumente kannst du nun
			problemlos in dieses hochladen und bekommst sie somit automatisch in der
			entsprechenden App angezeigt.
			<br /><br />
			<base-button class="w-100" design="primary outline" to="/wallet/upload">
				<base-icon source="material" icon="ic_default" />Erstes Dokument in
				Wallet hochladen
			</base-button>
			<base-button design="success" to="/wallet" class="w-100 mt--sm"
				><base-icon source="material" icon="check" />Zurück zur
				Übersicht</base-button
			>
		</section>
	</section>
</template>

<script>
import StepProgress from "@components/organisms/StepProgress";
import BaseBreadcrumb from "@basecomponents/BaseBreadcrumb";
export default {
	components: { BaseBreadcrumb, StepProgress },
	async fetch() {
		const relationshipTemplate = await this.$store.dispatch("wallet/create");

		console.log(relationshipTemplate.templateID);

		this.templateID = relationshipTemplate.templateID; // example data: "RLTsml0Y9aSbTRXar37R"
		this.qrcode = "data:image/png;base64," + relationshipTemplate.qrcode;

		setTimeout(() => {
			this.disabled = false;
		}, 1000 * 10);
	},
	data() {
		return {
			templateID: null,
			qrcode: null,
			relationshipId: null, // example data: "RELD7ODGMtaz8XW1zbEO"
			disabled: true,
			breadcrumbs: [
				{
					text: "Digitales Wallet",
					to: "/wallet"
				},
				{
					text: "Neues Wallet verbinden"
				},
			],
			steps: [
				{
					name: "Basiseinstellungen treffen",
				},
				{
					name: "QR-Code scannen",
				},
				{
					name: "Verbindung abschließen",
				},
			],
		};
	},
	computed: {
		currentStep() {
			return this.relationshipId ? 2 : 1;
		},
	},
	methods: {
		async acceptRequest() {
			this.relationshipId = await this.$store.dispatch("wallet/update", [
				null,
				{
					templateID: this.templateID,
				},
			]);

			await this.$store.dispatch("users/patch", [
				this.$user._id,
				{
					relationshipId: this.relationshipId,
				},
			]);

			if (this.relationshipId) {
				console.log(this.relationshipId);
			} else {
				console.log("Relationship has to be requested in the IDAS-app!");
				this.$toast.error(
					"Du musst erst in der App die Kontaktanfrage abschließen!"
				);
			}
		},
	},
	head() {
		return {
			title: "Neues Wallet verbinden",
		};
	},
};
</script>

<style lang="scss" scoped>
@import "@styles";

.section {
	padding-top: var(--space-xl-4);
}

.qrcode {
	text-align: center;
}
</style>
