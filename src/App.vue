<template>
    <div>
        <router-view @nextStep="handleNextStep" />
    </div>
</template>

<script>
export default {
    methods: {
        handleNextStep(selectedYearMonth) {
            console.log("Selected Year and Month in App.vue:", selectedYearMonth);
            this.$router.push({ name: 'RosterStep2', params: { selectedYearMonth } });
        },
    },
};
</script>

<style>
/* TODO: 필요한 스타일 추가 */
</style>
