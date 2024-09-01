<template>
  <PushButton
    v-if="!isPrivateMessage && yourRoles.includes(Roles.InviteUser)"
    @click="show = true"
    class="transition-colors w-full text-white bg-secondary-all py-2 rounded-xl mt-3 fontTheme flex items-center space-x-2 justify-center"
  >
    {{ $t('Create an invite') }}
  </PushButton>

  <PushButton
    v-if="!isPrivateMessage && yourRoles.includes(Roles.InviteUser)"
    @click="showCustom = true"
    class="transition-colors w-full text-white bg-secondary-all py-2 rounded-xl mt-3 fontTheme flex items-center space-x-2 justify-center"
  >
    {{ $t('Manage special invite') }}
  </PushButton>

  <Modal :show="show" @close="show = false">
    <h2 class="text-2xl fontTheme">{{ $t('Create an invite') }}</h2>
    <form v-on:submit.prevent class="mt-3" v-if="!createdCode">
      <div class="text-left mt-2">
        <label for="m-usage" class="text-sm text-gray-400 ml-2"
          ><b>{{ $t('Max usage') }}</b> ({{ $t('empty/0 for no limit') }}).</label
        >
        <IconInput
          id="m-usage"
          v-model.lazy="count"
          :value="count"
          placeholder="Max usage (empty/0 for no limit)"
          :has-border="true"
          type="number"
        />
      </div>
      <div class="text-left mt-2">
        <label for="m-date" class="text-sm text-gray-400 ml-2"
          ><b>{{ $t('Expiration') }}</b> ({{ $t('empty for no expiry') }}).</label
        >
        <IconInput
          id="m-date"
          v-model.lazy="date"
          :value="date"
          placeholder="Expiration (empty for no expiry)"
          :has-border="true"
          :has-clear="true"
          type="date"
        />
      </div>
      <FormButtonSecondary class="bg-tertiary-all !py-2" title="Clear date" @click="date = ''" />
      <FormButton @click="create" title="Create" :processing="loading" />
    </form>
    <div class="mt-3" v-else>
      <div class="w-full border border-tertiary p-2 rounded-lg flex items-center">
        <p>{{ inviteUri }}</p>
        <button class="ml-auto px-2 py-0.5 bg-secondary-all rounded-lg">
          <ClipboardIcon @click="copy" class="text-gray-400" />
        </button>
      </div>
      <FormButtonSecondary
        class="border border-tertiary !py-2"
        title="Close"
        @click="show = false"
      />
    </div>
  </Modal>

  <Modal :show="showCustom" @close="showCustom = false">
    <h2 class="text-2xl fontTheme">{{ $t('Setup a custom invite') }}</h2>
    <form v-on:submit.prevent class="mt-3" v-if="!createdCode">
      <div class="text-left mt-2">
        <label for="m-name" class="text-sm text-gray-400 ml-2"
          ><b>{{ inviteHost }}/{{ specInvite || '...' }}</b></label
        >
        <IconInput
          id="m-name"
          v-model="specInvite"
          :value="specInvite || undefined"
          :placeholder="$t('super-cool')"
          :has-border="true"
        />
      </div>
      <FormButtonSecondary
        type="button"
        @click="updateCustom(null)"
        :processing="removeCustomProgress"
        class="bg-tertiary-all !py-2"
        title="Remove"
      />
      <FormButton
        type="submit"
        @click="updateCustom(specInvite)"
        :title="!specialInvite ? 'Create' : 'Update'"
        :processing="updateCustomProgress"
      />
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { Roles } from '@/scripts/roles'
import PushButton from '@/components/Elements/PushButton.vue'
import Modal from '@/components/Modals/Modal.vue'
import { computed, onMounted, ref } from 'vue'
import request from '@/scripts/request/request'
import IconInput from '@/components/Elements/IconInput.vue'
import FormButtonSecondary from '@/components/Auth/FormButtonSecondary.vue'
import FormButton from '@/components/Auth/FormButton.vue'
import { useRoute } from 'vue-router'
import moment from 'moment'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ClipboardIcon from '@/components/Icons/Clipboard.vue'
import { Clipboard } from '@capacitor/clipboard'

const props = defineProps<{
  isPrivateMessage: boolean
  yourRoles: Array<string>
  specialInvite: string | null
}>()

const route = useRoute()
const i18n = useI18n()
const toast = useToast()
const emit = defineEmits(['reload'])

const inviteHost = ref(`https://${window.GLOBAL_ENV.INVITE_HOST}`)
const inviteUri = computed(() => `https://${window.GLOBAL_ENV.INVITE_HOST}/${createdCode.value}`)

const loading = ref(false)
const show = ref(false)
const showCustom = ref(false)
const date = ref('')
const count = ref('')
const createdCode = ref('')
const specInvite = ref<string | null>('')
const removeCustomProgress = ref(false)
const updateCustomProgress = ref(false)

const create = async () => {
  loading.value = true
  let data = { max_usage: count.value != '' ? parseInt(count.value as string) : 0 } as {
    max_usage: number
    expiration?: string
  }
  if (date.value != '')
    data.expiration = moment(new Date(date.value)).format('YYYY-MM-DDTHH:mm:ssZ')

  const res = await request.post(`/chat/${route.params.id as string}/new-invite`, data)
  if (res.data.$error || !res.data.key) {
    toast.error(i18n.t('Invalid max usage or expiration'))
  }
  loading.value = false

  if (res.data.key) createdCode.value = res.data.key
}

const updateCustom = async (inv: string | null) => {
  const data = { invite: inv || '' }
  if (inv) updateCustomProgress.value = true
  else removeCustomProgress.value = false

  const res = await request.put(`/chat/${route.params.id as string}/invite`, data)
  const resData = res.data as { status?: string }
  if (res.data.$error && !resData.status) {
    toast.error(i18n.t('Something went wrong'))
  } else if (resData.status == 'already-exists') {
    toast.warning(i18n.t('This invite is already exists'))
  } else if (!res.data.$error) {
    inv ? toast.success(i18n.t('Successfully updated')) : toast.info(i18n.t('Successfully removed'))
    emit('reload')
  }

  updateCustomProgress.value = false
  removeCustomProgress.value = false
}

const copy = async () => {
  await Clipboard.write({
    string: inviteUri.value
  })
  toast.info(i18n.t('Copied to clipboard'))
}

onMounted(() => {
  loading.value = false
  show.value = false
  date.value = ''
  count.value = ''
  createdCode.value = ''
  specInvite.value = props.specialInvite || ''
})
</script>
