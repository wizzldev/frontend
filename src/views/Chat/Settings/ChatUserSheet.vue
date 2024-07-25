<template>
  <BottomSheet :visible="show" @close="$emit('close')">
    <header class="border-b border-tertiary">
      <h2 class="m-5 text-lg flex items-center space-x-1">
        <span v-emoji>{{ user.first_name }} {{ user.last_name }}</span>
        <VerifiedBadge class="text-yellow-400" v-if="user.is_verified" />
      </h2>
    </header>
    <main>
      <SheetButton :icon="Judge" v-if="!isPM && roles.includes(Roles.KickUser)">
        {{ $t('Ban or Kick') }}
      </SheetButton>
      <SheetButton :smallIcon="true" :icon="Pen" v-if="isPM || roles.includes(Roles.Admin) || user.id == auth.user?.id">
        {{ $t('Edit nickname') }}
      </SheetButton>
    </main>
  </BottomSheet>
</template>

<script setup lang="ts">
import VerifiedBadge from '@/components/Icons/VerifiedBadge.vue'
import type { User } from '@/types/user'
import BottomSheet from '@/components/BottomSheet.vue'
import SheetButton from '@/components/SheetButton.vue'
import Judge from '@/components/Icons/Judge.vue'
import { Roles } from '@/scripts/roles'
import Pen from '@/components/Icons/Pen.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

defineProps<{
  show: boolean
  user: User
  roles: Array<string>
  isPM: boolean
}>()
</script>