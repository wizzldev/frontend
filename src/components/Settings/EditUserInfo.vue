<template>
  <section class="mx-4">
    <form v-on:submit.prevent>
      <h2 class="text-lg font-bold">{{ $t('General information') }}</h2>
      <div class="my-2">
        <label class="text-sm text-gray-200">{{ $t('First name') }}</label>
        <input id="first_name" :disabled="processing" :placeholder="$t('First name')" v-model.lazy="data.first_name" class="w-full bg-secondary-all px-4 py-2 rounded-xl">
        <label class="text-red-400" v-if="'first_name' in errors" :for="`first_name`">{{
            errors['first_name']
          }}</label>
      </div>

      <div class="my-2">
        <label class="text-sm text-gray-200" for="last_name">{{ $t('Last name') }}</label>
        <input id="last_name" :disabled="processing" :placeholder="$t('Last name')" v-model.lazy="data.last_name" class="w-full bg-secondary-all px-4 py-2 rounded-xl">
        <label class="text-red-400" v-if="'last_name' in errors" :for="`last_name`">{{
            errors['last_name']
          }}</label>
      </div>

      <FormButton class="!py-2" title="Save" :processing="processing" @submit="update" />

      <p class="text-red-400" v-if="error != ''">{{ $t(error) }}</p>
    </form>
  </section>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import FormButton from '@/components/Auth/FormButton.vue'
import { reactive, type Ref, ref } from 'vue'
import request from '@/scripts/request/request'
import translateError, { type Errors } from '@/scripts/translator/errors'
import type { User } from '@/types/user'

const auth = useAuthStore()
const processing = ref(false)

const data = reactive({
  first_name: auth.user?.first_name,
  last_name: auth.user?.last_name
})
const error = ref('')
const errors = ref({}) as Ref<Errors>

const update = async () =>  {
  errors.value = {}
  error.value = ''
  processing.value = true
  const res = await request.put('/me', {
    first_name: data.first_name,
    last_name: data.last_name
  })
  processing.value = false
  if (res.data?.$error) {
    if (res.data?.error) error.value = res.data.error
    if (res.data?.errors) errors.value = translateError(res.data.errors)
    if (res.data?.$network) error.value = 'error.network'
  } else {
    // do the actual thing in the view
    auth.user = res.data as User
  }
}
</script>