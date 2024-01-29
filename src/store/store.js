// store.js
import { createStore } from 'vuex';

const store = createStore({
    state: {
        selectedYearMonth: '', // 초기값은 비어있는 문자열로 설정
    },
    mutations: {
        setYearMonth(state, payload) {
            state.selectedYearMonth = payload;
        },
    },
    actions: {
        updateYearMonth({ commit }, payload) {
            commit('setYearMonth', payload);
        },
    },
    getters: {
        getYearMonth: (state) => state.selectedYearMonth,
    },
});

export default store;
