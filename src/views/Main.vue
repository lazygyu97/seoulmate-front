<script>
import axios from "@/axios/axios-instance";
import ServiceModal from "@/components/ServiceModal.vue";
import PostModal from "@/components/PostModal.vue";
import InterestModal from "@/components/InterestModal.vue";
export default {
  components: {InterestModal, ServiceModal, PostModal},
  data() {
    return {
      nickname: '',
      address: '',
      interest: null,
      dialog :false,
      dialog2 :false,
      dialog3 :false,
      selectedService: null,
      selectedPost: null,
      serviceList: [], // itemList 초기화
      allPostList: [], // itemList 초기화
      addressPostList: [], // itemList 초기화

    };
  },
  mounted() {

    this.nickname = localStorage.getItem('userNickname');
    this.address = localStorage.getItem('userAddress');
    this.interest= localStorage.getItem('userInterests')
    console.log("확인 : ",this.interest)
    if (this.interest.length===0){
      this.interestModal();
    }

    this.prepare();
  },
  methods: {
    async prepare() {
      axios
        .get("/seoul/services/recommend")
        .then((response) => {
          this.serviceList = response.data.itemList; // itemList 업데이트
        })
        .catch((error) => {
          console.error(error);
        });

      axios
        .get("/posts?page=1&size=10&sortBy=id&isAsc=false")
        .then((response) => {
          console.log(response.data.content)
          this.allPostList = response.data.content; // itemList 업데이트

        })
        .catch((error) => {
          console.error(error);
        });
      axios
        .get("/posts?page=1&size=10&sortBy=id&isAsc=false&address=" + this.address)
        .then((response) => {
          console.log(response.data.content)
          this.addressPostList = response.data.content; // itemList 업데이트

        })
        .catch((error) => {
          console.error(error);
        });
    },
    openServiceModal(item){
      if (item) {
        console.log(item)
        this.selectedService = item; // 선택한 항목의 정보를 변수에 저장하고 모달을 엽니다.
        this.dialog = true; // 모달을 엽니다.
      }
    },
    openPostModal(item){
      if (item) {
        console.log(item)
        this.selectedPost = item; // 선택한 항목의 정보를 변수에 저장하고 모달을 엽니다.
        this.dialog2 = true; // 모달을 엽니다.
      }
    },
    interestModal(){
      console.log("확인")
      this.dialog3=true;
    },

  },
};
</script>

<template>


  <v-col  elevation="0">
    <v-col >
      <v-row style="margin-top:10px;margin-bottom: 30px;margin-left:12%">
        <img style="margin-top:10px ;width: 55px;height: 55px" src="@/assets/seoul.png">
        <v-col>
          <v-row style="margin-left:0px">
            <h1 style="color: #00b0ff">추천&nbsp;</h1>
            <h1>서비스</h1>
          </v-row>
          <h3 style="margin-top: 10px">{{ nickname }}님의 관심사에 맞는 공공서비스를 추천해드립니다.</h3>
        </v-col>
      </v-row>

      <v-row style="margin-bottom: 50px">

        <v-sheet
          class="mx-auto"
          max-width="100%"
          min-height="435px"
        >
          <v-slide-group show-arrows>
            <v-slide-group-item v-for="(item, index) in serviceList" :key="index">
              <v-card style="text-align:center;margin-bottom:10px;margin-right: 5px; margin-left: 5px" min-width="350" @click="openServiceModal(item)"
                      height="360">
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
            </v-slide-group-item>
          </v-slide-group>
        </v-sheet>

      </v-row>
      <v-divider></v-divider>
    </v-col>

    <v-col>

      <v-row style=" margin-right:13%;margin-top:13px;margin-bottom: 30px">
        <v-spacer></v-spacer>
        <v-col style=" max-width: 30%">
          <v-row style="text-align:end;">
            <v-spacer></v-spacer>
            <h1 style="color: #00b0ff">서울&nbsp;</h1>
            <h1>메이트</h1>
          </v-row>
          <v-row>
            <v-spacer></v-spacer>
            <h3>{{ nickname }}님의 거주지역인 {{ address }} 소통창구 입니다. </h3>
          </v-row>
        </v-col>
        <img align="right" style="margin-top:5px;width: 60px;height: 60px" src="@/assets/seoul-tower.png">
      </v-row>

      <v-row style="margin-bottom: 20px">
        <v-col style="margin-left: 10%">
          <v-card
            class="mx-auto overflow-y-auto"
            max-width="80%"
            max-height="90%"

          >
            <v-toolbar color="whit">

              <v-toolbar-subtitle style="margin-left: 10px">전체 게시물</v-toolbar-subtitle>

              <v-spacer></v-spacer>

              <v-btn variant="text" icon="mdi-plus"></v-btn>
            </v-toolbar>
            <v-list class="overflow-y-auto">
              <template v-for="item in allPostList" :key="item.id">
                <!-- 각 리스트 아이템에서 title과 content 출력 -->
                <v-list-item @click="openPostModal(item)" >
                  <h3>{{ item.title }}</h3>
                  <p>{{ item.content }}</p>
                  <v-divider></v-divider>
                </v-list-item>
              </template>
            </v-list>

          </v-card>
        </v-col>
        <v-col style="margin-right: 10%; width: 80%">
          <v-card
            class="mx-auto overflow-y-auto"
            max-width="80%"
            max-height="90%"
          >
            <v-toolbar color="whit">

              <v-toolbar-subtitle style="margin-left: 10px">{{ address }} 게시물</v-toolbar-subtitle>

              <v-spacer></v-spacer>

              <v-btn variant="text" icon="mdi-plus"></v-btn>
            </v-toolbar>

            <v-list class="overflow-y-auto">
              <template v-for="item in addressPostList" :key="item.id">
                <!-- 각 리스트 아이템에서 title과 content 출력 -->
                <v-list-item @click="openPostModal(item)" >
                  <h3>{{ item.title }}</h3>
                  <p>{{ item.content }}</p>
                  <v-divider></v-divider>
                </v-list-item>
              </template>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
      <v-divider></v-divider>
    </v-col>
  </v-col>

  <ServiceModal v-model="dialog" :service="selectedService" v-if="selectedService"/> <!-- 모달 컴포넌트를 추가합니다. -->
  <PostModal v-model="dialog2" :post="selectedPost" v-if="selectedPost"/> <!-- 모달 컴포넌트를 추가합니다. -->
  <InterestModal  v-model="dialog3" />

</template>

<style scoped>

</style>
