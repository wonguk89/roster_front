<template>
    <div>
        <h1>Roster Step 6</h1>
        <p>Selected Year and Month: {{ yearMonth }}</p>
    </div>
</template>

<script>
export default {
    computed: {
        yearMonth() {
            return this.$store.getters.getYearMonth;
        },
    },
    mounted() {
        console.log('Year and Month in RosterStep6:', this.yearMonth);
    },
};
</script>

<style>
/* TODO: 필요한 스타일 추가 */
</style>
