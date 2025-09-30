import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      name: 'shipmentJourney',
      component: import('@/views/ShipmentJourney.vue'),
    }
  ],
})

export default router
