import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/store';
import { createBootstrap } from 'bootstrap-vue-next';

// Bootstrap 및 BootstrapVue의 CSS 스타일 추가
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';

const app = createApp(App);

// createBootstrap() 함수를 호출하여 BootstrapVue 인스턴스를 생성하고
// 반환된 { bootstrap } 객체를 사용하여 BootstrapVue를 앱에 추가
const { bootstrap } = createBootstrap();
app.use(bootstrap);
// 라우터 및 스토어를 Vue 앱에 추가
app.use(router);
app.use(store);

// 앱을 HTML 문서의 특정 엘리먼트에 마운트
app.mount('#app');
