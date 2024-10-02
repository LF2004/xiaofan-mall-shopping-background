import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css';
import './assets/element.css';
import App from './App.vue'
import router from './router';

const app = createApp(App)

const win: any = window
if (process.env.NODE_ENV === 'development') {
    if ('__VUE_DEVTOOLS_GLOBAL_HOOK__' in win) {
        win.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app
    }
}

app.use(router).use(ElementPlus).mount('#app')
