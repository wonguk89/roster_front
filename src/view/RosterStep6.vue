<template>
    <div>
        <h2>Roster Step 6</h2>
        <p>Selected Year and Month: {{ yearMonth }}</p>
    </div>
</template>

<script>
export default {
    methods:{
        moveToNextStep() {
            this.$emit('moveToNextStep');
        },
    },
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
