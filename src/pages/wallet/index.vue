<template>
	<div>
		<h2 class="h2">Digitales Wallet</h2>
		Verbinde jetzt dein kompatibles Wallet mit deinem Account und lege fest,
		welche Daten du sicher und langfristig speichern möchtest.<br /><br />
		Noch kein Wallet: Hier findest du eine Liste von Anbietern.
		<div class="selection">
			<base-input
				v-model="manual"
				type="checkbox"
				label="Manuelles Teilen von Daten"
			/>
			<base-input
        v-model="portfolio"
				type="checkbox"
				label="Lernportfolio: Speicher dein Lernportfolio automatisch in deiner Wallet."
			/>
			<base-input v-model="certificates" type="checkbox" label="Zeugnisse und Zertifikate" />
			<base-input
          v-model="analytics"
				type="checkbox"
				label="Learning Analytics: Speicher dir Daten über deine Nutzung von Bildungsmedien."
			/>
		</div>
		<base-button class="w-100" design="primary outline" to="/wallet/upload">
			<base-icon source="material" icon="ic_default" />Datei in bestehendes
			Wallet hochladen
		</base-button>
		<base-button class="w-100 mt--sm" design="primary" to="/wallet/new"
			><base-icon source="material" icon="add" />Neues Wallet
			verbinden</base-button
		>
    <base-button v-if="$_userHasPermission('STUDENT_LIST')" class="w-100 mt--sm" design="secondary" to="/wallet/students">
      Schüler-Wallets verwalten
    </base-button>
	</div>
</template>

<script>
import UserHasPermission from "@mixins/UserHasPermission";

export default {
  mixins: [UserHasPermission],
	data() {
		return {
			manual: true,
      portfolio: false,
      certificates: false,
      analytics: false
		};
	},
	head() {
		return {
			title: "Digitales Wallet",
		};
	},
};
</script>

<style lang="scss" scoped>
@import "@styles";

.selection {
	margin-top: var(--space-xl);
}
</style>
