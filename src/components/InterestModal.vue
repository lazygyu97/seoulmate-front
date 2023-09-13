<template>
  <v-dialog v-model="dialog" max-width="1000">
    <v-card align="center">

      <v-card-title style="margin-top: 50px">관심사를 등록 해주세요</v-card-title>
      <v-card-subtitle style="margin-bottom: 50px">{{nickname}}님의 관심사에 따라 추천 서비스를 제공해드립니다. (3개 이상을 추천)</v-card-subtitle>
      <v-row style="margin-left: 90px;margin-right: 90px">
        <v-col>
          <v-card-title>체육시설</v-card-title>
          <v-checkbox
            color="indigo"

            v-for="(subInterest, index) in sportSub"
            :key="index"
            :label="subInterest"
            @change="updateSelectedInterest(subInterest)"
          ></v-checkbox>
        </v-col>

        <v-col>
          <v-card-title>공간시설</v-card-title>
          <v-checkbox
            color="indigo"

            v-for="(subInterest, index) in spaceSub"
            :key="index"
            :label="subInterest"
            @change="updateSelectedInterest(subInterest)"
          ></v-checkbox>
        </v-col>

        <v-col>
          <v-card-title>문화체험</v-card-title>
          <v-checkbox
            color="indigo"

            v-for="(subInterest, index) in cultureSub"
            :key="index"
            :label="subInterest"
            @change="updateSelectedInterest(subInterest)"
          ></v-checkbox>
        </v-col>

        <v-col>
          <v-card-title>교육강좌</v-card-title>
          <v-checkbox
            color="indigo"

            v-for="(subInterest, index) in eduSub"
            :key="index"
            :label="subInterest"
            @change="updateSelectedInterest(subInterest)"
          ></v-checkbox>
        </v-col>

        <v-col>
          <v-card-title>진료복지</v-card-title>
          <v-checkbox
            color="indigo"

            v-for="(subInterest, index) in medicalSub"
            :key="index"
            :label="subInterest"
            @change="updateSelectedInterest(subInterest)"
          ></v-checkbox>
        </v-col>
      </v-row>


      <v-btn size="large" @click="submitInterests">선택한 관심사 저장</v-btn>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "@/axios/axios-instance";

export default {
  mounted() {

    this.nickname = localStorage.getItem('userNickname');

  },
  data() {
    return {
      nickname:'',
      dialog: false,
      interestList: [],
      sportSub: ["축구장", "풋살장", "족구장", "야구장", "테니스장", "농구장", "배구장", "다목적경기장", "운동장", "체육관", "배드민턴장", "탁구장", "수영장", "교육시설", "골프장"],
      spaceSub: ["캠핑장", "다목적실", "강의실", "강당", "회의실", "주민공유공간", "공연장", "녹화장소", "전시실", "광장", "청년공간", "민원 등 기타"],
      cultureSub: ["교육체험", "농장체험", "문화행사", "전시/관람", "단체봉사", "공원탐방", "서울형키즈카페", "산림여가"],
      eduSub: ["스포츠", "공예/취미", "자연/과학", "역사", "교양/어학", "미술제작", "교육도구", "정보통신", "전문/자격증", "도시농업", "청년정보", "기타"],
      medicalSub: ["보건소", "장애인버스", "가족안심숙소", "은평병원", "어린이병원", "서북병원"]

    };
  },
  methods: {
    updateSelectedInterest(item) {
      if (this.interestList.includes(item)){
        const findIndex = this.interestList.indexOf(item);
        if(findIndex > -1) {
          this.interestList.splice(findIndex, 1);
        }
      }else{
        this.interestList.push(item)
      }
      console.log( this.interestList)
    },
    async submitInterests() {

      if(this.interestList.length>0){
        await axios
          .post("/users/interest", this.interestList)
            .then((response) => {
              // 서버에서 응답을 처리합니다.
              console.log("관심사 저장 성공");
            })
            .catch((error) => {
              console.error("관심사 저장 실패", error);
            });
      }else{
        alert("최소 한개 이상 선택해주세요")
      }

    }
    ,
  }
  ,
};
</script>
