<template>
  <SettingsLayout>
    <section class="mx-4 mt-5">
      <h2 class="text-xl fontTheme font-bold">{{ $t('Cookies') }} <Cookie /></h2>
      <p v-emoji class="text-red-500 font-bold mt-1">
        {{ $t('Never share this data with anyone') }} ❗
      </p>
      <div class="mt-5">
        <ul>
          <li
            class="bg-secondary first:rounded-t-lg last:rounded-b-lg px-2 py-3 flex items-center border-b border-tertiary last:border-b-0"
            v-for="(value, key) in cookies"
            :key="key"
          >
            <div class="ml-5">
              <h2 class="text-gray-200 text-sm font-bold">{{ key }}</h2>
            </div>
            <div
              @click="sensitiveCookieList.includes(key) ? safeCopy({ key, value }) : copy(value)"
              class="w-8 h-8 rounded-full bg-tertiary-all text-gray-400 hover:text-white focus:text-white cursor-pointer flex items-center justify-center ml-auto"
            >
              <ClipboardIcon />
            </div>
          </li>
        </ul>
      </div>
    </section>
  </SettingsLayout>

  <Modal :show="safeCopyData != undefined" @close="safeCopyData = undefined">
    <h2 class="text-2xl fontTheme" v-emoji>{{ $t('This cookie contains sensitive data') }} 🫣</h2>
    <div class="w-full bg-gray-700 rounded-lg text-center py-1 px-2 my-2 fontCode">
      {{ safeCopyData?.key }}
    </div>
    <DevSettingsButton
      @click="copy(safeCopyData?.value || '')"
      class="flex items-center justify-center space-x-2"
    >
      <span>{{ $t('Copy') }}</span>
      <ClipboardIcon />
    </DevSettingsButton>
  </Modal>
</template>

<script setup lang="ts">
import SettingsLayout from '@/layouts/SettingsLayout.vue'
import useCookie from '@/composables/useCookie'
import { onMounted, ref } from 'vue'
import ClipboardIcon from '@/components/Icons/Clipboard.vue'
import { Clipboard } from '@capacitor/clipboard'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { WizzlAuthToken } from '@/scripts/consts'
import Modal from '@/components/Modals/Modal.vue'
import PushButtonSecondary from '@/components/Elements/PushButtonSecondary.vue'
import DevSettingsButton from '@/components/Group/DevSettingsButton.vue'
import Cookie from '@/components/Icons/Cookie.vue'

const { info } = useToast()
const { t } = useI18n()
const { getAll } = useCookie()
const cookies = ref<Record<string, string>>({})
const sensitiveCookieList = ref([WizzlAuthToken])
const safeCopyData = ref<{ key: string; value: string } | undefined>(undefined)

onMounted(async () => (cookies.value = await getAll()))

const copy = async (string: string) => {
  await Clipboard.write({
    string
  })
  info(t('Successfully copied'))
}

const safeCopy = async (data: { key: string; value: string }) => {
  safeCopyData.value = data
}
</script>
