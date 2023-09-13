<template>
  <v-dialog v-model="dialog" max-width="1800">
    <v-card align="center">

      <v-row>
        <v-col>
          <v-img :src="service.imgurl" style="margin-top: 5%; margin-left: 20px;" height="500"></v-img>
          <v-row style="margin-top: 20px">
            <v-col align="end">
              <v-card-text>{{ seoulLikeLength }}</v-card-text>
            </v-col>
            <v-col align="start">
              <v-btn
                elevation="0"
                :icon="isLike ? 'mdi-heart' : 'mdi-heart-outline'"
                @click="likePost()"
              ></v-btn>
            </v-col>
          </v-row>
        </v-col>
        <v-col>
          <v-card-text>{{ service.maxclassnm }} /  {{ service.minclassnm }}</v-card-text>
          <v-card-title>{{ service.svcnm }}</v-card-title>
          <v-card-text>접수상태 : {{ service.svcstatnm }}</v-card-text>
          <v-card-text>이용일 {{ service.revstdday }}일 전까지</v-card-text>
          <v-card-text>예약사이트로 이동 : {{ service.svcurl }}</v-card-text>
          <v-card-text>문의전화 : {{ service.telno }}</v-card-text>
          <v-card-text>인원수 : {{ service.usetgtinfo }}</v-card-text>
          <v-card-text>장소 : {{ service.areanm }}, {{ service.placenm }}</v-card-text>

          <v-card-text>이용기간 : {{ service.rcptbgndt }}  /  {{ service.rcptenddt }}</v-card-text>
          <v-card-text>접수기간 : {{ service.svcopnbgndt }}  /  {{ service.svcopnenddt }}</v-card-text>
          <v-card-text>시작시간 : {{ service.v_MIN }} /  {{ service.v_MAX }}</v-card-text>

          <!-- URL 클릭할 링크 -->
          <v-btn
            style="margin-top: 20px"
            elevation="3"
            @click="openUrl()"
          >예약 페이지로 바로가기</v-btn>
        </v-col>
      </v-row>


      <!-- 원하는 항목들을 여기에 추가하세요. -->

    </v-card>
  </v-dialog>
</template>

<script>
import axios from "@/axios/axios-instance";

export default {
  props: {
    service: Object, // 클릭한 항목의 정보를 받아올 prop입니다.
  },
  mounted() {
    // 로컬 스토리지에서 저장된 username 가져오기
    const username = localStorage.getItem('username');
    this.seoulLikeLength = this.service.seoulApiLikes.length;
    for (const like of this.service.seoulApiLikes) {
      if (like.username === username) {
        this.isLike = true; // 예시로 'isLike' 데이터를 true로 설정
        break; // 일치하는 경우를 찾으면 루프 종료
      }
    }
  },
  data() {
    return {
      dialog: false, // 모달 창을 열고 닫는 상태를 관리합니다.
      isLike: false,
      seoulLikeLength: null,

    };
  },
  methods:{
    async likePost() {
      if (this.isLike) {
        try {
          const response = await axios.delete("/seoul/service/like?svcid=" + this.service.svcid);
          const updatedPost = response.data;
          const updatedPostLikes = this.service.seoulApiLikes.filter(like => like.username == updatedPost.username);
          console.log(updatedPostLikes)

          this.service.seoulApiLikes = updatedPostLikes; // postLikes 배열을 업데이트

          this.seoulLikeLength--;
          this.isLike = false;

        } catch (error) {

          console.log(error)
          alert("처리 중 오류가 발생하였습니다.")

        }
      } else {
        try {

          const response = await axios.post("/seoul/service/like?svcid=" + this.service.svcid);
          const updateService = response.data;
          this.service.seoulApiLikes = updateService.seoulApiLikes; // postLikes 배열을 업데이트
          this.seoulLikeLength++;
          this.isLike = true;

        } catch (error) {

          console.log(error)
          alert("처리 중 오류가 발생하였습니다.")

        }
      }

    },
    async openUrl() {
      // service.svcurl에 지정된 URL을 새 창에서 열어줍니다.
      if (this.service.svcurl) {
        window.open(this.service.svcurl, '_blank');
      } else {
        alert('URL이 지정되지 않았습니다.');
      }
    }
  }

};
</script>
