<template>
  <v-dialog v-model="dialog" max-width="900" max-height="1100">
    <v-card align="center">
      <v-img style="margin-top: 30px; margin-bottom: 30px" cover>
        <template v-if="post.images && post.images.length > 0">
          <!-- 이미지가 있는 경우 -->
          <v-carousel v-if="post.images && post.images.length > 1">
            <v-carousel-item v-for="(image, index) in post.images" :key="index">
              <v-img :src="image.imageUrl" height="500"></v-img>
            </v-carousel-item>
          </v-carousel>
          <v-img v-else :src="post.images[0].imageUrl" height="500"></v-img>

        </template>
        <template v-else>

        </template>
      </v-img>

      <v-col>
        <v-col>
          <v-card elevation="3">
            <v-card-title>{{ post.title }}</v-card-title>

            <v-card-text>작성자 : {{ post.author }}</v-card-text>

            <v-card-text>{{ post.content }}</v-card-text>
            <v-card-subtitle>{{ post.createdAt }}</v-card-subtitle>

            <v-row style="margin-top: 20px">
              <v-col align="end">
                <v-card-text>{{ postLikeLength }}</v-card-text>
              </v-col>
              <v-col align="start">
                <v-btn
                  elevation="0"
                  :icon="isLike ? 'mdi-heart' : 'mdi-heart-outline'"
                  @click="likePost()"
                ></v-btn>
              </v-col>
            </v-row>

          </v-card>

        </v-col>

        <v-col>

          <!-- 댓글 등록창 -->
          <v-row style="margin-left: 10%;margin-top: 10px; align: center">
            <v-col cols="10" md="8">
              <v-text-field variant="outlined" v-model="content" label="댓글 내용"></v-text-field>
            </v-col>
            <v-col cols="10" md="2">
              <v-btn elevation="1" size="large" color="white" @click="addComment">댓글 등록</v-btn>
            </v-col>
          </v-row>

          <!-- 댓글 목록을 표시합니다. -->
          <v-card-text v-if="post.comments && post.comments.length > 0">
            <div class="comment-list">
              <v-list>
                <v-list-item v-for="(comment, index) in post.comments" :key="index">

                  <v-row>
                    <v-card-text>{{ comment.content }}</v-card-text>
                    <v-card-text>{{ comment.username }}</v-card-text>
                  </v-row>

                </v-list-item>
              </v-list>
            </div>
          </v-card-text>
          <v-card-text v-else>
            등록된 댓글이 없습니다.
          </v-card-text>
        </v-col>
      </v-col>

    </v-card>
  </v-dialog>
</template>

<script>
import axios from "@/axios/axios-instance";

export default {
  props: {
    post: Object, // 클릭한 항목의 정보를 받아올 prop입니다.
  },
  mounted() {
    // 로컬 스토리지에서 저장된 username 가져오기
    const username = localStorage.getItem('username');
    this.postLikeLength = this.post.postLikes.length;
    // post.postLikes 배열을 순회하며 username 비교
    for (const like of this.post.postLikes) {
      if (like.username === username) {
        this.isLike = true; // 예시로 'isLike' 데이터를 true로 설정
        break; // 일치하는 경우를 찾으면 루프 종료
      }
    }
  },
  data() {
    return {
      dialog: false, // 모달 창을 열고 닫는 상태를 관리합니다.
      content: '',
      isLike: false,
      postLikeLength: null,
    };
  },
  methods: {
    async addComment() {
      // 새로운 댓글을 post.comments 배열에 추가하는 로직을 작성하세요.
      if (this.content == null || this.content == '') {
        alert("댓글을 입력해주세요")
      } else {
        const data = {
          content: this.content
        };
        try {
          const response = await axios.post("/" + this.post.id + "/comment", data);
          const updatedPost = response.data;
          this.post.comments.push(updatedPost.comments[updatedPost.comments.length - 1]);
          this.content = null;
        } catch (error) {
          console.log(error)
          this.content = null;

        }
      }

    },
    async likePost() {
      if (this.isLike) {
        try {
          const response = await axios.delete("/posts/" + this.post.id + "/likes");
          const updatedPost = response.data;

          const updatedPostLikes = this.post.postLikes.filter(like => like.username == updatedPost.username);
          this.post.postLikes = updatedPostLikes; // postLikes 배열을 업데이트

          this.postLikeLength--;
          this.isLike = false;
        } catch (error) {
          console.log(error)
          alert("처리 중 오류가 발생하였습니다.")
        }
      } else {
        try {
          const response = await axios.post("/posts/" + this.post.id + "/likes");
          const updatedPost = response.data;
          this.post.postLikes = updatedPost.postLikes; // postLikes 배열을 업데이트
          this.postLikeLength++;
          this.isLike = true;

        } catch (error) {
          console.log(error)
          alert("처리 중 오류가 발생하였습니다.")
        }
      }

    }


  },
};
</script>

<style>
.comment-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
}

.comment-list v-list-item {
  margin-bottom: 10px;
}
</style>
