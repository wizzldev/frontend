<template>
  <PushButton
    @click="editStart = true"
    class="transition-colors w-full text-white bg-secondary-all py-2 rounded-xl mt-3 fontTheme flex items-center space-x-2 justify-center"
  >
    {{ $t('Edit emoji') }}: {{ emoji }}
  </PushButton>

  <Modal :show="editStart" @close="editStart = false">
    <h2 class="text-2xl fontTheme">{{ $t('Edit emoji') }}</h2>
    <p class="my-2 text-sm text-gray-400 text-left">
      {{ $t('It\'s possible that some emoji are not in our list and may not be available') }}
    </p>
    <form v-on:submit.prevent>
      <div class="text-left mt-2">
        <label for="m-emoji" class="text-sm text-gray-400 ml-2"
        ><b>{{ $t('Fast reaction emoji') }}</b></label
        >
        <IconInput
          id="m-emoji"
          v-model.lazy="emojiNew"
          :value="emojiNew"
          placeholder="Emoji"
          :has-border="true"
        />
      </div>
      <FormButton @click="save" title="Create" :processing="loading" />
    </form>
  </Modal>
</template>

<script setup lang="ts">
import PushButton from '@/components/Elements/PushButton.vue'
import Modal from '@/components/Modals/Modal.vue'
import { ref } from 'vue'
import IconInput from '@/components/Elements/IconInput.vue'
import FormButton from '@/components/Auth/FormButton.vue'
import request from '@/scripts/request/request'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  emoji: string
}>()

const route = useRoute()

const editStart = ref(false)
const emojiNew = ref(props.emoji)
const loading = ref(false)
const { success, error } = useToast()
const { t: translate } = useI18n()
const emit = defineEmits(['reload'])

const save = async () => {
  loading.value = true
  const res = await request.put(`/chat/${route.params.id as string}/emoji`, { emoji: emojiNew.value })
  if(res.data.$error) {
    error(translate('Failed to update emoji'))
  } else {
    success(translate('Emoji successfully updated.'))
    emit('reload')
  }
  loading.value = false
}
</script>