<template>
  <Teleport to="body">
    <div v-if="show" class="fixed top-0 left-0 w-full h-screen bg-main opacity-80 z-[999]"></div>
    <transition name="pop" appear>
      <div v-if="show" class="h-screen w-full flex fixed top-0 left-0 z-[9999]">
        <div class="my-auto w-full px-2">
          <div class="relative bg-secondary rounded-xl shadow max-w-sm mx-auto">
            <button
              v-if="!disableClose"
              type="button"
              class="transition duration-150 absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-tertiary rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
              @click="close"
            >
              <svg
                class="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span class="sr-only">{{ $t('Close') }}</span>
            </button>
            <div class="p-6 text-center">
              <slot />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
  disableClose?: boolean
}>()

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}
</script>

<style>
.pop-enter-active,
.pop-leave-active {
  transition:
    transform 0.4s cubic-bezier(0.5, 0, 0.5, 1),
    opacity 0.4s linear;
}

.pop-enter,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.3) translateY(-50%);
}
</style>
