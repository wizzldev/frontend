<template>
  <Transition name="slide-bottom">
    <slot />
  </Transition>
</template>

<style>
.slide-bottom-enter-active {
  transition: all 0.5s ease-out;
}

.slide-bottom-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-bottom-enter-from,
.slide-bottom-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
