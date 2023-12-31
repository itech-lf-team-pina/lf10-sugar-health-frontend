import App from './App.vue'
import { createApp } from 'vue'
import '@fortawesome/fontawesome-free/js/all'
import { createRouter, createWebHistory} from 'vue-router'
import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from './common/firebase'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";


import routes from './common/routes'
import {store} from "@/store/store";

const router = createRouter({
    history: createWebHistory(),
    routes
})

const app = createApp(App)
app.use(router)
app.use(store)
app.use(Toast, {});

app.use(VueFire, {
    // imported above but could also just be created here
    firebaseApp,
    modules: [
      // we will see other modules later on
      VueFireAuth(),
    ],
  })

app.mount('#app')

