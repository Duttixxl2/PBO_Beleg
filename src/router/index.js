import { createRouter, createWebHistory } from 'vue-router'

import FirstView from '@/views/FirstView.vue'
import Stundenplan_Tagesansicht_View from '@/views/Stundenplan_Tagesansicht_View.vue'
import Stundenplan_Wochenansicht_View from '@/views/Stundenplan_Wochenansicht_View.vue'
import Stundenplan_Stundenplane_View from '@/views/Stundenplan_Stundenplane_View.vue'
import Create_Timetable_View from '@/views/Create_Timetable_View.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: FirstView
    },  
    {
      path: '/stundenplan_tagesansicht',
      name: 'tagesansicht',
      component: Stundenplan_Tagesansicht_View

    },
    {
      path:'/stundenplan_wochenansicht',
      name: 'wochenansicht',
      component: Stundenplan_Wochenansicht_View
    },
    {
      path:'/stundenplan_stundenplane',
      name: 'stundenplane',
      component: Stundenplan_Stundenplane_View
    },
    {
      path: '/create_stundenplan',
      name: 'create_stundenplan',
      component: Create_Timetable_View
    }
  ]
})

export default router
