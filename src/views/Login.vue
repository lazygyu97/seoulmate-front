<template>
  <v-app id="inspire">
    <v-main class="blue-grey lighten-4">
      <v-container  style="max-width: 1300px;" fill-height>
        <v-row align="center"  justify="center" style="height: 100vh;"> <!-- height 속성을 추가하여 화면 전체 높이로 설정 -->
          <v-col cols="12" sm="8" md="6">
            <v-card elevation="20">
              <div class="pa-10">
                <v-col align="center" style="margin-bottom: 30px">
                  <v-img max-width="50%"  src="@/assets/logo.png"></v-img>
                </v-col>
<!--                <h2 style="color:#454545;text-align: center" class="mb-10">서울메이트에 오신걸 환영합니다.</h2>-->
                <v-text-field
                  variant="outlined"
                  v-model="user_id"
                  label="아이디"
                  prepend-inner-icon="mdi-account"
                ></v-text-field>
                <v-text-field
                  variant="outlined"
                  :append-inner-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show3 ? 'text' : 'password'"
                  v-model="user_pw"
                  prepend-inner-icon="mdi-lock"
                  @click:append-inner="show3 = !show3"
                  label="패스워드"
                >
                </v-text-field>
                <v-row justify="center" style="margin-top: 10px">
                  <v-btn
                    @click="fnLogin"
                    color="blue lighten-1 text-capitalize"
                    depressed
                    dark
                    class="mb-3 font-weight-bold"
                    width="55%"
                  >
                    로그인
                  </v-btn>
                  <v-btn
                    @click="addUserShow"
                    color="blue lighten-1 text-capitalize"
                    depressed
                    dark
                    class="mb-5 font-weight-bold"
                    width="55%"
                  >
                    회원가입
                  </v-btn>

                </v-row>

                <v-row style="margin-top: 20px" justify-center> <!-- 가로 중앙 정렬 추가 -->

                  <v-divider style="margin-bottom: 30px"></v-divider>
                  <v-col cols="4" class="pa-1">

                    <v-btn
                      @click="googleLogin"
                      color="red"
                      depressed
                      large
                      block
                      dark
                      rounded
                    >
                      Google
                    </v-btn>
                  </v-col>
                  <v-col cols="4" class="pa-1">
                    <v-btn
                      @click="naverLogin"
                      color="green"
                      depressed
                      large
                      block
                      dark
                      rounded
                    >
                      Naver
                    </v-btn>
                  </v-col>
                  <v-col cols="4" class="pa-1">
                    <v-btn
                      @click="kakaoLogin"
                      color="yellow darken-2"
                      depressed
                      large
                      block
                      dark
                      rounded
                    >
                      Kakao
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>


<script>
import axios from '@/axios/axios-instance';
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      show3: false,
      user_id: '',
      user_pw: '',
      token: ''
    }
  },
  methods: {
    async logout() {
      try {
        if (window.localStorage.getItem("accessToken") !== null) {
          await axios.get("/users/logout");
        }
        window.localStorage.removeItem("accessToken");
        window.localStorage.removeItem("username");
        window.localStorage.removeItem("userImage");
        Cookies.remove("refreshToken");
      } catch (error) {
        console.log(error);
        alert(error.response.data);
      }
    },
    addUserShow() {
      this.$router.push('/signup');
    },
    async fnLogin() {
      if (this.user_id === '') {
        alert('ID를 입력하세요.');
        return;
      }
      if (this.user_pw === '') {
        alert('비밀번호를 입력하세요.');
        return;
      }
      const data = {
        username: this.user_id,
        password: this.user_pw
      };
      axios
        .post("/users/login", data)
        .then((response) => {
          const accessToken = response.headers.get("Authorization");
          const refreshToken = response.headers.get("RefreshToken");
          if (accessToken !== undefined && refreshToken !== undefined) {
            window.localStorage.setItem('accessToken', accessToken);
            Cookies.set("refreshToken", refreshToken, { sameSite: 'Lax' });

            this.$router.push('/home');
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
          } else {
            console.log("다른 오류:", error);
          }
        });
    },
    googleLogin() {
      window.location.href = `${import.meta.env.VITE_APP_SERVER_URL}/oauth2/authorization/google`;
    },
    naverLogin() {
      window.location.href = `${import.meta.env.VITE_APP_SERVER_URL}/oauth2/authorization/naver`;
    },
    kakaoLogin() {
      window.location.href = `${import.meta.env.VITE_APP_SERVER_URL}/oauth2/authorization/kakao`;
    },
  },
  mounted() {
    this.logout();
  },
};
</script>
