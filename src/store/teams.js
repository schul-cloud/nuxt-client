import mergeDeep from '@utils/merge-deep'
import serviceTemplate from '@utils/service-template'
const base = serviceTemplate('teams')

const module = mergeDeep(base, {
  actions: {
    async acceptInvitation (ctx, teamId) {
      return this.$axios.$get('/teams/extern/accept/' + teamId)
    },
    async getMyInvitations () {
      return this.$axios.$get('/teams/extern/get/')
    },
    async inviteExternal (ctx, payload) {
      return this.$axios.$patch('/teams/extern/add/' + payload.teamId, {
        userId: payload.userId,
        email: payload.email,
        role: payload.role
      })
    },
    async resendInvitation (ctx, payload) {
      return this.$axios.$patch('/teams/extern/add/' + payload.teamId, {
        email: payload.email
      })
    },
    async deleteInvitation (ctx, payload) {
      return this.$axios.$patch('/teams/extern/remove/' + payload.teamId, {
        email: payload.email
      })
    }
  },
  getters: {
    hasTeamPermission: (_state, localGetters) => (permission) => {
      return localGetters.current.user
        ? localGetters.current.user.permissions.find(p => p === permission)
        : false
    }
  }
})

export default module
