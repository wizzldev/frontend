<template>
  <BottomSheet :visible="visible" @close="$emit('close')">
    <header class="border-b border-tertiary">
      <h2 class="m-5 text-lg">
        {{ contact.name }}
        <VerifiedBadge class="text-yellow-400" v-if="contact.is_verified" />
      </h2>
    </header>
    <main>
      <SheetButton :icon="Trash">
        {{ $t('Delete') }}
      </SheetButton>
      <SheetButton v-if="contact.is_private_message" :icon="Block">
        {{ $t('Block') }}
      </SheetButton>
      <SheetButton :icon="Leave" v-else>
        {{ $t('Leave group') }}
      </SheetButton>
    </main>
  </BottomSheet>
</template>
<script setup lang="ts">
import BottomSheet from '@/components/BottomSheet.vue'
import type { Contact } from '@/types/contact'
import VerifiedBadge from '@/components/Icons/VerifiedBadge.vue'
import SheetButton from '@/components/SheetButton.vue'
import Trash from '@/components/Icons/Trash.vue'
import Block from '@/components/Icons/Block.vue'
import Leave from '@/components/Icons/Leave.vue'

defineProps<{
  visible: boolean
  contact: Contact
}>()
</script>