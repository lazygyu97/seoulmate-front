<script setup>

import PageComponent from "@/components/PageComponent.vue";
</script>
<template>
    <v-col>
      <v-app-bar-title style="margin-top:0px;height: 50%">
        <v-col>
          <v-row  style="height: 50%">
            <v-col>
            </v-col>
            <v-col style="height:auto;text-align: center;margin-top: 0px">
                <img style="width: 150px; height:auto" src="@/assets/logo_wh.png" alt="로고" @click="mainPage"/>
            </v-col>
            <v-col style="text-align: end">
              <v-btn style="height: 50%;margin-right: 30px" icon>
                <img style="width: 50px; height:50px" src="@/assets/logout.png" alt="로고" @click="logout"/>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>

      </v-app-bar-title>
      <PageComponent  class="gradient" style=" height:70px;"></PageComponent>

    </v-col>




</template>
<script>
export default {
  methods: {
    mainPage(){
      this.$router.push('/home/')
    },
    logout(){
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>

</style>
