<template>
  <div class="min-h-screen h-auto overflow-hidden bg-div">
    <section class="flex h-screen overflow-hidden blurred-bg">
      <div class="m-auto z-2 w-full px-2 sm:px-0 sm:w-auto text-center">
        <div class="max-w-md mx-auto">
          <h1>
            <img src="../assets/vectors/wizzl-white-full.svg" alt="Wizzl" class="w-36 md:w-52 mx-auto" />
          </h1>
          <p class="mt-4 text-gray-400 text-lg" v-html="$t('Elevate your conversations with a platform that combines style, ease, and community.')"></p>
          <div class="md:grid md:grid-cols-7 md:gap-2 mt-3 md:px-5">
            <template v-if="!auth.isLoggedIn">
              <PushButtonSecondary class="col-span-3" :is-link="true" to-name="auth.login">
                {{ $t('Login') }}
              </PushButtonSecondary>
              <PushButtonSecondary class="col-span-3" :is-link="true" to-name="auth.register">
                {{ $t('Register') }}
              </PushButtonSecondary>
            </template>
            <template v-else>
              <PushButtonSecondary class="col-span-6 flex items-center px-3" :is-link="true" to-name="chat.contacts">
                <LazyImage class="w-5 h-5 rounded-lg" :src="cdnImage(auth.user?.image_url || '')" alt="Your profile image" />
                <span>{{ $t('Chat now') }}</span>
              </PushButtonSecondary>
            </template>
            <template v-if="!isApp()">
              <a target="_blank" rel="nofollow" :href="downloadUri"
                 class="hidden transition-colors text-white w-full bg-secondary-all py-2.5 rounded-xl mt-3 fontTheme sm:flex items-center space-x-2 justify-center"
              >
                <AndroidHead class="text-green-400" />
              </a>
              <a target="_blank" rel="nofollow" :href="downloadUri"
                 class="sm:hidden transition-colors text-white w-full bg-secondary-all py-2.5 rounded-xl mt-3 fontTheme flex items-center space-x-2 justify-center"
              >
                <span class="mr-2">Download</span>
                <AndroidHead class="text-green-400" />
              </a>
            </template>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import PushButtonSecondary from '@/components/Elements/PushButtonSecondary.vue'
import { useAuth2Store } from '@/stores/auth2'
import AndroidHead from '@/components/Icons/AndroidHead.vue'
import { ref } from 'vue'
import LazyImage from '@/components/Loaders/LazyImage.vue'
import { cdnImage } from '@/scripts/image'
import { isApp } from '@/scripts/mobile/isApp'

const auth = useAuth2Store()

const downloadUri = ref(window.GLOBAL_ENV.STATIC + '/beta.apk')
</script>

<style scoped>
.bg-div {
  background-image: url("data:image/svg+xml,%3Csvg id='visual' viewBox='0 0 900 600' width='900' height='600' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1'%3E%3Crect x='0' y='0' width='900' height='600' fill='%23121318'%3E%3C/rect%3E%3Cpath d='M0 465L21.5 457.3C43 449.7 86 434.3 128.8 431.7C171.7 429 214.3 439 257.2 437.2C300 435.3 343 421.7 385.8 422.7C428.7 423.7 471.3 439.3 514.2 448C557 456.7 600 458.3 642.8 460.3C685.7 462.3 728.3 464.7 771.2 464.5C814 464.3 857 461.7 878.5 460.3L900 459L900 601L878.5 601C857 601 814 601 771.2 601C728.3 601 685.7 601 642.8 601C600 601 557 601 514.2 601C471.3 601 428.7 601 385.8 601C343 601 300 601 257.2 601C214.3 601 171.7 601 128.8 601C86 601 43 601 21.5 601L0 601Z' fill='%23b26cf3'%3E%3C/path%3E%3Cpath d='M0 490L21.5 487.5C43 485 86 480 128.8 475C171.7 470 214.3 465 257.2 468.5C300 472 343 484 385.8 483.8C428.7 483.7 471.3 471.3 514.2 462.3C557 453.3 600 447.7 642.8 450.3C685.7 453 728.3 464 771.2 470.7C814 477.3 857 479.7 878.5 480.8L900 482L900 601L878.5 601C857 601 814 601 771.2 601C728.3 601 685.7 601 642.8 601C600 601 557 601 514.2 601C471.3 601 428.7 601 385.8 601C343 601 300 601 257.2 601C214.3 601 171.7 601 128.8 601C86 601 43 601 21.5 601L0 601Z' fill='%23b361f3'%3E%3C/path%3E%3Cpath d='M0 495L21.5 495.7C43 496.3 86 497.7 128.8 499.8C171.7 502 214.3 505 257.2 500.5C300 496 343 484 385.8 487.5C428.7 491 471.3 510 514.2 510.2C557 510.3 600 491.7 642.8 489.2C685.7 486.7 728.3 500.3 771.2 504.8C814 509.3 857 504.7 878.5 502.3L900 500L900 601L878.5 601C857 601 814 601 771.2 601C728.3 601 685.7 601 642.8 601C600 601 557 601 514.2 601C471.3 601 428.7 601 385.8 601C343 601 300 601 257.2 601C214.3 601 171.7 601 128.8 601C86 601 43 601 21.5 601L0 601Z' fill='%23b455f2'%3E%3C/path%3E%3Cpath d='M0 542L21.5 543.8C43 545.7 86 549.3 128.8 550.3C171.7 551.3 214.3 549.7 257.2 546.7C300 543.7 343 539.3 385.8 535C428.7 530.7 471.3 526.3 514.2 523.2C557 520 600 518 642.8 517.5C685.7 517 728.3 518 771.2 522.7C814 527.3 857 535.7 878.5 539.8L900 544L900 601L878.5 601C857 601 814 601 771.2 601C728.3 601 685.7 601 642.8 601C600 601 557 601 514.2 601C471.3 601 428.7 601 385.8 601C343 601 300 601 257.2 601C214.3 601 171.7 601 128.8 601C86 601 43 601 21.5 601L0 601Z' fill='%23b548f1'%3E%3C/path%3E%3Cpath d='M0 566L21.5 567.5C43 569 86 572 128.8 567.7C171.7 563.3 214.3 551.7 257.2 551.3C300 551 343 562 385.8 565.2C428.7 568.3 471.3 563.7 514.2 561.5C557 559.3 600 559.7 642.8 559.7C685.7 559.7 728.3 559.3 771.2 556.5C814 553.7 857 548.3 878.5 545.7L900 543L900 601L878.5 601C857 601 814 601 771.2 601C728.3 601 685.7 601 642.8 601C600 601 557 601 514.2 601C471.3 601 428.7 601 385.8 601C343 601 300 601 257.2 601C214.3 601 171.7 601 128.8 601C86 601 43 601 21.5 601L0 601Z' fill='%23b737ef'%3E%3C/path%3E%3C/svg%3E");
  background-position: center;
  background-attachment: fixed;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>