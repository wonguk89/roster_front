<template>
    <div>
        <form id="formStep1">
        <div style="margin-right: 10px; text-align: center;">
            <select v-model="selectedYear" class="form-select" :class="{ 'is-invalid': showError && !selectedYear }" >
                <option value="" disabled selected>스케쥴 생성 년도와</option>
                <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
            </select>
            <div v-if="showError && !selectedYear" class="invalid-feedback" style="font-size: 12px;">년도를 선택해주세요.</div>
        </div>

        <div style="text-align: center;">
            <select v-model="selectedMonth" class="form-select" :class="{ 'is-invalid': showError && !selectedMonth }">
                <option value="" disabled selected>월을 선택해 주세요</option>
                <option v-for="month in monthOptions" :key="month" :value="month">{{ month }}</option>
            </select>
            <div v-if="showError && !selectedMonth" class="invalid-feedback" style="font-size: 12px;">월을 선택해주세요.</div>
        </div>
        </form>
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

#formStep1{
    display: flex;
    justify-content: center;
    align-items: center;
}
#formStep1 select{
    width: 210px;
    font-size: 15px;
    text-align: center;
    margin-top: 70px;
    margin-bottom: 50px;
}
#formStep1 .is-invalid {
    border-color: #dc3545 !important;
}
#formStep1 .invalid-feedback{
    color: #dc3545;
    margin-top: -50px;
    font-size: 12px;
}
</style>
