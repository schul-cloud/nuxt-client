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
      <template v-slot:datacolumn-relationshipId="{ data }">
        <div class="text-content" style="text-align: center">
          <base-icon
            v-if="data"
            source="fa"
            icon="check"
            style="color: var(--color-success)"
           >
          </base-icon>

          <base-icon
              v-else
              source="fa"
              icon="times"
              style="color: var(--color-danger)"
          >
          </base-icon>
        </div>
      </template>
			<template v-slot:datacolumn-_id="{ data, selected, highlighted }">
				<base-button
          :disabled="!hasWallet(data)"
					:class="{
						'action-button': true,
						'row-selected': selected,
						'row-highlighted': highlighted,
					}"
					design="text icon"
					size="small"
					:to="hasWallet(data) ? `/wallet/students/${data}/upload` : null"
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
import BaseIcon from "@basecomponents/BaseIcon";

export default {
	components: { BaseIcon, BaseBreadcrumb, BackendDataTable },
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
          field: "relationshipId",
          label: "Wallet eingerichtet?"
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
  watch: {
    students (value) {
      console.log(value)
    }
  },
  methods: {
	  hasWallet(id) {
	    console.log('ID: ' + id);
	    const student = this.students.find(user => user._id === id);
	    console.log(student);
	    console.log(student.relationshipId);
      return !!student.relationshipId;
    }
  },
	head() {
		return {
			title: "Schüler-Wallets",
		};
	},
};
</script>
