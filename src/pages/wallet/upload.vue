<template>
	<section>
    <base-breadcrumb :inputs="breadcrumbs"/>

		<h1 class="mb--md h3">Neue Datei in Wallet hochladen</h1>
		Hier kannst du eine Datei auswählen, welche Datei du in dein Wallet
		hochladen möchtest. Dazu musst du einen aussagekräftigen Titel angeben,
		unter welchem die Datei auch in deinem Wallet erscheinen wird. Die
		Kurzbeschreibung soll hierbei wichtige Zusatzinformationen geben.

		<form-wallet-file-upload></form-wallet-file-upload>
	</section>
</template>

<script>
import FormWalletFileUpload from "@components/organisms/FormWalletFileUpload";
import BaseBreadcrumb from "@basecomponents/BaseBreadcrumb";

export default {
	components: {
    BaseBreadcrumb,
		FormWalletFileUpload,
	},
  data() {
	  return {
	    breadcrumbs: [
        {
          text: "Digitales Wallet",
          to: "/wallet"
        },
        {
          text: "File-Upload"
        }
      ]
    }
  },
	head() {
		return {
			title: "Datei in Wallet hochladen",
		};
	},
};
</script>
