<template>
  <v-app id="inspire">
    <v-main class="blue-grey lighten-4">
      <v-container style="max-width: 1300px;" fill-height>
        <v-row align="center" justify="center" style="height: 100vh;"> <!-- height 속성을 추가하여 화면 전체 높이로 설정 -->

          <v-col cols="12" sm="8" md="6">
            <v-card elevation="20">
              <div class="pa-10">
                <v-col align="center" style="margin-bottom: 20px">
                  <v-img max-width="50%" src="@/assets/logo.png"></v-img>
                </v-col>
                <h2 style="color:#454545;text-align: center" class="mb-10">회원가입</h2>
                <v-form ref="form" lazy-validation>
                  <v-text-field
                    style="margin-bottom: 18px"
                    :append-inner-icon="show4 ? 'mdi-check-circle' : 'mdi-close-circle-outline'"
                    @click:append-inner="idCheck"
                    v-model="user_id"
                    :rules="user_id_rule"
                    label="아이디"
                    hint="아이디 중복확인을 위해 우측 버튼을 클릭해주세요"
                    prepend-inner-icon="mdi-account"
                    variant="outlined"
                  ></v-text-field>
                  <v-text-field
                    style="margin-bottom: 18px"
                    variant="outlined"
                    v-model="user_nm"
                    :rules="user_nm_rule"
                    label="이름"
                    prepend-inner-icon="mdi-account"
                  ></v-text-field>
                  <v-text-field
                    style="margin-bottom: 18px"
                    variant="outlined"
                    prepend-inner-icon="mdi-lock"
                    :append-inner-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="user_pw_rule"
                    :type="show3 ? 'text' : 'password'"
                    name="user_pw"
                    v-model="user_pw"
                    label="비밀번호"
                    hint="8자 이상의 비밀번호를 입력해주세요"
                    class="input-group--focused"
                    @click:append-inner="show3 = !show3"
                  ></v-text-field>
                  <v-text-field
                    style="margin-bottom: 18px"
                    variant="outlined"
                    prepend-inner-icon="mdi-lock"
                    :append-inner-icon="show4 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="user_pw_rule2"
                    :type="show4 ? 'text' : 'password'"
                    v-model="user_pw_chk"
                    name="user_pw_chk"
                    label="비밀번호 확인"
                    hint="8자 이상의 비밀번호를 입력해주세요"
                    class="input-group--focused"
                    @click:append-inner="show4 = !show4"
                  ></v-text-field>

                  <v-row align="center">
                    <v-col>
                      <v-autocomplete
                        variant="outlined"
                        v-model="country"
                        :rules="[() => !!country || '필수 입력 사항입니다.']"
                        :items="countries"
                        label="거주지"
                        placeholder="구를 입력해주세요 ex) 용산구"
                        required
                      ></v-autocomplete>
                    </v-col>
                    <v-col>
                      <v-autocomplete
                        variant="outlined"
                        v-model="gender"
                        :rules="[() => !!gender || '필수 입력 사항입니다.']"
                        :items="genders"
                        label="성별"
                        placeholder="성별을 선택해주세요"
                        required
                      ></v-autocomplete>
                    </v-col>
                    <v-col>
                      <v-text-field
                        variant="outlined"
                        :rules="[() => !!age || '필수 입력 사항입니다.']"
                        v-model="age"
                        label="나이"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row align="center">
                    <v-col cols="8">
                      <v-text-field
                        variant="outlined"
                        :append-inner-icon="emailIcon"
                        v-model="user_email"
                        :rules="user_email_rule"
                        :loading="loading"
                        prepend-inner-icon="mdi-email"
                        type="E-mail"
                        label="이메일"
                        hint="인증코드 전송을 위해 우측 아이콘을 클릭해주세요"
                        @click:append-inner="emailSend"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        :append-inner-icon="codeIcon1"
                        variant="outlined"
                        v-model="email_code_user"
                        :rules="email_check_rule"
                        label="인증코드"
                        @click:append-inner="emailCheck"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row align="center">

                    <v-col cols="8">
                      <v-text-field
                        variant="outlined"
                        :append-inner-icon="smsIcon"
                        v-model="user_sms"
                        :rules="user_sms_rule"
                        :loading="loading"
                        prepend-inner-icon="mdi-cellphone-message"
                        label="전화번호 인증 ( - 를 제외한 전화번호 )"
                        hint="인증코드 전송을 위해 우측 아이콘을 클릭해주세요"
                        @click:append-inner="smsSend"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        :append-inner-icon="codeIcon2"
                        variant="outlined"
                        v-model="sms_code_user"
                        :rules="sms_check_rule"
                        label="인증코드"
                        @click:append-inner="smsCheck"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-btn
                    @click="addUserShow"
                    color="blue lighten-1 text-capitalize"
                    class="font-weight-bold"
                    style="font-size: 15px; margin-top: 20px"
                    depressed
                    large
                    block
                    dark
                  >회원가입
                  </v-btn>
                </v-form>

              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>


<script>
import axios from "@/axios/axios-instance";

export default {
  name: 'SignupForm',
  data() {
    return {
      loading: false,
      emailIcon: "mdi-email-arrow-right-outline",
      codeIcon1: "mdi-close-circle-outline",
      codeIcon2: "mdi-close-circle-outline",
      smsIcon: "mdi-message-text-fast-outline",
      idIsChecked: false,
      show3: false,
      show4: false,
      show5: false,
      user_id: '',
      user_id_rule: [
        v => !!v || '아이디는 필수 입력사항입니다.',
        v => /[a-zA-Z][0-9a-zA-Z]{4,15}$/.test(v) || '아이디는  최소 5자 이상, 영문+숫자만 입력 가능합니다.',
        v => !(v && v.length >= 15) || '아이디는 15자 이상 입력할 수 없습니다.'
      ],
      user_nm: '',
      user_nm_rule: [
        v => !!v || '이름은 필수 입력사항입니다.',
        v => !(v && v.length >= 30) || '이름은 30자 이상 입력할 수 없습니다.',
        v => !/[~!@#$%^&*()_+|<>?:{}]/.test(v) || '이름에는 특수문자를 사용할 수 없습니다.'
      ],
      user_pw: '',
      user_pw_chk: '',
      user_pw_rule: [
        v => this.state === 'ins' ? !!v || '패스워드는 필수 입력사항입니다.' : true,
        v =>/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/.test(v) || '비밀번호는 영문+숫자+특수기호 조합 8자리 이상만 입력 가능합니다.',
        v => !(v && v.length >= 30) || '패스워드는 30자 이상 입력할 수 없습니다.',
      ],
      user_pw_rule2: [
        v => this.state === 'ins' ? !!v || '패스워드는 필수 입력사항입니다.' : true,
        v => !(v && v.length >= 30) || '패스워드는 30자 이상 입력할 수 없습니다.',
        v => v === this.user_pw || '패스워드가 일치하지 않습니다.'
      ],
      user_email: '',
      user_email_rule: [
        v => !!v || '이메일을 입력해주세요.',
        v => {
          const replaceV = v.replace(/(\s*)/g, '')
          const pattern = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/
          return pattern.test(replaceV) || '이메일 형식으로 입력해주세요'
        }
      ],
      user_sms:'',
      user_sms_rule: [
        v => !!v || '전화번호를 입력해주세요 입력해주세요.',
        v => {
          const replaceV = v.replace(/-/g, '')
          const pattern = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/
          return pattern.test(replaceV) || '올바르지 않은 번호입니다.'
        }
      ],
      email_code: '',
      email_code_user: '',
      email_check: false,
      email_check_rule: [
        v => !!v || '인증코드를 입력해주세요',
      ],
      sms_code: '',
      sms_code_user: '',
      sms_check: false,
      sms_check_rule: [
        v => !!v || '인증코드를 입력해주세요',
      ],
      country: '',
      countries: ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"],
      gender: '',
      genders: ["남성", "여성"],
      age: ''
    };
  },
  methods: {
    emailSend() {
      if (this.user_email == '') {
        alert("이메일을 입력해주세요")
      } else {
        this.emailIcon = ""
        this.loading = true;
        const data = {
          email: this.user_email
        };
        axios.post("/users/signup/mail", data)
          .then(response => {
            console.log(response);
            this.email_code = response.data
            alert('인증 코드 전송 선공, 이메일을 확인해주세요')
            this.loading = false;
            this.emailIcon = "mdi-email-check-outline"
          })
          .catch(error => {
            this.loading = false;
            this.user_email = '';
            this.emailIcon = "mdi-email-remove-outline"
            console.log(error);
            alert('인증 코드 전송 실패, 이메일을 확인해주세요')
          })
      }

    },
    emailCheck() {
      if (this.email_code == this.email_code_user) {
        axios({
          method: 'get',
          url: '/users/signup/mail',
          params: {
            email: this.user_email,
            code: this.email_code_user,
          }
        }, {withCredentials: true})
          .then((Response) => {
            console.log(Response);
            this.email_check = true;
            this.codeIcon1 = "mdi-check-circle"
            alert("인증이 완료되었습니다.")
          }).catch((Error) => {
          console.log(Error);
          this.email_code_user = ''
          alert("인증 실패")
        })
      } else {
        this.email_code_user = ''
        alert("인증 번호가 일치하지 않습니다.")
      }
    },
    smsSend() {
      if (this.user_sms == '') {
        alert("이메일을 입력해주세요")
      } else {
        this.smsIcon = ""
        this.loading = true;
        const data = {
          phone: this.user_sms
        };
        axios.post("/users/signup/sms", data)
          .then(response => {
            console.log(response);
            this.sms_code = response.data
            alert('인증 코드 전송 선공, 메시지를 확인해주세요')
            this.loading = false;
            this.smsIcon = "mdi-message-settings"
          })
          .catch(error => {
            this.loading = false;
            this.user_sms = '';
            this.smsIcon = "mdi-message-off"
            console.log(error);
            alert('인증 코드 전송 실패, 전화번호를 확인해주세요')
          })
      }

    },
    smsCheck() {
      if (this.sms_code == this.sms_code_user) {
        axios({
          method: 'get',
          url: '/users/signup/sms',
          params: {
            phone: this.user_sms,
            code: this.sms_code_user,
          }
        }, {withCredentials: true})
          .then((Response) => {
            console.log(Response);
            this.sms_check = true;
            this.codeIcon2 = "mdi-check-circle"
            alert("인증이 완료되었습니다.")
          }).catch((Error) => {
          console.log(Error);
          this.sms_code_user = ''
          alert("인증 실패")
        })
      } else {
        this.sms_code_user = ''
        alert("인증 번호가 일치하지 않습니다.")
      }
    },
    idCheck() {
      if (this.user_id == '') {
        alert("아이디를 입력해주세요")
      } else {
        axios.post("/users/" + this.user_id)
          .then(response => {
            console.log(response);
            this.idIsChecked = true
            this.show4 = true;
            alert('사용가능한 아이디입니다.')
          })
          .catch(error => {
            console.log(error);
            alert("중복된 아이디입니다.")
            this.user_id = ''

          })
      }


    },
    addUserShow() {
      if (this.idIsChecked && this.email_check) {
        const validate = this.$refs.form.validate();
        if (validate) {
          const userInfo = {
            username: this.user_id,
            password: this.user_pw_chk,
            nickname: this.user_nm,
            phone: this.user_sms,
            address: this.country,
            age: this.age,
            gender:this.gender,
            email: this.user_email,
          };

          axios.post("/users/signup", userInfo)
            .then(response => {
              console.log(response);
              alert('회원가입 성공')
              this.$router.push('/')
            })
            .catch(error => {
              console.log(error);
              alert(error.response.data)
            })
        }
      } else {
        alert("회원가입 실패")
      }
    },
  },
};
</script>

<style scoped></style>
