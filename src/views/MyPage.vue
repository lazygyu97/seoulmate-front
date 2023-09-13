<template>
  <v-container style="max-width: 75%">
    <v-col>

      <v-col>
        <v-row>
          <h2>마이페이지</h2>
        </v-row>
        <v-row style="min-width: 80%; margin-top: 30px">
          <v-card elevation="3" min-width="100%">
            <v-col>

              <v-row style="margin-top: 20px;margin-bottom: 20px">
                <v-col align="center">
                  <v-card-title>{{ user.name }}님의 정보</v-card-title>
                </v-col>
                <v-col></v-col>
              </v-row>

              <v-row>

                <v-col align="center">
                  <v-avatar
                    style="margin-left: 10%"
                    color="grey"
                    size="220">
                    <v-img cover src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"></v-img>
                  </v-avatar>
                </v-col>

                <v-col>
                  <v-card-text >
                    <v-list>

                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>아이디 : {{ user.name }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-content>
                          <v-row style="min-height: 70%">
                            <v-col align-self="center" cols="3">
                              <v-list-item-title>닉네임 : {{ user.name }}</v-list-item-title>
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
                                                  v-model="editedUser.name"></v-text-field>
                                  </v-form>
                                </v-card-text>
                                <v-card-actions>
                                  <v-btn color="primary" @click="saveUser">저장</v-btn>
                                  <v-btn @click="cancelEdit">취소</v-btn>
                                </v-card-actions>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>전화번호 : {{ user.name }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>이메일 : {{ user.name }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>거주지 : {{ user.name }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>관심사 : {{ user.name }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>

                    </v-list>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-col>



          </v-card>
        </v-row>
      </v-col>



    </v-col>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      user: {
        name: "박현규",
        email: "user@example.com",
        phone: "010-1234-5678",
      },
      editedUser: {},
      editing: false,
    };
  },
  methods: {
    editUser() {
      // 수정 모드로 전환하고 현재 유저 정보를 복사하여 편집용 데이터에 할당합니다.
      this.editedUser = {...this.user};
      this.editing = true;
    },
    saveUser() {
      // 수정된 정보를 실제 유저 정보에 저장하고 수정 모드를 해제합니다.
      this.user = {...this.editedUser};
      this.editing = false;
    },
    cancelEdit() {
      // 수정 모드를 취소하고 편집용 데이터를 초기화합니다.
      this.editedUser = {};
      this.editing = false;
    },
  },
};
</script>
