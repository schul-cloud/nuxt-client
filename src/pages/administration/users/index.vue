<template>
	<v-container class="radius-lg">
		<v-responsive>
			<v-row>
				<v-col>
					<base-breadcrumb :inputs="breadcrumbs" />
					<h1 class="mb--md h3">
						{{ $t("pages.administration.students.index.title") }}
					</h1>
					<v-text-field
						v-model="searchQuery"
						label=""
						:prepend-inner-icon="mdiIcons.mdiMagnify"
					/>

					<!--Row selection section-->
					<div class="blank-section">
						<div v-if="tableSelection.length" class="row-selection-info">
							<div class="d-flex align-items-center content-wrapper"></div>
							<base-button design="icon" class="close" @click="find">
								<base-icon icon="close" source="material" />
							</base-button>
						</div>
					</div>
					<!--Row selection section-->

					<!--data-table section-->
					<v-data-table
						v-model="selected"
						fluid
						:headers="tableColumns"
						:items-per-page="tableData.limit"
						:items="users"
						item-key="_id"
						show-select
						class="elevation-1"
						loading
					>
						<template v-slot:item.consentStatus="{ item }">
							<v-icon v-if="item.consentStatus === 'ok'" class="icon-success">
								{{ mdiIcons.mdiCheckAll }}
							</v-icon>
							<v-icon
								v-if="item.consentStatus === 'missing'"
								class="icon-danger"
							>
								{{ mdiIcons.mdiClose }}
							</v-icon>
							<v-icon
								v-if="item.consentStatus === 'parentsAgreed'"
								class="icon-warning"
							>
								{{ mdiIcons.mdiCheck }}
							</v-icon>
						</template>
						<template v-slot:item.createdAt="{ data }">
							<span class="text-content">{{ printDate(data) }}</span>
						</template>
						<template v-slot:item._id="{ item }">
							<v-btn icon :to="`/administration/${userType}/${item._id}/edit`">
								<v-icon>{{ mdiIcons.mdiPencil }}</v-icon>
							</v-btn>
						</template>
					</v-data-table>
					<!--data-table section-->

					<!-- #region SampleRegion -->

					<v-row align="center">
						<v-col class="d-flex" cols="6" sm="6" data-app>
							<v-select
								:items="tableData.itemPerPage"
								label="Select"
								persistent-hint
								return-object
							></v-select>
						</v-col>
						<v-col class="d-flex flex-row-reverse" cols="6" sm="6"> </v-col>
					</v-row>
					<!-- #endregion -->
				</v-col>
			</v-row>
		</v-responsive>
		<div style="height: 400px"></div>
	</v-container>
</template>

<script>
import { mapGetters } from "vuex";
import {
	mdiMagnify,
	mdiCheck,
	mdiClose,
	mdiCheckAll,
	mdiPencil,
} from "@mdi/js";
import { printDate } from "@plugins/datetime";

// TODO: consent icons

export default {
	data() {
		return {
			userType: "students",
			breadcrumbs: [
				{
					text: this.$t("pages.administration.index.title"),
					to: "/administration/",
					icon: { source: "fa", icon: "cog" },
				},
				{
					text: this.$t("pages.administration.students.index.title"),
				},
			],
			tableColumns: [
				{
					value: "firstName",
					text: this.$t("common.labels.firstName"),
					sortable: true,
				},
				{
					value: "lastName",
					text: this.$t("common.labels.lastName"),
					sortable: true,
				},
				{
					value: "birthday",
					text: this.$t("common.labels.birthday"),
					sortable: true,
				},
				{
					value: "email",
					text: this.$t("common.labels.email"),
					sortable: true,
				},
				{
					value: "classes",
					text: this.$t("common.labels.classes"),
					sortable: true,
				},
				{
					value: "consentStatus",
					text: this.$t("common.labels.registration"),
					sortable: true,
					infobox: true, // TODO: infobox
				},
				{
					value: "createdAt",
					text: this.$t("common.labels.createdAt"),
					sortable: true,
				},
				{
					value: "_id",
					text: "",
				},
			],
			selected: [],
			searchQuery: "",
			mdiIcons: {
				mdiMagnify,
				mdiCheck,
				mdiClose,
				mdiCheckAll,
				mdiPencil,
			},
			printDate,
			tableData: {
				limit: 25,
				page: 1,
				sortBy: "firstName",
				sortOrder: "asc",
				total: 0,
				itemPerPage: ["5", "10", "25", "50", "100"],
			},
			items: [
				{ state: "Florida", abbr: "FL" },
				{ state: "Georgia", abbr: "GA" },
				{ state: "Nebraska", abbr: "NE" },
				{ state: "California", abbr: "CA" },
				{ state: "New York", abbr: "NY" },
			],
		};
	},

	computed: {
		...mapGetters("users", {
			users: "list",
		}),
		tableSelection() {
			return this.selected.map((user) => user._id);
		},
	},
	watch: {
		searchQuery() {
			// console.log(this.searchQuery);
		},
	},

	created() {
		// console.log("filter", "pages.administration.students.index");
		this.find();
	},
	methods: {
		find() {
			const query = {
				$limit: this.tableData.limit,
				$skip: (this.tableData.page - 1) * this.tableData.limit,
				$sort: {
					[this.tableData.sortBy]: this.tableData.sortOrder === "asc" ? 1 : -1,
				},
				...this.currentFilterQuery,
			};
			this.$store.dispatch("users/handleUsers", {
				query,
				action: "find",
				userType: this.userType,
			});
		},
	},
};
</script>

<style lang="scss" scoped>
@import "@styles";

.icon-success {
	color: var(--color-success);
}
.icon-warning {
	color: var(--color-warning);
}
.icon-danger {
	color: var(--color-danger);
}
.row-selection-info {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	padding: var(--space-xs) var(--space-md);
	color: var(--color-on-tertiary-light);
	background-color: var(--color-tertiary-light);
}
.blank-section {
	min-height: 58px;
	margin-bottom: var(--space-xs);
}
</style>
