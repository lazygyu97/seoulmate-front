import { createRouter, createWebHistory } from 'vue-router';
import axios from '@/axios/axios-instance';

const routes = [
  {
    path: '/',
    component: () => import('@/App.vue'),
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
      },      {
        path: 'signup',
        name: 'Signup',
        component: () => import('@/views/Signup.vue'),
      },
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
        meta: { requiresAuth: true },
        children: [
          // /home 라우트 아래에 추가적인 자식 라우트를 정의합니다.
          {
            path: '',
            name: 'main',
            component: () => import('@/views/Main.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: 'communication',
            name: 'Communication',
            component: () => import('@/views/Community.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: 'publicService',
            name: 'PublicService',
            component: () => import('@/views/PublicService.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: 'myPage',
            name: 'MyPage',
            component: () => import('@/views/MyPage.vue'),
            meta: { requiresAuth: true },
          },      {
            path: 'userPage/:id',
            name: 'userPage',
            component: () => import('@/views/UserPage.vue'),
            meta: { requiresAuth: true },
          },


          // 추가적인 자식 라우트를 여기에 계속 추가할 수 있습니다.
        ],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    // 인증이 필요한 페이지인 경우
    try {
      const response = await axios.get("/users");
      console.log("유저정보",response);
      window.localStorage.setItem('username', response.data.username);
      window.localStorage.setItem('userNickname', response.data.nickname);
      window.localStorage.setItem('userImage', response.data.image);
      window.localStorage.setItem('userAddress', response.data.address);
      window.localStorage.setItem('userInterests', response.data.interests);
      window.localStorage.setItem('email', response.data.email);
      window.localStorage.setItem('id', response.data.id);
      next();
    } catch (error) {
      console.error(error);
      alert("로그인이 필요합니다.");
      next('/');
    }
  } else {
    // 인증이 필요하지 않은 페이지인 경우
    next();
  }
});

export default router;
