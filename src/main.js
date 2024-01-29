// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/store'; // store.js 파일을 import

const app = createApp(App);

app.use(router);
app.use(store); // Vuex store를 Vue 앱에 추가

app.mount('#app');
