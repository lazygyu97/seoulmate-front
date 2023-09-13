<template>
  <v-col elevation="0">
    <v-col align="center">
      <v-card class="background-card" style="max-width:100%">

        <v-row style="margin-left:15%;margin-top: 200px;margin-bottom: 10px">
          <v-btn
            v-for="(category, index) in categories"
            :key="index"
            style="background-color: rgba(0,184,212,0);color:black;"
            class="font-weight-bold"
            elevation="0"
            size="large"
            @click="filterItems(category)"
          >{{ category }}
          </v-btn>
        </v-row>
        <v-row style="margin-left:15%;margin-bottom: 200px">
          <v-text-field
            style="max-width:45%"
            label="선택된 카테고리에서 검색됩니다."
            append-inner-icon="mdi-magnify"
            single-line
            hide-details
            v-model="search"
            @input="searchItems"
          ></v-text-field>
        </v-row>
      </v-card>
    </v-col>

    <v-col align="center" style="max-width:100%">
      <h2 >{{this.selectedCategory}}</h2>
      <v-row style="width:90%;margin-bottom: 10px;margin-top: 20px;height: 120px">

        <v-btn
          style="margin-right: 10px"
          v-for="(category, index) in subCategories"
          :key="index"
          class="font-weight-bold"
          elevation="1"
          size="large"
          @click="subFilterItems(category)"
        >{{ category }}
        </v-btn>

      </v-row>

      <v-row style="max-width: 70%">
        <v-col v-for="(item, index) in pagedItems" :key="index" cols="4" style="min-width: 100px">
          <v-card @click="openModal(item)">
            <v-img :src="item.imgurl" height="200" cover></v-img>
            <v-card-subtitle>{{ item.maxclassnm }}/{{ item.minclassnm }}</v-card-subtitle>
            <v-card-title>{{ item.svcnm }}</v-card-title>
            <v-card-subtitle>접수 기간 : {{ item.rcptbgndt.slice(0, 10) }}~{{
                item.rcptenddt.slice(0, 10)
              }}
            </v-card-subtitle>
            <v-card-subtitle>이용 기간 : {{ item.svcopnbgndt.slice(0, 10) }}~{{
                item.svcopnenddt.slice(0, 10)
              }}
            </v-card-subtitle>
            <v-card-subtitle>이용료: {{ item.payatnm }}</v-card-subtitle>
            <v-card-subtitle>좋아요: {{ item.seoulApiLikes.length }} 개</v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>

      <v-pagination style="margin-top: 50px" v-model="currentPage" :length="totalPages"
                    :total-visible="7"></v-pagination>
    </v-col>
  </v-col>

  <ServiceModal v-model="dialog" :service="selectedService" v-if="selectedService"/> <!-- 모달 컴포넌트를 추가합니다. -->

</template>

<script>
import axios from "@/axios/axios-instance";
import ServiceModal from "@/components/ServiceModal.vue";


export default {
  components: {
    ServiceModal, // 모달 컴포넌트를 등록합니다.
  },
  data() {
    return {
      dialog :false,
      selectedService: null,
      nickname: '',
      address: '',
      search: '',
      items: [], // itemList 초기화
      filteredItems: [], // itemList 초기화
      currentPage: 1, // 현재 페이지 번호
      itemsPerPage: 9, // 한 페이지당 보여줄 항목 수
      categories: ["체육시설", "공간시설", "문화체험", "교육강좌", "진료복지"],
      subCategories: [],
      sportSub: ["전체", "축구장", "풋살장", "족구장", "야구장", "테니스장", "농구장", "배구장", "다목적경기장", "운동장", "체육관", "배드민턴장", "탁구장", "수영장", "교육시설", "골프장"],
      spaceSub: ["전체", "캠핑장", "다목적실", "강의실", "강당", "회의실", "주민공유공간", "공연장", "녹화장소", "전시실", "광장", "청년공간", "민원 등 기타"],
      cultureSub: ["전체", "교육체험", "농장체험", "문화행사", "전시/관람", "단체봉사", "공원탐방", "서울형키즈카페", "산림여가"],
      eduSub: ["전체", "스포츠", "공예/취미", "자연/과학", "역사", "교양/어학", "미술제작", "교육도구", "정보통신", "전문/자격증", "도시농업", "청년정보", "기타"],
      medicalSub: ["전체", "보건소", "장애인버스", "가족안심숙소", "은평병원", "어린이병원", "서북병원"],
      selectedCategory: "체육시설",
      selectedSubCategory: "전체",

    };
  },
  computed: {
    // 현재 페이지에 해당하는 항목들을 반환합니다.
    pagedItems() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;

      if (this.selectedCategory === "체육시설") {
        this.subCategories = this.sportSub;
      } else if (this.selectedCategory === "공간시설") {
        this.subCategories = this.spaceSub;
      } else if (this.selectedCategory === "문화체험") {
        this.subCategories = this.cultureSub;
      } else if (this.selectedCategory === "교육강좌") {
        this.subCategories = this.eduSub;
      } else if (this.selectedCategory === "진료복지") {
        this.subCategories = this.medicalSub;
      }

      // 검색어가 비어 있지 않으면 검색 결과로 필터링합니다.
      if (this.search) {
        return this.items
          .filter((item) =>
            item.svcnm.includes(this.search) &&
            (item.maxclassnm === this.selectedCategory) &&
            (this.selectedSubCategory === "전체" || item.minclassnm === this.selectedSubCategory)
          )
          .slice(startIndex, endIndex);
      }

      return this.items
        .filter((item) =>
          item.maxclassnm === this.selectedCategory &&
          (this.selectedSubCategory === "전체" || item.minclassnm === this.selectedSubCategory)
        )
        .slice(startIndex, endIndex);
    },

    // 전체 페이지 수를 계산합니다.
    totalPages() {
      const filteredItems = this.items
        .filter((item) =>
          item.maxclassnm === this.selectedCategory &&
          (this.selectedSubCategory === "전체" || item.minclassnm === this.selectedSubCategory)
        );

      // 검색어가 비어 있지 않으면 검색 결과로 페이지 수를 계산합니다.
      if (this.search) {
        return Math.ceil(
          filteredItems.filter((item) => item.svcnm.includes(this.search)).length / this.itemsPerPage
        );
      }else{
        return Math.ceil(filteredItems.length / this.itemsPerPage);

      }

    },
  },
  methods: {
    filterItems(category) {
      this.selectedCategory = category;
      this.currentPage = 1;
      this.selectedSubCategory = "전체"; // 카테고리 변경 시 Subcategory 초기화
    },
    subFilterItems(category) {
      this.selectedSubCategory = category;
      this.currentPage = 1;
    },
    searchItems() {
      console.log(this.search);
      // 필터된 결과가 pagedItems에 바로 반영되도록 수정
      this.currentPage = 1;
    },
    openModal(item){
      if (item) {
        console.log(item)
        this.selectedService = item; // 선택한 항목의 정보를 변수에 저장하고 모달을 엽니다.
        this.dialog = true; // 모달을 엽니다.
      }
    }

  },
  mounted() {
    this.nickname = localStorage.getItem("userNickname");
    this.address = localStorage.getItem("userAddress");

    axios
      .get("/seoul/services")
      .then((response) => {
        this.items = response.data.itemList; // itemList 업데이트
      })
      .catch((error) => {
        console.error(error);
      });
  }
  ,
}
;
</script>


<style scoped>
.background-card {
  background-image: url('@/assets/seoul.jpeg');
  background-size: cover;
  opacity: 0.7;
  max-width: 80%;
  background-position: 40% 20%;
}
</style>
