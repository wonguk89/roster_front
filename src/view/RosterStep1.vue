<template>
    <div>
        <p>생성할 스케쥴의 연월을 입력해 주세요</p>
        <form id="formStep1">
        <div style="margin-right: 10px; text-align: center;">
            <select v-model="selectedYear" class="form-select" :class="{ 'is-invalid': showError && !selectedYear }" >
                <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
            </select>
            <div v-if="showError && !selectedYear" class="invalid-feedback" style="font-size: 12px;">년도를 선택해주세요.</div>
        </div>

        <div style="text-align: center;">
            <select v-model="selectedMonth" class="form-select" :class="{ 'is-invalid': showError && !selectedMonth }">
                <option v-for="month in monthOptions" :key="month" :value="month">{{ month }}</option>
            </select>
            <div v-if="showError && !selectedMonth" class="invalid-feedback" style="font-size: 12px;">월을 선택해주세요.</div>
        </div>
        </form>
        <input type="button" @click="additionalButtonAction" class="additional-action-button" value="목록" />
    </div>
</template>

<script>


export default {
    data() {
        return {
            selectedYear: '',
            selectedMonth: '',
            showError: false,
            showError2: false,
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
        additionalButtonAction() {
            if (this.selectedYear && this.selectedMonth) {
                this.$store.dispatch('updateYearMonth', this.yearMonth);
                this.$router.push({ name: 'RosterStep7' });
            } else {
                this.showError = true;
            }
        }
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
    margin-top: 10px;
    margin-bottom: 70px;
    border: 2px solid #CAB387;
    border-radius: 0px;
    border-width: 0 0 2px 0;
}
#formStep1 select:focus{
    -moz-box-shadow: none !important;
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
    border: 2px solid #C09247;
    border-radius: 5px;
    outline-width: 0
}
#formStep1 .is-invalid {
    border-color: #dc3545 !important;
}
#formStep1 .invalid-feedback{
    color: #dc3545;
    margin-top: -70px;
    margin-bottom: 50px;
    font-size: 12px;
}

.additional-action-button {
    width: 100px;
    background: #616161;
    font-weight: bold;
    color: white;
    border: 0 none;
    border-radius: 0px;
    cursor: pointer;
    padding: 10px 5px;
    margin: 10px 5px 10px 5px;
    float: left; /* 왼쪽으로 위치시키기 */
    border-radius: 5px;
}

.additional-action-button:hover {
    background-color: #000000
}
</style>
