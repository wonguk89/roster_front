// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/store'; // store.js 파일을 import
import {createBootstrap} from 'bootstrap-vue-next'

// Add the necessary CSS
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'


const app = createApp(App);
app.use(createBootstrap) // Important
app.use(router);
app.use(store); // Vuex store를 Vue 앱에 추가

app.mount('#app');
