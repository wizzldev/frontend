<template>
  <section>
    <form v-on:submit.prevent>
      <div class="my-2">
        <label class="text-sm text-gray-200">{{ $t('Group name') }}</label>
        <input
          id="name"
          :disabled="processing"
          :placeholder="$t('Group name')"
          v-model.lazy="data.name"
          class="w-full bg-secondary-all px-4 py-2 rounded-xl"
        />
        <label class="text-red-400" v-if="'name' in errors" :for="`name`">{{
          errors['name']
        }}</label>
      </div>

      <FormButton class="!py-2" title="Save" :processing="processing" @submit="update" />

      <p class="text-red-400" v-if="error != ''">{{ $t(error) }}</p>
    </form>
  </section>
</template>

<script setup lang="ts">
import FormButton from '@/components/Auth/FormButton.vue'
import { reactive, type Ref, ref } from 'vue'
import request from '@/scripts/request/request'
import translateError, { type Errors } from '@/scripts/translator/errors'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const route = useRoute()
const processing = ref(false)
const i18n = useI18n()
const toast = useToast()

const props = defineProps<{
  name: string
}>()

const data = reactive({
  name: props.name
})
const error = ref('')
const errors = ref({}) as Ref<Errors>

const update = async () => {
  errors.value = {}
  error.value = ''
  processing.value = true
  const res = await request.put(`/chat/${route.params.id as string}`, {
    name: data.name
  })
  processing.value = false
  if (res.data?.$error) {
    if (res.data?.error) error.value = res.data.error
    if (res.data?.errors) errors.value = translateError(res.data.errors)
    if (res.data?.$network) error.value = 'error.network'
  } else {
    // do the actual thing in the view
    toast.success(i18n.t('Successfully updated'))
  }
}
</script>
