<template>
  <div>
    <h1 class="mb--md h3">Datei in Wallet von {{ name }} hochladen</h1>
    Hier kannst du eine Datei auswählen, welche Datei du in das Wallet von {{ name }}
    hochladen möchtest. Dazu musst du einen aussagekräftigen Titel angeben,
    unter welchem die Datei auch in dem Wallet erscheinen wird. Die
    Kurzbeschreibung soll hierbei wichtige Zusatzinformationen geben.

    <form-wallet-file-upload></form-wallet-file-upload>
  </div>
</template>

<script>
import FormWalletFileUpload from "@components/organisms/FormWalletFileUpload";

export default {
  components: {
    FormWalletFileUpload
  },
  async asyncData ({ store, params }) {
    return {
      user: (await store.dispatch("users/find", {
        query: {
          _id: params.id
        }
      })).data[0]
    }
  },
  computed: {
    name() {
      return this.user.firstName + " " + this.user.lastName;
    }
  },
  head() {
    return {
      title: "Datei in Wallet von " + this.name + " hochladen"
    }
  }
}
</script>
