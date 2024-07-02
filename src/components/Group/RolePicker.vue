<template>
  <label class="text-gray-200">{{ $t('Roles') }}</label>
  <p class="text-sm my-1 text-gray-400">
    {{ $t('Note') }}:
    {{
      $t(
        'Selected roles will be assigned to all users when they join, and you will be the creator.'
      )
    }}
    <a
      class="transition-colors text-purple-400 hover:text-purple-500 focus:text-purple-500"
      :href="`${supportHost}/q?roles`"
    >{{ $t('Read more') }}</a
    >
  </p>
  <template v-for="role in roles" :key="role">
    <button
      :disabled="yourRoles && (!yourRoles.includes(role) || (!yourRoles.includes('CREATOR') && role == 'ADMIN'))"
      class="block w-full py-1.5 px-2 bg-secondary-all my-2 rounded-xl text-white disabled:cursor-not-allowed disabled:opacity-75"
      :class="{
              '!bg-purple-500 !hover:bg-purple-400 !focus:bg-purple-400': active.includes(role)
            }"
      @click="toggle(role)"
    >
      {{ role }}
    </button>
  </template>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  roles: Array<string>
  active: Array<string>
  yourRoles?: Array<string> | undefined
}>()

const supportHost = ref(window.GLOBAL_ENV.SUPPORT_HOST)

const emit = defineEmits(['toggle'])

const toggle = (role: string) => {
  emit('toggle', role)
}
</script>