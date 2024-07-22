<template>
  <form v-on:submit.prevent>
    <template v-for="(field, key) in fields" :key="key">
      <div class="my-2">
        <label class="text-gray-200" :for="`for-${field.name}.${key}`">{{ $t(field.label) }}</label>
        <div class="relative">
          <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <component :is="field.icon" class="text-gray-400" :class="passwordColor(field)" />
          </div>
          <input
            class="w-full bg-secondary-all pl-12 pr-4 py-2.5 rounded-xl"
            :disabled="processing"
            :placeholder="field.placeholder ? $t(field.placeholder) : ''"
            :type="field.type || 'text'"
            :id="`for-${field.name}.${key}`"
            v-model="data[field.name]"
          />
        </div>
        <label class="text-red-400" v-if="field.name in errors" :for="`for-${field.name}.${key}`">{{
          errors[field.name]
        }}</label>
      </div>
    </template>
    <FormButton title="Submit" :processing="processing" @submit="submit" />
    <p class="text-red-400" v-if="error != ''">{{ $t(error) }}</p>
  </form>
  <IPModal :show="ipModal" @close="ipModal = false" />
</template>

<script setup lang="ts">
import { type Component, type Ref, ref } from 'vue'
import translateError, { type Errors } from '../../scripts/translator/errors'
import request from '@/scripts/request/request'
import { passwordStrength } from 'check-password-strength'
import FormButton from '@/components/Auth/FormButton.vue'
import IPModal from '@/components/Modals/IPModal.vue'

interface Field {
  icon: Component
  name: string
  label: string
  placeholder: string | undefined
  type: string | undefined
}

const props = defineProps<{
  fields: Array<Field>
  resource: string
  passwordCheck: boolean
}>()

const emit = defineEmits(['success'])

const data = ref({}) as Ref<Record<string, string | number>>
const processing = ref(false)

const error = ref('')
const errors = ref({}) as Ref<Errors>

const ipModal = ref(false)

const submit = async () => {
  error.value = ''
  errors.value = {}
  processing.value = true

  let res = await request.post(props.resource, data.value)
  // status is an error
  if (res.data?.$error) {
    if (res.data?.error) error.value = res.data.error
    if (res.data?.errors) errors.value = translateError(res.data.errors)
    if (res.data?.$network) error.value = 'error.network'
    if (res.data?.show_ip_modal) ipModal.value = true
  } else {
    // do the actual thing in the view
    emit('success', res.data)
  }

  processing.value = false
}

const passwordColor = (field: Field): string => {
  if (!props.passwordCheck || field.type != 'password') return ''

  const classMap = ['text-red-400', 'text-red-300', 'text-green-300', 'text-green-400']
  const fieldValue = field.name in data.value ? data.value[field.name] : ''
  const strength = passwordStrength(`${fieldValue}`)
  return classMap[strength.id]
}
</script>
