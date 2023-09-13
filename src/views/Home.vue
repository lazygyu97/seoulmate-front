<script>

import HeaderComponent from "@/components/HeaderComponent.vue";
import PageComponent from "@/components/PageComponent.vue";

export default {
  components: {
    HeaderComponent, // Header 컴포넌트 등록
    PageComponent,
  },
};
</script>

<template>

  <v-layout class="rounded rounded-md">

    <v-app-bar elevation="0" height=10%; color="white">
      <HeaderComponent class="gradient"></HeaderComponent>
    </v-app-bar>
    <v-container style="max-width: 100%">
      <HeaderComponent></HeaderComponent>
      <v-layout  elevation="0">
        <v-navigation-drawer  style="margin-top: 20px; border: 0px" elevation="0"></v-navigation-drawer>
        <v-navigation-drawer style="margin-top: 20px;border: 0px" elevation="0" location="right"></v-navigation-drawer>
        <v-main elevation="0" class="d-flex " >
          <router-view />
        </v-main>
      </v-layout>
    </v-container>
    <v-footer app>
    </v-footer>
  </v-layout>


</template>

<style scoped>
.gradient {
  background: linear-gradient(to right, #60D8F2, #7789E8); /* 원하는 그라데이션 색상을 설정합니다. */
  /* 그라데이션 스타일을 조정할 수 있습니다. */
}

</style>
