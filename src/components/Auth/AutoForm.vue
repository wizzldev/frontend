<template>
  <form v-on:submit.prevent>
    <template v-for="(field, key) in fields" :key="key">
      <div class="my-2">
        <label :for="`for-${field.name}.${key}`">{{ $t(field.label) }}</label>
        <input
          :disabled="processing"
          :placeholder="field.placeholder ? $t(field.placeholder) : ''"
          :type="field.type || 'text'"
          :id="`for-${field.name}.${key}`"
          v-model.lazy="data[field.name]"
          class="transition-colors mt-1 bg-gray-900 w-full px-4 py-2.5 rounded-lg border-2"
        />
        <label v-if="field.name in errors" :for="`for-${field.name}.${key}`">{{
          errors[field.name]
        }}</label>
      </div>
    </template>
    <button @click="submit" :disabled="processing">
      {{ $t('Submit') }}
    </button>
    <p class="text-red-500" v-if="error != ''">{{ error }}</p>
  </form>
</template>

<script setup lang="ts">
import { type Ref, ref } from 'vue'
import translateError, { type Errors } from '../../scripts/translator/errors'
import request from '@/scripts/request/request'

interface Field {
  name: string
  label: string
  placeholder: string | undefined
  type: string | undefined
}

const props = defineProps<{
  fields: Array<Field>
  resource: string
}>()

const emit = defineEmits(['success'])

const data = ref({}) as Ref<Record<string, string | number>>
const processing = ref(false)

const error = ref('')
const errors = ref({}) as Ref<Errors>

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
  } else {
    // do the actual thing in the view
    emit('success', res.data)
  }

  processing.value = false
}
</script>
