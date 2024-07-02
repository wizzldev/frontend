<template>
  <div class="h-full w-full max-w-full flex space-y-1 overflow-y-scroll pt-4">
    <form v-on:submit.prevent class="px-4 w-full">
      <div>
        <label class="text-gray-200" for="chatName">{{ $t('Group name') }}</label>
        <IconInput
          v-model.lazy="chatName"
          :value="chatName"
          id="chatName"
          :icon="MagicWand"
          placeholder="Group name"
        />
      </div>
      <div class="mt-2">
        <RolePicker :roles="roles" :active="usedRoles" @toggle="toggle" />
      </div>
      <div class="mt-4">
        <p>{{ $t('All good?') }}</p>
        <button
          @click="$emit('create', chatName, usedRoles)"
          class="transition-colors my-2 w-full bg-purple-500 hover:bg-purple-400 focus:bg-purple-400 py-2 rounded-xl fontTheme flex items-center space-x-2 justify-center"
        >
          <span>{{ $t('Create') }}</span>
          <Spinner v-if="loading" />
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import IconInput from '@/components/Elements/IconInput.vue'
import MagicWand from '@/components/Icons/MagicWand.vue'
import { onMounted, type Ref, ref } from 'vue'
import request from '@/scripts/request/request'
import Spinner from '@/components/Icons/Spinner.vue'
import RolePicker from '@/components/Group/RolePicker.vue'

const roles = ref([]) as Ref<Array<string>>
const usedRoles = ref([]) as Ref<Array<string>>
const chatName = ref('')

defineProps<{
  loading: boolean
}>()

const fetchRoles = async () => {
  const res = await request.get('/chat/roles')
  if (!res?.data?.$error) {
    const r = res.data as { roles: Array<string>; recommended: Array<string> }
    roles.value = r.roles
    usedRoles.value = r.recommended
  }
}

const toggle = (role: string) => {
  if (usedRoles.value.includes(role)) usedRoles.value.splice(usedRoles.value.indexOf(role), 1)
  else usedRoles.value.push(role)
}

onMounted(fetchRoles)
</script>
