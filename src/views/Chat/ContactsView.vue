<template>
  <ContactsLayout>
    <section class="my-3 px-5">
      <IconInput/>
    </section>
    <section class="mt-5 grid grid-cols-3 gap-2 mx-5 text-center">
      <PushButton :is-link="false" class="w-full px-2 py-1 bg-tertiary rounded-xl">
        Messages
      </PushButton>
      <PushButton :is-link="false" class="w-full px-2 py-1 bg-secondary rounded-xl">
        Restricted
      </PushButton>
      <PushButton :is-link="false" class="w-full px-2 py-1 bg-secondary rounded-xl">
        Blocked
      </PushButton>
    </section>
    <main class="mt-5 overflow-y-scroll">
      <Contact v-for="i in 15" :key="i"
        title="Jane Roe"
        date="2024-05-03 19:05:49"
        :image="`https://xsgames.co/randomusers/assets/avatars/female/6${i}.jpg`"
        message="Hi, so I just wanted to know how old are you exactly?"
      />
    </main>
  </ContactsLayout>
</template>

<script setup lang="ts">
import ContactsLayout from '@/layouts/ContactsLayout.vue'
import IconInput from '@/components/Elements/IconInput.vue'
import Contact from '@/components/Contact.vue'
import PushButton from '@/components/Elements/PushButton.vue'
</script>
