import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'
import type { User } from '@/types/user'
import { WizzlGroupMakeSave } from '@/scripts/consts'

export const useGroupMakeStore = defineStore('groupMake', () => {
  const users = ref([]) as Ref<Array<User>>
  const selectedRoles = ref([]) as Ref<Array<string>>

  function initialize() {
    const data = window.localStorage.getItem(WizzlGroupMakeSave)
    if(!data) return
    const json = JSON.parse(data)
    if(!json) return
    users.value = (json as { users: Array<User> }).users
    selectedRoles.value = (json as {roles: Array<string>}).roles
  }

  function save() {
    window.localStorage.setItem(WizzlGroupMakeSave, JSON.stringify({users: users.value, roles: selectedRoles.value}))
  }

  return {initialize, users, selectedRoles, save}
})