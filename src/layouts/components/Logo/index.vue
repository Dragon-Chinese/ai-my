<script setup lang="ts">
import imgLogo from '@/assets/images/logo.svg'
import useSettingsStore from '@/store/modules/settings'

defineOptions({
  name: 'Logo',
})

withDefaults(
  defineProps<{
    showLogo?: boolean
    showTitle?: boolean
  }>(),
  {
    showLogo: true,
    showTitle: true,
  },
)

const settingsStore = useSettingsStore()

const title = ref(import.meta.env.VITE_APP_TITLE)
const logo = ref(imgLogo)

const to = computed(() => settingsStore.settings.home.enable ? settingsStore.settings.home.fullPath : '')
</script>

<template>
  <RouterLink :to="to" class="logo-item h-[var(--g-sidebar-logo-height)] w-inherit flex-center px-3 text-inherit no-underline" :class="{ 'cursor-pointer': settingsStore.settings.home.enable }" :title="title">
    <img v-if="showLogo" :src="logo" class="logo h-[30px] w-[30px] object-contain">
    <span v-if="showTitle" class="block truncate font-bold" style="color: #fff;">{{ title }}</span>
  </RouterLink>
</template>

<style>
  .logo-item {
    height: 56px;
    margin-bottom: 0px;
  }
</style>
