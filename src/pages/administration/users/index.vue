<template>
	<v-container class="radius-lg">
		<progress-modal
			:active="isDeleting"
			:percent="deletedPercent"
			:title="$t('pages.administration.students.index.remove.progress.title')"
			:description="
				$t('pages.administration.students.index.remove.progress.description')
			"
			data-testid="progress-modal"
		/>

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

				<!-- #region Row selection section-->
				<!-- <div class="blank-section">
					<div v-if="tableSelection.length" class="row-selection-info">
						<div class="d-flex align-items-center content-wrapper"></div>
						<base-button design="icon" class="close" @click="find">
							<base-icon icon="close" source="material" />
						</base-button>
					</div>
				</div> -->

				<v-toolbar
					:style="{ visibility: tableSelection.length ? 'visible' : 'hidden' }"
					class="row-selection-info"
					color="#617480"
				>
					<v-menu offset-y>
						<template v-slot:activator="{ on, attrs }">
							<v-btn v-bind="attrs" v-on="on" @click="models.base = true">
								{{ $t("pages.administration.actions") }}</v-btn
							>
						</template>
						<v-list v-if="models.base">
							<v-list-item
								v-for="(item, index) in filteredActions"
								:key="index"
								v-click-outside="onClickOutsideStandard"
								@click="item.action"
							>
								<v-list-item-icon>
									<v-icon v-text="mdiIcons.mdiCheck"></v-icon>
								</v-list-item-icon>
								<v-list-item-content>
									<v-list-item-title v-text="item.label"></v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</v-list>
					</v-menu>
				</v-toolbar>
				<!-- #endregion -->

				<!-- #region data-table section-->
				<v-data-table
					v-model="selected"
					fluid
					:headers="tableColumns"
					:items-per-page="tableData.limit"
					:items="users"
					item-key="_id"
					show-select
					class="elevation-1 data-table"
					loading
				>
					<template v-slot:item.consentStatus="{ item }">
						<v-icon v-if="item.consentStatus === 'ok'" class="icon-success">
							{{ mdiIcons.mdiCheckAll }}
						</v-icon>
						<v-icon v-if="item.consentStatus === 'missing'" class="icon-danger">
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
				<!-- #endregion -->

				<!-- #region Paginatiom -->

				<v-row align="center">
					<v-col class="d-flex" cols="6" sm="6" data-app>
						<v-select
							item-text="label"
							item-value="value"
							:items="tableData.perPageOptions"
						></v-select>
					</v-col>
					<v-col class="d-flex flex-row-reverse" cols="6" sm="6">
						41 to 50 from 1003
						<v-btn icon>
							<v-icon>{{ mdiIcons.mdiCodeLessThan }}</v-icon>
						</v-btn>
						<v-btn icon>
							<v-icon>{{ mdiIcons.mdiCodeGreaterThan }}</v-icon>
						</v-btn>
					</v-col>
				</v-row>
				<!-- #endregion -->
			</v-col>
		</v-row>
		<div style="height: 400px"></div>
	</v-container>
</template>

<script>
import { mapState } from "vuex";
import UserHasPermission from "@/mixins/UserHasPermission";
import ProgressModal from "@components/molecules/ProgressModal";

import {
	mdiMagnify,
	mdiCheck,
	mdiClose,
	mdiCheckAll,
	mdiPencil,
	mdiCodeGreaterThan,
	mdiCodeLessThan,
} from "@mdi/js";
import { printDate } from "@plugins/datetime";

// TODO: consent icons

export default {
	components: ProgressModal,
	mixins: [UserHasPermission],
	data() {
		return {
			models: {
				base: true,
			},
			mdiIcons: {
				mdiMagnify,
				mdiCheck,
				mdiClose,
				mdiCheckAll,
				mdiPencil,
				mdiCodeGreaterThan,
				mdiCodeLessThan,
			},
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
			tableActions: [
				{
					label: this.$t(
						"pages.administration.students.index.tableActions.consent"
					),
					icon: "this.mdiIcons.mdiCheck",
					action: this.handleBulkConsent,
				},
				{
					label: this.$t(
						"pages.administration.students.index.tableActions.email"
					),
					icon: "mail_outline",
					action: this.handleBulkEMail,
					dataTestId: "registration_link",
				},
				{
					label: this.$t("pages.administration.students.index.tableActions.qr"),
					icon: "qrcode",
					action: this.handleBulkQR,
					dataTestId: "qr_code",
				},
				{
					label: this.$t(
						"pages.administration.students.index.tableActions.delete"
					),
					icon: "delete_outline",
					action: this.handleBulkDelete,
					permission: "STUDENT_DELETE",
					dataTestId: "delete_action",
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
			tableSelectionType: "",
			searchQuery: "",
			printDate,
			tableData: {
				limit: 50,
				page: 1,
				sortBy: "firstName",
				sortOrder: "asc",
				total: 0,
				itemPerPage: ["5", "10", "25", "50", "100"],
				perPageOptions: [
					{
						label: this.$t("components.organisms.Pagination.perPage.5"),
						value: 5,
					},
					{
						label: this.$t("components.organisms.Pagination.perPage.10"),
						value: 10,
					},
					{
						label: this.$t("components.organisms.Pagination.perPage.25"),
						value: 25,
					},
					{
						label: this.$t("components.organisms.Pagination.perPage.50"),
						value: 50,
					},
					{
						label: this.$t("components.organisms.Pagination.perPage.100"),
						value: 100,
					},
				],
			},
		};
	},

	layout: "loggedInFull",

	computed: {
		...mapState("users", {
			users: "list",
		}),
		...mapState("users", {
			isDeleting: (state) => state.progress.delete.active,
			deletedPercent: (state) => state.progress.delete.percent,
			qrLinks: "qrLinks",
		}),
		...mapState("env-config", {
			env: "env",
		}),
		tableSelection() {
			return this.selected.map((user) => user._id);
		},
		filteredActions() {
			const editedActions = this.tableActions;

			// // filter actions by permissions
			// editedActions = this.tableActions.filter((action) =>
			// 	action.permission ? this.$_userHasPermission(action.permission) : true
			// );

			// // filter the delete action if school is external
			// if (!this.schoolInternallyManaged) {
			// 	editedActions = editedActions.filter(
			// 		(action) =>
			// 			action.label !==
			// 			this.$t("pages.administration.students.index.tableActions.delete")
			// 	);
			// }

			return editedActions;
		},
	},
	watch: {
		searchQuery() {
			console.log(this.searchQuery);
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
		onClickOutsideStandard() {
			this.models.base = false;
			console.log("clicked");
		},
		handleBulkConsent(rowIds, selectionType) {
			this.$store.commit("bulkConsent/setSelectedStudents", {
				students: this.tableSelection,
				selectionType: selectionType,
			});

			this.$router.push({
				path: "/administration/students/consent",
			});
		},
		async handleBulkEMail(rowIds, selectionType) {
			try {
				// TODO wrong use of store (not so bad)
				await this.$store.dispatch("users/sendRegistrationLink", {
					userIds: rowIds,
					selectionType,
				});
				this.$toast.success(
					this.$tc("pages.administration.sendMail.success", rowIds.length)
				);
			} catch (error) {
				console.error(error);
				this.$toast.error(
					this.$tc("pages.administration.sendMail.error", rowIds.length)
				);
			}
		},
		async handleBulkQR() {
			const userIds = this.tableSelection;

			try {
				await this.$store.dispatch("users/getQrRegistrationLinks", {
					userIds: userIds,
					selectionType: "inclusive",
					roleName: "student",
				});
				if (this.qrLinks.length) {
					this.$_printQRs(this.qrLinks);
				} else {
					this.$toast.info(this.$tc("pages.administration.printQr.emptyUser"));
				}
			} catch (error) {
				this.$toast.error(
					this.$tc("pages.administration.printQr.error", userIds.length)
				);
			}
		},
		handleBulkDelete() {
			const userIds = this.tableSelection;

			const onConfirm = async () => {
				try {
					// TODO wrong use of store (not so bad)
					await this.$store.dispatch("users/deleteUsers", {
						ids: userIds,
						userType: "student",
					});
					this.$toast.success(this.$t("pages.administration.remove.success"));
					this.find();
				} catch (error) {
					this.$toast.error(this.$t("pages.administration.remove.error"));
				}
			};
			const onCancel = () => {
				this.$set(this, "tableSelection", []);
				this.tableSelectionType = "inclusive";
			};

			const message = this.$tc(
				"pages.administration.students.index.remove.confirm.message.some",
				userIds.length,
				{ number: userIds.length }
			);

			this.$dialog.confirm({
				message,
				confirmText: this.$t(
					"pages.administration.students.index.remove.confirm.btnText"
				),
				cancelText: this.$t("common.actions.cancel"),
				icon: "report_problem",
				iconSource: "material",
				iconColor: "var(--color-danger)",
				actionDesign: "danger",
				onConfirm,
				onCancel,
				invertedDesign: true,
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
	// display: flex;
	// flex-wrap: wrap;
	// align-items: center;
	// justify-content: space-between;
	width: 100%;
	// padding: var(--space-xs) var(--space-md);
	margin-bottom: var(--space-xs);
	color: var(--color-on-tertiary-light);
	background-color: var(--color-tertiary-light);
}
.blank-section {
	min-height: 58px;
	margin-bottom: var(--space-xs);
}
</style>
