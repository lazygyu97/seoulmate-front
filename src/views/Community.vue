<script>
import axios from "@/axios/axios-instance";
import PostModal from "@/components/PostModal.vue";
import CreatePostModal from "@/components/CreatePostModal.vue"; // 모달 컴포넌트를 import합니다.

export default {
  components: {
    CreatePostModal,
    PostModal, // 모달 컴포넌트를 등록합니다.
  },
  data() {
    return {
      dialog: false,
      dialog2: false,
      country: '전체',
      countries: ["전체", "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"],
      filteredPostList: [],
      search: '',
      headers: [
        {title: '번호', align: 'center', key: 'id'},
        {title: '작성자', align: 'center', key: 'author'},
        {title: '제목', align: 'center', key: 'title',},
        {title: '내용', align: 'center', key: 'content'},
        {title: '좋아요', align: 'center', key: 'postLikes'},
        {title: '작성일', align: 'center', key: 'createdAt'},
      ],
      sortBy: [{key: 'id', order: 'desc'}],
      nickname: '',
      address: '',
      itemsPerPage: '10',
      allPostList: [], // itemList 초기화
      addressPostList: [], // itemList 초기화
      selectedPost: null,
    };
  },
  mounted() {
    this.nickname = localStorage.getItem('userNickname');
    this.address = localStorage.getItem('userAddress');

    this.prepare();
  },
  methods: {
    async prepare() {

      axios
        .get("/posts/all")
        .then((response) => {
          console.log(response.data)
          this.filteredPostList = response.data.postList; // itemList 업데이트
          this.allPostList = response.data.postList;
        })
        .catch((error) => {
          console.error(error);
        });

    },
    handleCountryChange() {
      console.log(this.country)
      if (this.country === "전체") {
        return this.filteredPostList = this.allPostList
      }
      this.filteredPostList = this.allPostList.filter((item) => {
        return (
          item.address === this.country
        );

      });
      console.log(this.filteredPostList)
    },

    openModal(item) {
      if (item.id) {
        if (item) {
          console.log(item)
          this.selectedPost = item; // 선택한 항목의 정보를 변수에 저장하고 모달을 엽니다.
          this.dialog = true; // 모달을 엽니다.
        }
      } else {
        const clickedItem = this.allPostList.find(post => post.id === item.columns.id);
        // clickedItem은 클릭한 항목에 해당하는 객체입니다.
        if (clickedItem) {
          this.selectedPost = clickedItem; // 선택한 항목의 정보를 변수에 저장하고 모달을 엽니다.
          this.dialog = true; // 모달을 엽니다.
        }
      }
    },
    openCreatePostModal() {
      // 글쓰기 모달을 엽니다.
      this.dialog2 = true;
    },
    handleCreatePost(postData) {
      // 글쓰기 모달에서 작성된 글을 처리하는 메서드
      // postData에 제목, 내용, 이미지 파일 정보가 들어옵니다.
      // 글을 생성하는 API 호출 또는 데이터 처리를 수행합니다.
      console.log('새로운 글 데이터:', postData);
      // 작성 후 처리 로직을 추가하세요.
      // 예: 글을 생성하는 API 호출 등
      // 모달을 닫습니다.
      this.dialog2 = false;
    },
  },
};

</script>

<template>


  <v-col style="height: 100%" elevation="0">
    <v-col style="max-width:100%">
      <v-row style="margin-top:10px;margin-bottom: 50px;margin-left:12%">
        <img style="margin-top:10px ;width: 55px;height: 55px" src="@/assets/seoul.png">
        <v-col>
          <v-row style="margin-left:0px">
            <h1 style="color: #00b0ff">서울&nbsp;</h1>
            <h1>메이트</h1>
          </v-row>
          <h3 style="margin-top: 10px">게시글 순위 TOP 10</h3>
        </v-col>
      </v-row>
      <v-row style="margin-bottom: 0px">

        <v-sheet
          class="mx-auto"
          max-width="100%"
          min-height="435px"
        >
          <v-slide-group show-arrows>
            <v-slide-group-item v-for="(item, index) in allPostList.slice(0,11)" :key="index">
              <v-card style="text-align:center;margin-bottom:10px;margin-right: 5px; margin-left: 5px" min-width="350"
                      height="360"
                      @click="openModal(item)">
                <v-img height="200" cover>
                  <template v-if="item.images && item.images[0]">
                    <!-- 이미지가 있는 경우 -->
                    <v-img :src="item.images[0].imageUrl" height="200"></v-img>
                  </template>
                  <template v-else>
                    <v-img src="@/assets/default_image.png" height="200"></v-img>

                  </template>
                </v-img>
                <v-card-title v-if="item.title.length > 10">{{ item.title.slice(0, 10) }}...</v-card-title>
                <v-card-title v-else>{{ item.title }}</v-card-title>
                <v-card-subtitle v-if="item.content.length > 10">{{ item.content.slice(0, 10) }}...</v-card-subtitle>
                <v-card-subtitle v-else>{{ item.content }}</v-card-subtitle>
                <v-card-subtitle>{{ item.author }}</v-card-subtitle>
                <v-card-subtitle>{{ item.createdAt.slice(0, 10) }}</v-card-subtitle>

                <v-card-subtitle>좋아요: {{ item.postLikes.length }} 개</v-card-subtitle>

              </v-card>
            </v-slide-group-item>
          </v-slide-group>
        </v-sheet>
      </v-row>

      <v-divider></v-divider>
    </v-col>

    <v-col align="center">
      <v-card max-width=80%>
        <v-card-title>

          <v-spacer></v-spacer>
          <v-row style="margin-top: 40px">
            <v-col style="margin-left: 5%" cols="2">
              <v-autocomplete
                variant="outlined"
                v-model="country"
                :items="countries"
                label="지역별 게시글"
                placeholder="구를 입력해주세요 ex) 용산구"
                @update:model-value="handleCountryChange"
              ></v-autocomplete>
            </v-col>
            <v-col cols="8">
              <v-text-field

                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
                variant="outlined"

              ></v-text-field>
            </v-col>
            <v-col cols="1">
              <v-btn elevation="1" size="large" @click="openCreatePostModal">
                글쓰기
              </v-btn>
            </v-col>
          </v-row>

        </v-card-title>
        <v-data-table
          v-model:sort-by="sortBy"
          v-model:items-per-page="itemsPerPage"
          :headers="headers"
          :items="filteredPostList"
          item-value="id"
          :search="search"
          class="elevation-1"
          @click:row="handleRowClick"
        >
          <template v-slot:item="{ item }">
            <tr @click="openModal(item)" style="text-align: center;">
              <td>{{ item.columns.id }}</td>
              <td>{{ item.columns.author }}</td>
              <td>{{ item.columns.title.slice(0, 10) }}...</td>
              <td>{{ item.columns.content.slice(0, 20) }}...</td>
              <td>{{ item.columns.postLikes.length }}</td>
              <td>{{ item.columns.createdAt.slice(0, 16) }}</td>
            </tr>
          </template>

        </v-data-table>
      </v-card>
    </v-col>

  </v-col>

  <PostModal v-model="dialog" :post="selectedPost" v-if="selectedPost"/> <!-- 모달 컴포넌트를 추가합니다. -->
  <CreatePostModal v-model="dialog2" :list="filteredPostList" @create-post="handleCreatePost"/>

</template>

<style scoped>

</style>
