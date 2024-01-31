<template>
    <div class="text-center">
        <select v-model="selectedYear" class="form-select mx-auto text-center" :class="{ 'is-invalid': showError && !selectedYear }" style="width: 250px; font-size: 15px;">
            <option value="" disabled selected>스케줄 생성 년도와</option>
            <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
        </select>
        <div v-if="showError && !selectedYear" class="invalid-feedback" style="font-size: 12px;">년도를 선택해주세요.</div>

        <br/>

        <select v-model="selectedMonth" class="form-select mx-auto text-center" :class="{ 'is-invalid': showError && !selectedMonth }" style="width: 250px; font-size: 15px;">
            <option value="" disabled selected>월을 선택해 주세요</option>
            <option v-for="month in monthOptions" :key="month" :value="month">{{ month }}</option>
        </select>
        <div v-if="showError && !selectedMonth" class="invalid-feedback" style="font-size: 12px;">월을 선택해주세요.</div>

    </div>
</template>

<script>
export default {
    data() {
        return {
            selectedYear: '',
            selectedMonth: '',
            showError: false,
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
            if (this.selectedYear && this.selectedMonth) {
                this.$store.dispatch('updateYearMonth', this.yearMonth);
                this.$emit('moveToNextStep');
            } else {
                this.showError = true;
            }
        },
    },
};
</script>

<style>
.is-invalid {
    border-color: #dc3545 !important;
}

.invalid-feedback {
    color: #dc3545;
    margin-top: 2px;
    font-size: 12px;
}
</style>
