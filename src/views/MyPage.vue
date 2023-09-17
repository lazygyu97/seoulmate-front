<script>

import axios from '@/axios/axios-instance';
import InterestModal from "@/components/InterestModal.vue";
import UpdateInterestModal from "@/components/UpdateInterestModal.vue";
import ServiceModal from "@/components/ServiceModal.vue";
import PostModal from "@/components/PostModal.vue";


export default {
  components: {PostModal, ServiceModal, UpdateInterestModal, InterestModal},
  mounted() {

    this.user.username = localStorage.getItem('username');
    this.editedUser.username = this.user.username;
    this.user.nickname = localStorage.getItem('userNickname');
    this.user.address = localStorage.getItem('userAddress');
    this.user.id = localStorage.getItem('id');
    const userInterestsString = localStorage.getItem('userInterests');

    if (userInterestsString) {
      this.user.interest = userInterestsString.split(','); // 콤마로 분리하여 리스트로 저장
    } else {
      this.user.interest = []; // 값이 없을 경우 빈 리스트로 초기화
    }
    this.user.profileImage = localStorage.getItem('userImage');
    this.user.email = localStorage.getItem('email');
    this.getFollowList();
    this.prepare();
  },
  data() {
    return {
      headers: [
        {title: '번호', align: 'center', key: 'id'},
        {title: '작성자', align: 'center', key: 'author'},
        {title: '제목', align: 'center', key: 'title',},
        {title: '내용', align: 'center', key: 'content'},
        {title: '좋아요', align: 'center', key: 'postLikes'},
        {title: '작성일', align: 'center', key: 'createdAt'},
      ],
      search: '',
      itemsPerPage: '10',
      sortBy: [{key: 'id', order: 'desc'}],
      dialog: false,
      dialog2: false,
      dialog3: false,
      openFollow: false,
      imageEdit: false,
      checkPwd: '',
      serviceList: [],
      postList: [],
      user: {
        username: '',
        id: '',
        nickname: '',
        email: '',
        interest: [],
        address: '',
        profileImage: '',
        followList: [],
        followingList: [],
      },
      editedUser: {
        nickname: '',
        profileImage: null,
        interest: [],
        address: '',
      },
      selectedService: null,
      selectedPost: null,
      editing: false,
      editing2: false,
      countries: ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"],

    };
  },
  methods: {
    saveUser(){

    },
    navigateToServiceCreation() {
      // 서비스 추가 페이지로 이동하는 라우터 푸시
      this.$router.push('/home/publicService') // 경로를 적절하게 변경하세요.
    },
    async prepare() {
      axios
        .get("/seoul/like/list/" + this.user.id)
        .then((response) => {
          this.serviceList = response.data.itemList; // itemList 업데이트
        })
        .catch((error) => {
          console.error(error);
        });
      axios
        .get("/posts/list/" + this.user.id)
        .then((response) => {
          this.postList = response.data.postList; // itemList 업데이트
        })
        .catch((error) => {
          console.error(error);
        });
    },
    openModal(item) {
      if (item.id) {
        if (item) {
          console.log(item)
          this.selectedPost = item; // 선택한 항목의 정보를 변수에 저장하고 모달을 엽니다.
          this.dialog3 = true; // 모달을 엽니다.
        }
      } else {
        const clickedItem = this.postList.find(post => post.id === item.columns.id);
        // clickedItem은 클릭한 항목에 해당하는 객체입니다.
        if (clickedItem) {
          this.selectedPost = clickedItem; // 선택한 항목의 정보를 변수에 저장하고 모달을 엽니다.
          this.dialog3 = true; // 모달을 엽니다.
        }
      }
    },
    openServiceModal(item) {
      if (item) {
        console.log(item)
        this.selectedService = item; // 선택한 항목의 정보를 변수에 저장하고 모달을 엽니다.
        this.dialog2 = true; // 모달을 엽니다.
      }
    },
    handleImageChange(event) {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        this.editedUser.profileImage = selectedFile;
      }
    },
    editUser() {
      // 수정 모드로 전환하고 현재 유저 정보를 복사하여 편집용 데이터에 할당합니다.
      this.editedUser = {...this.user};
      this.editing = true;
    }, editUser2() {
      // 수정 모드로 전환하고 현재 유저 정보를 복사하여 편집용 데이터에 할당합니다.
      this.editedUser = {...this.user};
      this.editing2 = true;
    },

    cancelEdit() {
      // 수정 모드를 취소하고 편집용 데이터를 초기화합니다.
      this.editedUser = {};
      this.editing = false;
    }, cancelEdit2() {
      // 수정 모드를 취소하고 편집용 데이터를 초기화합니다.
      this.editedUser = {};
      this.editing2 = false;
    },
    toggleImageEdit() {
      // 이미지 편집 모드를 토글합니다.
      this.imageEdit = !this.imageEdit;
    },
    openFollowList() {
      this.openFollow = !this.openFollow;
    },
    async editImage() {
      if (!this.editedUser.profileImage) {
        alert("이미지를 첨부 해주세요")
      } else {
        const formData = new FormData();
        formData.append('file', this.editedUser.profileImage)


        await axios.put("/users/profile/image", formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // 멀티파트 형식 설정
          },
        })
          .then((response) => {
            console.log('업로드 성공')
            window.location.reload(); // 창 새로고침

          })
          .catch((error) => {
            console.error('업로드 실패', error);
          });

      }
    },
    async editNickname() {

      if (this.editedUser.nickname == this.user.nickname) {
        alert("변경 사항이 없습니다.")
      } else {
        this.checkPwd = prompt("변경을 위해 비밀번호를 입력해주세요")
        if (this.checkPwd) {
          const data = {
            nickname: this.editedUser.nickname,
            password: this.checkPwd
          }
          await axios.put("/users/nickname", data)
            .then((response) => {
              console.log('업로드 성공')
              window.location.reload(); // 창 새로고침
              this.checkPwd = '';
            })
            .catch((error) => {
              console.error('닉네임 변경 실패', error);
            });
        }
      }

    }, async editAddress() {

      if (this.editedUser.address == this.user.address) {
        alert("변경 사항이 없습니다.")
      } else {
        this.checkPwd = prompt("변경을 위해 비밀번호를 입력해주세요")
        if (this.checkPwd) {
          const data = {
            address: this.editedUser.address,
            password: this.checkPwd
          }
          await axios.put("/users/address", data)
            .then((response) => {
              console.log('업로드 성공')
              window.location.reload(); // 창 새로고침

              this.checkPwd = '';
            })
            .catch((error) => {
              console.error('닉네임 변경 실패', error);
            });
        }
      }

    }, async getFollowList() {


      await axios.get("/follow/followingList",)
        .then((response) => {
          this.user.followingList = response.data;
          console.log("팔로잉", this.user.followingList)

        })
        .catch((error) => {
          console.error('닉네임 변경 실패', error);
        });
      await axios.get("/follow/followerList",)
        .then((response) => {
          this.user.followList = response.data;
          console.log("팔로우", this.user.followList)

        })
        .catch((error) => {
        });
    },
    userPage(id) {
      console.log(id)
      if (id == localStorage.getItem('id')) {
        this.$router.push('/home/myPage/')
      } else {
        this.$router.push('/home/userPage/' + id)
      }

    },
    interestModal() {
      console.log("확인")
      this.dialog = true;
    },

  },
};
</script>

<template>

  <v-container style="max-width: 75%">
    <v-col>

      <v-col>
        <v-row style="min-width: 80%; margin-top: 30px">
          <v-card elevation="3" min-width="100%">
            <v-col>
              <v-row style="margin-left:50px;margin-top: 30px;margin-bottom: 20px">
                <v-col align="center">
                  <v-card-title>{{ user.nickname }}님의 정보</v-card-title>
                </v-col>
                <v-col></v-col>
              </v-row>

              <v-row>

                <v-col align="center">
                  <v-avatar
                    style="margin-left: 20%;margin-top: 20px"
                    color="grey"
                    size="220"
                    @click="toggleImageEdit"
                  >
                    <v-img :src="user.profileImage" cover></v-img>
                  </v-avatar>

                  <v-col v-if="imageEdit">
                    <input
                      style="margin-left: 40%; margin-top: 20px"
                      type="file"
                      accept="image/*"
                      @change="handleImageChange">

                    <v-btn @click="editImage" style="margin-left:20%; margin-top: 10px"
                    >이미지 변경
                    </v-btn>
                  </v-col>

                </v-col>

                <v-col>
                  <v-card-text>
                    <v-list>

                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>아이디 : {{ user.username }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-content>
                          <v-row style="min-height: 70%">
                            <v-col align-self="center" cols="3">
                              <v-list-item-title>닉네임 : {{ user.nickname }}</v-list-item-title>
                            </v-col>
                            <v-col cols="1">
                              <v-card-actions>
                                <v-btn color="primary" @click="editUser">수정</v-btn>
                              </v-card-actions>
                            </v-col>
                            <v-col align="center">
                              <v-row style="margin-top: 5px;max-width: 90%" v-if="editing">
                                <v-card-text>
                                  <v-form @submit="saveUser">
                                    <v-text-field variant="outlined"
                                                  v-model="editedUser.nickname"></v-text-field>
                                  </v-form>
                                </v-card-text>
                                <v-card-actions>
                                  <v-btn color="primary" @click="editNickname">저장</v-btn>
                                  <v-btn @click="cancelEdit">취소</v-btn>
                                </v-card-actions>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-list-item-content>
                      </v-list-item>


                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>이메일 : {{ user.email }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item>
                        <v-row style="min-height: 70%">
                          <v-col align-self="center" cols="3">
                            <v-list-item-title>거주지 : {{ user.address }}</v-list-item-title>
                          </v-col>
                          <v-col cols="1">
                            <v-card-actions>
                              <v-btn color="primary" @click="editUser2">수정</v-btn>
                            </v-card-actions>
                          </v-col>
                          <v-col align="center">
                            <v-row style="margin-top: 5px;max-width: 90%" v-if="editing2">
                              <v-card-text>
                                <v-form @submit="editAddress">
                                  <v-autocomplete
                                    variant="outlined"
                                    v-model="this.editedUser.address"
                                    :items="countries"
                                    label="거주지"
                                    placeholder="구를 입력해주세요 ex) 용산구"
                                    required
                                  ></v-autocomplete>
                                </v-form>
                              </v-card-text>
                              <v-card-actions>
                                <v-btn color="primary" @click="editAddress">저장</v-btn>
                                <v-btn @click="cancelEdit2">취소</v-btn>
                              </v-card-actions>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-list-item>
                      <v-list-item>

                        <v-list-item-content>
                          <v-row>
                            <v-col align-self="center" cols="3">
                              <v-list-item-title style="margin-bottom: 10px">관심사</v-list-item-title>
                            </v-col>
                            <v-col>
                              <v-card-actions>
                                <v-btn color="primary" @click="interestModal">수정</v-btn>
                              </v-card-actions>
                            </v-col>

                          </v-row>

                          <v-chip v-for="(interest, index) in user.interest" :key="index">{{ interest }}</v-chip>

                        </v-list-item-content>
                      </v-list-item>

                    </v-list>
                  </v-card-text>


                </v-col>
              </v-row>
              <v-row style="margin-bottom:50px">
                <v-col align="end">
                  <v-btn @click="openFollowList" elevation="0" size="x-large">팔로워 {{ user.followList.length }}명</v-btn>
                </v-col>
                <v-col>
                  <v-btn @click="openFollowList" elevation="0" size="x-large">팔로잉 {{ user.followingList.length }}명
                  </v-btn>
                </v-col>
              </v-row>


              <v-col v-if="openFollow" align="center">
                <v-row class="bordered-row" style="max-width: 70%">
                  <v-col>
                    <v-card-title>팔로우 목록</v-card-title>
                    <v-divider></v-divider>
                    <v-list>
                      <v-list-item v-for="followUser in this.user.followList" :key="this.user.followList.id">
                        <v-row align="center" style="text-align: center;margin-bottom: 2px;max-width: 70%"
                               @click="userPage(followUser.id)">

                          <!-- 각 팔로잉 유저의 정보를 여기에 렌더링 -->
                          <v-col align="center">
                            <v-list-item-avatar>
                              <v-img :src="followUser.image" width="40" height="40"></v-img>
                            </v-list-item-avatar>
                          </v-col>
                          <v-col align="start">
                            <v-list-item-content>
                              <v-list-item-title>{{ followUser.nickname }}</v-list-item-title>
                            </v-list-item-content>

                          </v-col>


                        </v-row>
                        <v-divider></v-divider>
                      </v-list-item>
                    </v-list>

                  </v-col>
                  <v-col>
                    <v-card-title>팔로잉 목록</v-card-title>
                    <v-divider></v-divider>

                    <v-list>

                      <v-list-item v-for="followingUser in this.user.followingList" :key="this.user.followingList.id">
                        <v-row align="center" style="text-align: center;margin-bottom: 2px;max-width: 70%"
                               @click="userPage(followingUser.id)">

                          <!-- 각 팔로잉 유저의 정보를 여기에 렌더링 -->
                          <v-col align="center">
                            <v-list-item-avatar>
                              <v-img :src="followingUser.image" width="40" height="40"></v-img>
                            </v-list-item-avatar>
                          </v-col>
                          <v-col align="start">
                            <v-list-item-content>
                              <v-list-item-title>{{ followingUser.nickname }}</v-list-item-title>
                            </v-list-item-content>

                          </v-col>
                        </v-row>
                        <v-divider></v-divider>
                      </v-list-item>
                    </v-list>

                  </v-col>
                </v-row>
              </v-col>
            </v-col>
          </v-card>
        </v-row>
        <v-row class="bordered-row" style="margin-top: 60px;margin-bottom: 50px">
          <h2 style="margin-top: 50px;margin-left:60px;margin-bottom: 40px">내가 저장한 서비스</h2>

          <!-- 내가 저장한 서비스 카드가 비어있을 때 -->
          <v-sheet
            class="mx-auto"
            max-width="100%"
            min-height="435px"
          >
            <v-slide-group show-arrows>
              <!-- 서비스 리스트가 비어있을 때 버튼을 추가 -->
              <v-slide-group-item v-if="serviceList.length === 0">
                <v-card
                  style="text-align:center;margin-bottom:10px;margin-right: 5px; margin-left: 5px"
                  min-width="350"
                  @click="navigateToServiceCreation"
                  height="360"
                >
                  <v-card-title>내가 저장한 서비스가 없습니다.</v-card-title>
                  <v-card-subtitle>서비스를 추가해보세요!</v-card-subtitle>
                  <v-icon large>mdi-plus</v-icon>
                </v-card>
              </v-slide-group-item>

              <!-- 서비스 리스트가 비어있지 않을 때 서비스 카드를 표시 -->
              <v-slide-group-item v-else v-for="(item, index) in serviceList" :key="index">
                <v-card
                  style="text-align:center;margin-bottom:10px;margin-right: 5px; margin-left: 5px"
                  min-width="350"
                  @click="openServiceModal(item)"
                  height="360"
                >
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
        <v-row>
          <v-col>
            <v-card elevation="5">
              <v-card-title>
                <h2 style="margin-top: 50px;margin-left:60px;margin-bottom: 40px">내가 작성한 글</h2>
                <v-spacer></v-spacer>
                <v-row style="margin-top: 40px">
                  <v-col cols="2"></v-col>
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
                :items="postList"
                item-value="id"
                :search="search"
                class="elevation-1"

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
        </v-row>


      </v-col>
    </v-col>
  </v-container>

  <UpdateInterestModal v-model="dialog" :list="user.interest" v-if="user.interest"/>
  <ServiceModal v-model="dialog2" :service="selectedService" v-if="selectedService"/> <!-- 모달 컴포넌트를 추가합니다. -->
  <PostModal v-model="dialog3" :post="selectedPost" v-if="selectedPost"/> <!-- 모달 컴포넌트를 추가합니다. -->


</template>

<style scoped>
.bordered-row {

  border: 1px solid #ccc; /* 테두리 스타일 및 색상 설정 */
  border-radius: 4px; /* 테두리의 모서리 둥글게 설정 (선택사항) */
  padding: 10px; /* 테두리 내부 여백 설정 (선택사항) */
}
</style>
