<template>
  <section class="mx-4 my-4">
    <h2 class="text-lg font-bold">{{ $t('Danger Zone') }}</h2>
    <PushButton
      @click="deletionStarted = true"
      :is-link="false"
      class="w-full bg-red-all py-2 rounded-xl mt-3 fontTheme flex items-center space-x-2 justify-center"
    >
      {{ $t('Delete account') }}
    </PushButton>
  </section>
  <Modal :show="deletionStarted" @close="retain">
    <h2 class="text-2xl fontTheme">{{ $t('Are you sure?') }}</h2>
    <div class="mt-2">
      <p class="text-left">
        {{
          $t(
            'If you delete your account, all your data will be deleted and you will not be able to restore it'
          )
        }}
      </p>
      <div v-if="!nextDelete" class="grid grid-cols-2 gap-2">
        <PushButton
          @click="retain"
          :is-link="false"
          class="w-full bg-tertiary-all py-2 rounded-xl mt-3 fontTheme flex items-center space-x-2 justify-center"
        >
          {{ $t('Retain') }}
        </PushButton>
        <PushButton
          :is-link="false"
          @click="nextDelete = true"
          class="w-full bg-red-all py-2 rounded-xl mt-3 fontTheme flex items-center space-x-2 justify-center"
        >
          {{ $t('Delete') }}
        </PushButton>
      </div>
      <form v-on:submit.prevent v-else class="mt-2">
        <IconInput
          v-model.lazy="pw"
          :disabled="deleting"
          class="border border-tertiary rounded-xl"
          :placeholder="$t('Password')"
          :icon="Lock"
        />
        <PushButton
          :is-link="false"
          @click="del"
          :loading="deleting"
          class="w-full bg-red-all py-2 rounded-xl mt-3 fontTheme flex items-center space-x-2 justify-center"
        >
          {{ $t('Delete') }}
        </PushButton>
      </form>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import PushButton from '@/components/Elements/PushButton.vue'
import Modal from '@/components/Modals/Modal.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/scripts/request/request'
import IconInput from '@/components/Elements/IconInput.vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import Lock from '@/components/Icons/Lock.vue'

const router = useRouter()
const toast = useToast()
const i18n = useI18n()
const deletionStarted = ref(false)
const nextDelete = ref(false)
const deleting = ref(false)
const pw = ref('')

const retain = () => {
  deletionStarted.value = false
  nextDelete.value = false
  deleting.value = false
}

const del = async () => {
  deleting.value = true
  const res = await request.post('/me/delete', { password: pw.value })
  if (!res.data.$error) {
    toast.success(i18n.t('Your account successfully deleted'))
    await router.push('/')
    return
  }

  toast.error(i18n.t('Failed to delete your account'))
  retain()
}
</script>
