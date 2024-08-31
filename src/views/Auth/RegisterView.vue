<template>
  <GuestLayout>
    <h1 class="text-2xl fontTheme">{{ $t('Register') }}</h1>
    <hr class="bg-tertiary w-full border-none h-1 rounded-full my-3" />
    <AutoForm
      resource="/register"
      :fields="[
        {
          icon: Person,
          name: 'first_name',
          type: 'string',
          label: 'First name',
          placeholder: 'John'
        },
        {
          icon: Person,
          name: 'last_name',
          type: 'string',
          label: 'Last name',
          placeholder: 'Doe'
        },
        {
          icon: EmailAt,
          name: 'email',
          type: 'email',
          label: 'Email address',
          placeholder: 'email@wizzl.app'
        },
        {
          icon: Lock,
          name: 'password',
          type: 'password',
          label: 'Password',
          placeholder: 'Password'
        }
      ]"
      :password-check="true"
      @success="handleRegister"
    />
    <div>
      <p class="mt-2 text-gray-400 text-sm">
        {{ $t('Already have an account?') }}
        <router-link :to="{ name: 'auth.login' }">{{ $t('Login') }}</router-link>
      </p>
    </div>
  </GuestLayout>
  <Modal :show="verifyModal" @close="verifyModal = false">
    <h2 class="text-2xl fontTheme">{{ $t('Successfully registered') }}</h2>
    <p class="text-gray-400 mt-3 text-left">
      {{ $t('Just a few more steps, we have sent a verification email, follow the instructions, and we\'ll meet.') }}
      {{ $t('Don\'t forget to check the spam folder as well.') }}
    </p>
    <FormButton title="Okay" :processing="false" @click="verifyModal = false" />
  </Modal>
</template>

<script setup lang="ts">
import GuestLayout from '@/layouts/GuestLayout.vue'
import AutoForm from '@/components/Auth/AutoForm.vue'
import EmailAt from '@/components/Icons/EmailAt.vue'
import Lock from '@/components/Icons/Lock.vue'
import Person from '@/components/Icons/Person.vue'
import Modal from '@/components/Modals/Modal.vue'
import { onMounted, ref } from 'vue'
import FormButton from '@/components/Auth/FormButton.vue'

const verifyModal = ref(false)

const handleRegister = () => {
  verifyModal.value = true
}

onMounted(() => verifyModal.value = false)
</script>
