<template>
  <v-dialog v-model="dialog" max-width="800">
    <v-card>
      <v-col align-self="center" style="max-width: 85%">
        <v-card-title>글쓰기</v-card-title>
        <v-card-text>
          <v-text-field v-model="title" variant="outlined" label="제목"></v-text-field>
          <v-textarea v-model="content" variant="outlined" label="내용"></v-textarea>

          <v-card-subtitle>이미지는 최대 3개까지 첨부가능합니다.</v-card-subtitle>
          <div style="margin-top: 10px" v-for="(visible, index) in imageFields" :key="index">
            <input
              v-if="visible"
              type="file"
              @change="handleImageUpload($event, index)"
              accept="image/*"
            >
            <v-btn v-if="index > 0 && visible" @click="removeImageField(index)">제거</v-btn>
          </div>
          <v-btn style="margin-top: 10px" @click="addImageField">이미지 추가</v-btn>
        </v-card-text>

        <v-card-action style="margin-left:70%">
          <v-btn elevation="3" @click="createPost">작성</v-btn>
          <v-btn elevation="3" style="margin-left: 30px" @click="cancel">취소</v-btn>
        </v-card-action>
      </v-col>

    </v-card>
  </v-dialog>
</template>

<script>
import axios from "@/axios/axios-instance";

export default {
  props: {
    value: Boolean, // 부모 컴포넌트에서 모달 열기/닫기 상태를 전달받습니다.
    list: Array,
  },
  data() {
    return {
      dialog:false, // 모달 열기/닫기 상태를 자체적으로 관리합니다.
      title: '',
      content: '',
      images: [], // 이미지 파일을 저장할 배열
      imageFields: [true], // 이미지 업로드 필드를 관리하는 배열 (true는 항상 표시되며 추가되지 않음)
    };
  },

  methods: {
    addImageField() {
      if (this.imageFields.length < 3) {     // "이미지 추가" 버튼을 클릭하면 이미지 업로드 필드를 추가합니다.
        this.imageFields.push(true);
        this.images.push(null); // 이미지 배열에 빈 값을 추가합니다.}
      }

    },
    removeImageField(index) {
      // 이미지 업로드 필드를 제거합니다.
      this.imageFields.splice(index, 1);
      this.images.splice(index, 1); // 제거된 필드에 해당하는 이미지도 제거합니다.
    }
    ,
    handleImageUpload(event, index) {
      // 이미지를 업로드할 때 호출됩니다.
      const fileInput = event.target;
      const file = fileInput.files[0];
      if (file) {
        // 이미지 파일을 배열에 저장합니다.
        this.images[index] = file;
      }
    }
    ,
    async createPost() {
      // 작성 버튼을 클릭할 때 호출됩니다.
      // this.title, this.content, this.images를 이용하여 글쓰기 작업을 수행합니다.
      // 작성이 완료되면 부모 컴포넌트로 이벤트를 전달하여 모달을 닫습니다.
      console.log(this.images)
      if(this.title !=null && this.content != null){
        const formData = new FormData();
        formData.append('title',this.title)
        formData.append('content',this.content)
// 이미지 배열을 개별적으로 추가
        for (let i = 0; i < this.images.length; i++) {
          formData.append('file', this.images[i]);
        }

         await axios.post('/posts', formData, {
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

      // 모달 닫기
      this.dialog = false;
    }
    ,
    cancel() {
      // 취소 버튼을 클릭할 때 호출됩니다.
      // 모달을 닫습니다.
      this.dialog = false;
    }
    ,
  },
};
</script>
