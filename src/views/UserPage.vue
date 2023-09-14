<script>

import axios from '@/axios/axios-instance';

export default {
  props: ['id'],
  mounted() {
    this.user.id = this.$route.params.id;

    this.findUser();

  },
  data() {
    return {
      isFollow: false,
      openFollow: false,
      user: {
        id: '',
        username: '',
        nickname: '',
        email: '',
        interest: [],
        address: '',
        profileImage: '',
        followList: [],
        followingList: [],
      }

    };
  },
  methods: {
    async findUser() {
      await axios.get("/users/" + this.user.id + "/profile")
        .then((response) => {
          console.log(response.data)
          this.user.username = response.data.username;
          this.user.nickname = response.data.nickname;
          this.user.email = response.data.email;
          this.user.address = response.data.address;
          this.user.profileImage = response.data.image;
          this.user.interest = response.data.interests;

          this.getFollowList()
        })
        .catch((error) => {
          console.error('닉네임 변경 실패', error);
        });
    },

    async getFollowList() {

      const localStorageId = localStorage.getItem('id');

      await axios.get("/follow/" + this.user.id + "/followingList",)
        .then((response) => {
          this.user.followingList = response.data;
          console.log("팔로잉", this.user.followingList)

        })
        .catch((error) => {
          console.error('닉네임 변경 실패', error);
        });
      await axios.get("/follow/" + this.user.id + "/followerList",)
        .then((response) => {
          this.user.followList = response.data;

          // 팔로워 목록을 순회하면서 ID 비교
          this.user.followList.forEach((follower) => {
            // 만약 ID가 일치하면 isCurrentUser 속성을 false로 설정
            if (follower.id == localStorageId) {
              this.isFollow = true;
            } else {
              this.isFollow = false;

            }
            console.log(this.isFollow)
          });
          console.log("팔로우", this.user.followList)

        })
        .catch((error) => {
        });
    },
    openFollowList() {
      this.openFollow = !this.openFollow;
    },
    userPage(id) {

      if (id == localStorage.getItem('id')) {
        this.$router.push('/home/myPage/')
      } else {
        console.log(id)
        this.$router.push('/home/userPage/' + id)
      }


    },
    async follow() {
      await axios.post("/follow/" + this.user.id)
        .then((response) => {
          window.location.reload(); // 창 새로고침
        })
        .catch((error) => {

        });


    },
    async unfollow() {

      await axios.delete("/follow/" + this.user.id)
        .then((response) => {
          window.location.reload(); // 창 새로고침
        })
        .catch((error) => {

        });

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
                <v-col>
                  <v-col>
                    <v-btn v-if="!isFollow" @click="follow">팔로우</v-btn>
                    <v-btn v-if="isFollow" @click="unfollow">언팔로우</v-btn>
                  </v-col>
                </v-col>


              </v-row>

              <v-row>

                <v-col align="center">
                  <v-avatar
                    style="margin-left: 20%;margin-top: 20px"
                    color="grey"
                    size="220"
                  >
                    <v-img :src="user.profileImage" cover></v-img>
                  </v-avatar>

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
                          <v-list-item-title>아이디 : {{ user.nickname }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>이메일 : {{ user.email }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>거주지 : {{ user.address }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title style="margin-bottom: 10px">관심사</v-list-item-title>
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
      </v-col>
    </v-col>
  </v-container>
</template>

<style scoped>
.bordered-row {

  border: 1px solid #ccc; /* 테두리 스타일 및 색상 설정 */
  border-radius: 4px; /* 테두리의 모서리 둥글게 설정 (선택사항) */
  padding: 10px; /* 테두리 내부 여백 설정 (선택사항) */
}
</style>
