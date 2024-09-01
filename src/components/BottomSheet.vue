<template>
  <teleport to="body">
    <Sheet class="z-9999" v-model:visible="show">
      <template #header>
        <div class="text-center pt-2">
          <div class="bg-gray-500 h-[4.5px] w-[50px] rounded-lg mx-auto"></div>
        </div>
      </template>
      <slot />
    </Sheet>
  </teleport>
</template>
<script setup lang="ts">
import { Sheet } from 'bottom-sheet-vue3'
import { ref, watch } from 'vue'

const props = defineProps<{
  visible: boolean
}>()
const emit = defineEmits(['close'])

const show = ref(false)

watch(props, (p) => {
  show.value = p.visible
})

watch(show, (s) => {
  if (!s) emit('close')
})
</script>
