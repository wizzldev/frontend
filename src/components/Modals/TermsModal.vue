<template>
  <Modal :show="mounted && !isTermsAccepted && !isTermsPage" :disable-close="true">
    <h2 class="text-2xl fontTheme">{{ $t('Terms and conditions') }}</h2>
    <div class="mt-2 text-left">
      <p class="text-gray-400">
        {{ $t('Accept our terms and conditions before using our product.') }}
      </p>
      <p class="mt-2">
        {{ $t('Direct links') }}:<br />
        <router-link class="text-blue-400" to="/terms">{{ $t('Terms and conditions') }}</router-link
        ><br />
        <router-link class="text-blue-400" to="/privacy">{{ $t('Privacy Policy') }}</router-link>
      </p>
      <PushButton
        :is-link="false"
        class="transition-colors w-full bg-purple-500 hover:bg-purple-400 focus:bg-purple-400 py-2.5 rounded-xl mt-3 fontTheme flex items-center space-x-2 justify-center"
        @click="accept"
        >{{ $t('I understand and I accept') }}</PushButton
      >
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '@/components/Modals/Modal.vue'
import PushButton from '@/components/Elements/PushButton.vue'
import { onMounted, ref, watch } from 'vue'
import { type RouteLocationNormalized, useRoute, useRouter } from 'vue-router'
import { isApp } from '@/scripts/mobile/isApp'
import { WizzlTermsAccepted } from '@/scripts/consts'
import useCookie from '@/composables/useCookie'

const route = useRoute()
const router = useRouter()
const cookie = useCookie()

watch(route, (r: RouteLocationNormalized) => {
  isTermsPage.value = ['service.terms', 'service.privacy'].includes(r.name as string)
  if (isApp() && r.name == 'home') router.push({ name: 'chat.contacts' })
})

const mounted = ref(false)
const isTermsPage = ref(false)
const isTermsAccepted = ref(false)

const accept = async () => {
  await cookie.set(WizzlTermsAccepted, 'true')
  isTermsAccepted.value = true
}

onMounted(async () => {
  mounted.value = false
  const val = await cookie.get(WizzlTermsAccepted)
  isTermsAccepted.value = val == 'true'
  mounted.value = true
})
</script>
