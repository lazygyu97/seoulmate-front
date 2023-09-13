<script>
export default {
  methods: {
    communication(){this.$router.push('/home/communication')},
    publicService(){this.$router.push('/home/publicService')},
    myPage(){this.$router.push('/home/myPage')}
  }
}

</script>
<template>


  <v-row>
    <v-col style="text-align: center;"></v-col>
    <v-col style="text-align: center;">
      <v-btn @click="communication" style="background-color: rgba(0,184,212,0);color:white;" class="font-weight-bold"
             elevation="0" size="x-large">커뮤니케이션</v-btn>
    </v-col>
    <v-col style="text-align: center;">
      <v-btn @click="publicService" style="background-color: rgba(0,184,212,0);color:white;" class="font-weight-bold" elevation="0" size="x-large">공공 서비스</v-btn>
    </v-col>
    <v-col style="text-align: center;">
      <v-btn @click="myPage" style="background-color: rgba(0,184,212,0);color:white;" class="font-weight-bold" elevation="0" size="x-large">마이 페이지</v-btn>
    </v-col>
    <v-col style="text-align: center;"></v-col>
  </v-row>


</template>


<style scoped>

</style>
