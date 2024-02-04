<template>
    <div>
        <form id="formStep4">
            <table
                v-if="formattedDates"
                style="width: 100%; margin-top: 30px; margin-bottom: 30px;"
            >
                <thead>
                <tr>
                    <th style="width: 30%">선택 날짜</th>
                    <th style="width: 40%">설명</th>
                    <th style="width: 20%">삭제</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(date, index) in formattedDates" :key="index">
                    <td>{{ date.date }}</td>
                    <td>
                        <input
                            type="text"
                            v-model="formattedDates[index].description"
                            placeholder="설명을 입력하세요"
                            @input="handleInput(index)"
                        />
                    </td>
                    <td @click="removeDate(index)">
                        <img
                            src="../assets/purpleDel2.png"
                            class="del-icon"
                            alt="Delete Icon"
                        />
                    </td>
                </tr>
                </tbody>
            </table>

                <p>{{formattedYearMonth}} 휴무일을 추가해주세요</p>
            <label>

                <!-- Vue Datepicker -->
                <VueDatePicker
                    v-model="date"
                    :highlight="highlightedDates"
                    :disabled-dates="highlightedDates"
                    disable-month-year-select
                    highlight-disabled-days
                    :format="format"
                    placeholder="      날짜를 선택해주세요"
                    auto-apply
                    multi-dates
                    @update:model-value="handleDate"
                    no-today
                    :clearable="false"
                ></VueDatePicker>

            </label>
            <input
                v-if="descriptionModified"
                type="button"
                @click="saveAllModifiedHoliday"
                class="next select-button"
                value="저장"
            />
            <div v-if="showSaveError" class="error-message">
                {{ saveErrorMessage }}
            </div>
        </form>
    </div>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import axios from 'axios';
import { ref } from 'vue';

const date = ref();
export default {
    components: { VueDatePicker },

    data() {
        return {
            selectedDates: [], // 선택된 날짜 배열
            selectedDates2: [],
            selectedDates3: [],
            originDates: [],
            highlightedDates: [], // 하이라이트된 날짜 배열
            descriptionInput: '', // 설명을 입력받는 변수 추가
            format: 'yyyy-MM-dd', // 날짜 형식
            descriptionModified: false,
            showSaveError: false,
            saveErrorMessage: '',
            delList: [],
            date : null,
            dateForUse : null,
        };
    },
    methods: {
        handleDate(modelData) {
            date.value = modelData;
            // modelData가 존재하고, 현재 선택된 날짜와 modelData의 마지막 날짜가 같지 않다면 선택하기
            if (modelData && modelData.length > 0) {
                const lastDate = modelData[modelData.length - 1];
                // 사용자가 선택한 날짜가 초기 날짜와 다르며, 아직 선택되지 않은 경우에만 추가
                if (new Date(lastDate).getTime() !== new Date(this.date[0]).getTime()) {
                    // 시용자가 다른날짜를 추가하다가 초기날짜를 선택했을경우
                    if (new Date(modelData[modelData.length - 1]).getTime() === new Date(this.selectedDates2[this.selectedDates2.length - 1]).getTime()) {
                        this.selectedDates2.push(this.dateForUse[0]);
                        this.date[0] = [this.dateForUse[0]];
                    } else {
                    this.selectedDates2.push(lastDate);
                    }
                }
            } else {
                // modelData가 비어있을 때 초기 날짜를 선택된 값으로 설정
                this.date = [this.dateForUse[0]];
                this.selectedDates2.push(this.date[0]);
            }
        },
        formatYearMonth(rawYearMonth) {
            // 날짜 객체로 변환
            const dateObj = new Date(rawYearMonth);

            // 월에 +1을 해주어야 정확한 월이 나옴 (0부터 시작)
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
            const year = dateObj.getFullYear().toString();

            this.formattedYearMonth = year + '년' + month + '월';
        },
        moveToNextStep() {
            // descriptionModified가 true이면 빨간 에러 문구를 보여주고 리턴
            if (this.descriptionModified) {
                this.showSaveError = true;
                this.saveErrorMessage = '저장되지 않은 변경 사항이 있습니다. 먼저 변경 사항을 저장하세요.';
                return;
            }

            // descriptionModified가 false이면 다음 단계로 이동
            this.$emit('moveToNextStep');
        },
        removeDate(index) {
            // 해당 인덱스의 날짜가 selectedDates에 있는지 여부를 확인
            const dateFromFormattedDates = this.formattedDates[index]?.originalDate;
            const isOriginalDate = this.selectedDates.some(date => date.holidayDate === dateFromFormattedDates);

            // 선택된 날짜 배열에서 해당 인덱스의 날짜 제거
            // selectedDates 배열에서 holidayDate가 dateFromFormattedDates와 일치하는 항목 제거
            this.selectedDates = this.selectedDates.filter(date => date.holidayDate !== dateFromFormattedDates);

            // selectedDates2 배열에서 dateFromFormattedDates와 같은 날짜를 찾아서 제거
            this.selectedDates2 = this.selectedDates2.filter(date => {
                const formattedDate = this.formatDate(date);
                return formattedDate !== dateFromFormattedDates;
            });
            this.formattedDates = this.formattedDates.filter(date => date.holidayDate !== dateFromFormattedDates);

            // highlightedDates에서도 해당 날짜 제거
            this.highlightedDates = this.highlightedDates.filter(date => date !== dateFromFormattedDates);
            console.log("this.highlightedDates : " + this.highlightedDates)
            // 해당 행의 값이 selectedDates 배열에 있는지 여부에 따라 버튼 상태 갱신
            if (isOriginalDate) {
                this.descriptionModified = true;
            } else {
                this.descriptionModified = false;
            }
        },
        async fetchDataForSelectedDates() {
            try {
                // API 호출 시, 서버에서 받아온 데이터를 selectedDates에 설정
                const response = await axios.get(
                    `http://localhost:8080/api/holiday/getByMonth?date=${this.yearMonth}`
                );
                this.selectedDates = response.data;
                // 만약 response.data가 배열이라면
                if (Array.isArray(response.data)) {
                    // 각 요소에 대해 saveHighlightedDates 호출
                    response.data.forEach(item => {
                        this.saveHighlightedDates(item.holidayDate);
                    });
                } else {
                    // response.data가 배열이 아닌 경우에는 단일 객체로 가정하고 그냥 호출
                    this.saveHighlightedDates(response.data.holidayDate);
                }
            } catch (error) {
                console.error('휴무일 조회 중 오류 발생:', error.message);
            }
        },
        async saveAllModifiedHoliday() {
            try {
                // 삭제할 휴가가 있는지 확인
                // 비교해서 selectedDates에는 있지만 selectedDates3에는 없는 holidayID를 담을 배열
                const holidayIDsToAdd = this.originDates
                    .filter(date => !this.selectedDates3.some(selectedDate => selectedDate.holidayID === date.holidayID))
                    .map(date => date.holidayID);
                console.log("this.holidayIDsToAdd : " + holidayIDsToAdd);

                const deleteResponse = await axios.delete(`http://localhost:8080/api/holiday/delete?holidayID=${holidayIDsToAdd}`);
                console.log('삭제된 휴무일:', deleteResponse.data);


                // API를 통해 모든 수정된 휴무일을 한 번에 업데이트합니다.
                const updateResponse = await axios.post('http://localhost:8080/api/holiday/addOrUpdate', this.selectedDates3);
                console.log('수정된 휴무일이 성공적으로 업데이트되었습니다:', updateResponse.data);

                // 데이터 갱신 전에 배열 초기화
                this.selectedDates = [];
                this.selectedDates2 = [];
                this.selectedDates3 = [];

                this.showSaveError = false;
                this.descriptionModified = false;

                // 새로운 데이터 가져오기
                await this.fetchDataForSelectedDates();
            } catch (error) {
                console.error('휴무일을 업데이트하는 중 오류 발생:', error.message);
            }
        },
        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        saveDate(formattedFromDB, formattedFromCalendar) {
            // this.selectedDates3에 새로운 배열을 할당
            this.selectedDates3 = [...formattedFromDB, ...formattedFromCalendar].map(item => ({
                holidayID: item.holidayID || 0,
                holidayDate: item.date || '',
                description: item.description || '',
            }));
            console.log(this.selectedDates3);
        },

        saveHighlightedDates(date) {
            // 중복 체크
            if (!this.highlightedDates.includes(date)) {
                // 중복이 없으면 추가
                this.highlightedDates.push(date);
            }
        },
        async handleInput(index) {
            if (index >= 0 && index < this.formattedDates.length) {
                const currentDescription = this.formattedDates[index]?.description;
                const originalDescription = this.selectedDates[index]?.description;

                if (currentDescription === originalDescription) {
                    this.descriptionModified = false;
                } else {
                    this.descriptionModified = true;
                    // 사용자가 입력한 description을 selectedDates3에 반영
                    this.selectedDates3[index].description = currentDescription;
                }
            }
        },
    },

    computed: {
        yearMonth() {
            // Vuex 스토어에서 yearMonth 값 가져오기
            return this.$store.getters.getYearMonth;
        },
        formattedYearMonth() {
            // Format year and month based on this.yearMonth
            const dateObj = new Date(this.yearMonth);
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
            const year = dateObj.getFullYear().toString();

            return year + '년 ' + month + '월';
        },
        formattedDates() {
            // selectedDates를 가공하여 반환
            const formattedFromDB = this.selectedDates ? this.selectedDates.map(date => {
                // date.holidayDate가 "2024-01-19" 형식이라면 다른 형식으로 변환
                return {
                    holidayID : date.holidayID,
                    date: date.holidayDate,
                    description: date.description,
                    originalDate: date.holidayDate, // 초기 날짜 값 저장
                };
            }) : [];

            // selectedDates2를 가공하여 반환
            const formattedFromCalendar = this.selectedDates2 ? this.selectedDates2.map(date => {
                // 초기값이 처리되지 않았고, 초기값과 현재 날짜가 같은 경우
                this.descriptionModified = true;
                this.saveHighlightedDates(this.formatDate(date));
                return {
                    holidayID: 0,
                    date: this.formatDate(date),
                    description: '',  // 선택된 날짜는 초기 설명이 없다고 가정
                    originalDate: this.formatDate(date), // 초기 날짜 값 저장
                };
            }).filter(date => date !== null) : [];

                this.saveDate(formattedFromDB, formattedFromCalendar);

                    return [...formattedFromDB, ...formattedFromCalendar];
        },
    },
    created() {
        // 여기서 초기 날짜를 설정할 수 있습니다.
        this.date = [new Date(this.yearMonth+"-01")];
        this.dateForUse = [new Date(this.yearMonth+"-01")];

    },
    mounted() {
        // 컴포넌트가 마운트된 후에 API 호출하여 데이터 가져오기
        this.fetchDataForSelectedDates();
    },
};
</script>

<style>
#formStep4 .del-icon {
    max-width: 20px;
    max-height: 20px;
    cursor: pointer;
}
#formStep4 .select-button {
    width: 85px;
    background: #673AB7 !important;
    font-weight: bold;
    color: white;
    border: 0 none;
    border-radius: 0px;
    cursor: pointer;
    padding: 7px 5px;
    margin: 10px 0px 10px 5px;
    border-radius: 5px;
}
#formStep4 .select-button:hover {
    background-color: #311B92 !important;
}

#formStep4 td input,
#formStep4 textarea {
    padding: 8px 15px 8px 15px;
    border: 2px solid #673AB7;
    border-radius: 0px;
    border-width: 0 0 2px 0;
    margin-bottom: 5px;
    width: 90%;
    box-sizing: border-box;
    font-family: montserrat;
    color: #2C3E50;
    font-size: 15px;
    letter-spacing: 1px;
    text-align: center;
}

#formStep4 .error-message {
    color: red;
    margin-top: 5px;
    font-size: 12px;
}
</style>
