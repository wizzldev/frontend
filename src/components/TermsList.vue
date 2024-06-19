<template>
      <div v-if="!isLoading" class="overflow-y-scroll">
        <template v-for="sect in terms" :key="sect">
          <div v-if="sect[0] == 'heading'" class="my-3 bg-secondary px-4 py-3 rounded-lg">
            <h2 class="text-2xl fontMitr">{{ sect[1] }}</h2>
          </div>
          <p class="my-3" v-if="sect[0] == 'paragraph'">{{ sect[1] }}</p>
          <div v-if="sect[0] == 'secondary_heading'" class="my-2 bg-secondary px-4 py-3 rounded-lg">
            <h2 class="text-xl fontMitr">{{ sect[1] }}</h2>
          </div>
          <div v-if="sect[0] == 'list'" class="px-5">
            <ol class="list-decimal">
              <li class="pb-3 md:text-lg" v-for="item in sect[1]" :key="item">{{ item }}</li>
            </ol>
          </div>
        </template>
        <PushButton
          to="/"
          :isLink="true"
          class="my-5 transition-colors w-full bg-purple-500 hover:bg-purple-400 focus:bg-purple-400 py-2.5 rounded-xl mt-3 fontTheme flex items-center space-x-2 justify-center"
        >{{$t('Back')}}</PushButton>
      </div>
</template>
<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {Ref} from 'vue'
import {useI18n} from "vue-i18n";
import PushButton from '@/components/Elements/PushButton.vue'

const props = defineProps<{
  list: unknown;
}>()

export type ServiceTerms = Array<Record<string, string|Array<string>>>

const i18n = useI18n()

const isLoading = ref(true)
const terms = ref({}) as Ref<ServiceTerms>

onMounted(async () => {
  const locale = i18n.locale.value
  let key: string
  if(Object.keys(props.list as object).includes(locale)) {
    key = locale
  } else key = 'en'
  if(props.list??[key]) {
    terms.value = (props.list as Record<string, any>)[key]
  }
  isLoading.value = false
})
</script>