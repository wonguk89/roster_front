<template>
    <div>
        <h1>Roster Step 1</h1>
        <label for="year">년도:</label>
        <select v-model="selectedYear">
            <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
        </select>
        <br />
        <label for="month">월:</label>
        <select v-model="selectedMonth">
            <option v-for="month in monthOptions" :key="month" :value="month">{{ month }}</option>
        </select>
        <br />
        <button @click="moveToNextStep">다음</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selectedYear: new Date().getFullYear().toString(),
            selectedMonth: (new Date().getMonth() + 1).toString().padStart(2, '0'),
        };
    },
    computed: {
        yearOptions() {
            const currentYear = new Date().getFullYear();
            return Array.from({ length: 11 }, (_, index) => (currentYear + index).toString());
        },
        monthOptions() {
            return Array.from({ length: 12 }, (_, index) => (index + 1).toString().padStart(2, '0'));
        },
        yearMonth() {
            return `${this.selectedYear}-${this.selectedMonth}`;
        },
    },
    methods: {
        moveToNextStep() {
            this.$store.dispatch('updateYearMonth', this.yearMonth);
            this.$router.push({ name: 'RosterStep2' });
        },
    },
};
</script>

<style>
/* TODO: 필요한 스타일 추가 */
</style>
