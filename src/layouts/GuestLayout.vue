<template>
  <div class="min-h-screen h-auto overflow-hidden flex justify-center">
    <div class="max-w-screen-xl m-0 sm:m-10 flex justify-center flex-1">
      <div class="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
        <div class="flex justify-center items-center">
          <img src="../assets/vectors/wizzl-light.svg" alt="Wizzl Logo" class="w-8 mr-4" />
          <h2 class="fontWizzl text-lg">Wizzl</h2>
        </div>
        <div class="flex-1 flex items-center justify-center w-full">
          <div>
            <slot />
          </div>
        </div>
      </div>
      <div class="flex-1 text-center hidden lg:flex items-center justify-center">hi</div>
    </div>
  </div>
</template>
