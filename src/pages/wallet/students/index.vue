<template>
	<section>
    <base-breadcrumb :inputs="breadcrumbs"/>

    <h1 class="mb--md h3">Schüler:innen</h1>
		Du kannst hier die Wallets aller Schüler:innen verwalten. Dafür musst du
		einfach nur den entsprechenden Schüler auswählen und kannst dann ein
		Dokument deiner Wahl in das Wallet hochladen.

		<backend-data-table
			:columns="columns"
			:data="students"
			track-by="_id"
			:paginated="true"
			:rows-selectable="false"
			:actions="actions"
			:total="pagination.total"
		>
			<template v-slot:datacolumn-_id="{ data, selected, highlighted }">
				<base-button
					:class="{
						'action-button': true,
						'row-selected': selected,
						'row-highlighted': highlighted,
					}"
					design="text icon"
					size="small"
					:to="`/wallet/students/${data}/upload`"
				>
					<base-icon source="fa" icon="upload" />
				</base-button>
			</template>
		</backend-data-table>
	</section>
</template>

<script>
import UserHasPermission from "@mixins/UserHasPermission";
import { mapGetters, mapState } from "vuex";
import BackendDataTable from "@components/organisms/DataTable/BackendDataTable";
import BaseBreadcrumb from "@basecomponents/BaseBreadcrumb";

export default {
	components: { BaseBreadcrumb, BackendDataTable },
	mixins: [UserHasPermission],
	meta: {
		requiredPermissions: ["STUDENT_LIST"],
	},
	fetch() {
		this.$store.dispatch("users/handleUsers", {
			action: "find",
			userType: "students",
		});
	},
	data() {
		return {
			columns: [
				{
					field: "firstName",
					label: this.$t("common.labels.firstName"),
					sortable: true,
				},
				{
					field: "lastName",
					label: this.$t("common.labels.lastName"),
					sortable: true,
				},
				{
					field: "_id",
					label: "",
				},
			],
			actions: [],
      breadcrumbs: [
        {
          text: "Digitales Wallet",
          to: "/wallet"
        },
        {
			    text: "Schüler-Wallets"
        }
      ]
		};
	},
	computed: {
		...mapGetters("users", {
			students: "list",
		}),
		...mapState("users", {
			pagination: (state) =>
				state.pagination.default || { limit: 10, total: 0 },
		}),
	},
	head() {
		return {
			title: "Schüler-Wallets",
		};
	},
};
</script>
