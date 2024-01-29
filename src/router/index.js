import { createRouter, createWebHistory } from 'vue-router';
import RosterStep1 from '../view/RosterStep1.vue';
import RosterStep2 from '../view/RosterStep2.vue';
import RosterStep3 from '../view/RosterStep3.vue';
import RosterStep4 from '../view/RosterStep4.vue';
import RosterStep5 from '../view/RosterStep5.vue';
import RosterStep6 from '../view/RosterStep6.vue';

const routes = [
    {
        path: '/',
        name: 'RosterStep1',
        component: RosterStep1,
    },
    {
        path: '/roster-step2',
        name: 'RosterStep2',
        component: RosterStep2,
    },
    {
        path: '/roster-step3',
        name: 'RosterStep3',
        component: RosterStep3,
    },
    {
        path: '/roster-step4',
        name: 'RosterStep4',
        component: RosterStep4,
    },
    {
        path: '/roster-step5',
        name: 'RosterStep5',
        component: RosterStep5,
    },
    {
        path: '/roster-step6',
        name: 'RosterStep6',
        component: RosterStep6,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
