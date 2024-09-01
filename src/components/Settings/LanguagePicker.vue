<template>
  <PushButton
    @click="showModal = true"
    class="transition-colors w-full bg-secondary-all py-2 rounded-xl mt-3 fontTheme flex items-center space-x-2 justify-center"
  >
    {{ $t('Language preference') }}
  </PushButton>

  <Modal :show="showModal" @close="showModal = false">
    <h2 class="text-2xl fontTheme" v-emoji>{{ $t('Language preference') }} 🌐</h2>
    <div class="mt-3 max-h-[200px] overflow-y-scroll">
      <template v-for="locale in i18n.availableLocales" :key="locale">
        <button
          @click="setLocale(locale)"
          class="transition-colors px-5 py-1.5 bg-gray-700 w-full my-1 rounded-lg"
          :class="{
            'bg-gray-700': i18n.locale.value != locale,
            'bg-purple-600': i18n.locale.value == locale
          }"
        >
          {{ i18n.t(locale, 1, { locale }) }}
          <span v-emoji>{{ i18n.t('flag', 1, { locale }) }}</span>
        </button>
      </template>
    </div>
    <p class="text-sm text-left text-gray-400 mt-2">
      Can't find your language? Help us add it. Join our
      <a class="text-purple-400 font-bold" :href="uri('discord')" target="_blank">Discord</a>
      community for more information.
    </p>
  </Modal>
</template>

<script setup lang="ts">
import PushButton from '@/components/Elements/PushButton.vue'
import { ref } from 'vue'
import Modal from '@/components/Modals/Modal.vue'
import { useI18n } from 'vue-i18n'
import useCookie from '@/composables/useCookie'
import { WizzlLocale } from '@/scripts/consts'

const showModal = ref(false)
const i18n = useI18n()
const cookie = useCookie()

const setLocale = async (locale: string) => {
  i18n.locale.value = locale
  await cookie.set(WizzlLocale, locale)
}

const uri = (s: string): string =>
  `https://${window.GLOBAL_ENV.LINK_HOST}/${s}?utm_source=wizzl.app&utm_medium=language-picker`
</script>
