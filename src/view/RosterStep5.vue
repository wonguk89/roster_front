<template>
    <div>
        <form id="formStep5"  @submit.prevent="handleSubmit">
            <div style="width: 100%; margin-top: 30px; margin-bottom: 30px; display: flex;" class="grid-container">
                <!-- 그리드 1: 이름 선택 -->
                <div style="width: 25%;" class="grid-item">
                    <select class="form-select" v-model="selectedEmployee" :class="{ 'is-invalid': showError && !selectedEmployee }">
                        <option value="" disabled selected>이름</option>
                        <option v-for="employee in employeeList" :key="employee.employeeID" :value="employee.employeeID">
                            {{ employee.name }}
                        </option>
                    </select>
                    <div v-if="showError && !selectedEmployee" class="invalid-feedback" style="font-size: 12px;">직원을 선택해주세요.</div>
                </div>

                <!-- 그리드 2: 휴무일 선택 -->
                <div style="width: 25%;" class="grid-item">
                    <input
                        type="date"
                        v-model="selectedLeaveDate"
                        required
                        :class="{ 'is-invalid': showError && !selectedLeaveDate }"
                    />
                    <div v-if="showError && !selectedLeaveDate" class="invalid-feedback" style="font-size: 12px;">휴무일을 선택해주세요.</div>
                </div>

                <!-- 그리드 3: 사유 입력 -->
                <div style="width: 30%;" class="grid-item">
                    <input
                        type="text"
                        v-model="selectedReason"
                        placeholder="사유 입력"
                        :class="{ 'is-invalid': showError && !selectedReason }"
                    />
                    <div v-if="showError && !selectedReason" class="invalid-feedback" style="font-size: 12px;">사유를 입력해주세요.</div>
                </div>

                <!-- 그리드 4: 추가 버튼 -->
                <div style="width: 20%;" class="grid-item">
                    <button @click="addHoliday" class="action-button">추가</button>
                </div>
            </div>

        <!-- 휴가 신청 목록 테이블 -->
            <div class="table-container">
                <table style="width: 100%;">
                    <thead>
                    <tr>
                        <th>이름</th>
                        <th>휴무일</th>
                        <th>이유</th>
                        <th>삭제</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(leaveRequest, index) in leaveRequests" :key="index">
                        <td>{{ findEmployeeNameById(leaveRequest.employeeID) }}</td>
                        <td>{{ leaveRequest.leaveDate }}</td>
                        <td>{{ leaveRequest.reason }}</td>
                        <td @click="confirmDelete(index)">
                            <img
                            src="../assets/brownDel.jpg"
                            class="del-icon"
                            alt="Delete Icon"
                        /></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </form>
    </div>
</template>


<script>
import axios from 'axios';

export default {
    data() {
        return {
            employeeList: [], // 직원 목록
            leaveRequests: [], // LeaveRequest 목록
            selectedEmployee: '',
            selectedLeaveDate: '',
            selectedReason: '',
        };
    },

    computed: {
        formattedHolidays() {
            // holidays를 가공하여 반환
            return this.holidays.map(holiday => ({
                leaveDate: holiday.leaveDate,
                employeeName: this.findEmployeeNameById(holiday.employeeID),
            }));
        },
        yearMonth() {
            return this.$store.getters.getYearMonth;
        },
    },

    methods: {
        moveToNextStep() {
            this.$emit('moveToNextStep');
        },
        confirmDelete(index) {
            const leaveRequest = this.leaveRequests[index];
            const confirmMessage = `직원 ${this.findEmployeeNameById(leaveRequest.employeeID)}의 휴무일 ${
                leaveRequest.leaveDate
            }을(를) 삭제하시겠습니까?`;

            if (confirm(confirmMessage)) {
                // 사용자가 확인을 눌렀을 때 서버로 삭제 요청
                this.deleteLeaveRequest(index);
            }
        },
        async deleteLeaveRequest(index) {
            try {
                const leaveRequest = this.leaveRequests[index];
                const response = await axios.delete('http://localhost:8080/api/leaveRequests/delete', {
                    data: [leaveRequest], // 서버에서 @RequestBody로 받기 위해 data 속성 사용
                });

                // 서버 응답 확인
                console.log('서버 응답:', response.data);

                this.fetchDataForEmployees()

                // 추가 후 필요한 처리 (예: 리스트 갱신 등)
                console.log('휴무일 삭제 성공');
            } catch (error) {
                console.error('휴무일 삭제 중 오류 발생:', error.message);
            }
        },
        async addHoliday() {
            if (this.selectedEmployee && this.selectedLeaveDate && this.selectedReason) {
                try {
                    // API로 데이터 전송
                    const response = await axios.post('http://localhost:8080/api/leaveRequests/checkAndAdd', {
                        employeeID: this.selectedEmployee,
                        leaveDate: this.selectedLeaveDate,
                        reason: this.selectedReason,
                    });

                    if (response.data.startsWith('저장되었습니다')) {
                        // 성공적으로 추가된 경우의 처리
                        alert(response.data);
                        this.selectedEmployee = null;
                        this.selectedLeaveDate = null;
                        this.selectedReason = null;
                        this.fetchDataForEmployees();
                    } else {
                        // 중복된 경우의 처리
                        alert(response.data);
                    }

                } catch (error) {
                    console.error('스케줄 추가 중 오류 발생:', error.message);
                }
            } else {
                alert("실패");
            }
        },
        async fetchDataForEmployees() {
            try {
                // 직원 목록을 API에서 가져와서 employeeList에 설정
                const response = await axios.get('http://localhost:8080/api/employees/getAll');
                this.employeeList = response.data;
                this.fetchDataForLeaveRequests();
            } catch (error) {
                console.error('직원 목록 조회 중 오류 발생:', error.message);
            }
        },

        async fetchDataForLeaveRequests() {
            try {
                // LeaveRequest 목록을 API에서 가져와서 leaveRequests에 설정
                const response = await axios.get(`http://localhost:8080/api/leaveRequests/getByMonth?date=${this.yearMonth}`);
                this.leaveRequests = response.data;
            } catch (error) {
                console.error('휴가 신청 목록 조회 중 오류 발생:', error.message);
            }
        },
        findEmployeeNameById(employeeID) {
            // 주어진 직원 ID에 해당하는 직원의 이름 찾기
            const employee = this.employeeList.find(e => e.employeeID === employeeID);
            return employee ? employee.name : '';
        },
    },

    created() {
        // 컴포넌트가 생성될 때 직원 목록과 휴가 신청 목록 데이터 가져오기
        this.fetchDataForEmployees();

    },
};
</script>


<style>
#formStep5 input,
#formStep5 textarea {
    padding: 8px 15px 8px 15px;
    border: 2px solid #CAB387;
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
#formStep5 .form-select{
    padding: 8px 15px 8px 15px;
    border: 2px solid #CAB387;
    border-radius: 0px;
    border-width: 0 0 2px 0;
    margin-bottom: 5px;
    width: 130px;
    box-sizing: border-box;
    font-family: montserrat;
    color: #2C3E50;
    font-size: 15px;
    letter-spacing: 1px;
    text-align: center;
}
#formStep5 .form-select:focus {
    -moz-box-shadow: none !important;
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
    border: 2px solid #C09247;
    border-radius: 5px;
    outline-width: 0
}

#formStep5 input:focus,
#formStep5 textarea:focus {
    -moz-box-shadow: none !important;
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
    border: 2px solid #C09247;
    border-radius: 5px;
    outline-width: 0
}

#formStep5 .action-button {
    width: 50px!important;
    background: #CAB387!Important;
    font-weight: bold;
    color: white;
    border: 0 none;
    border-radius: 0px;
    cursor: pointer;
    padding: 5px 5px!important;
    float: none!important;
    margin: 10px auto !important;
    display: block!important;
    border-radius: 5px;
}

#formStep5 .action-button:hover{
    background-color: #C09247!Important;
}
#formStep5 input[type="date"] {
    position: relative;
}

#formStep5 input[type="date"]::-webkit-calendar-picker-indicator{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    color: transparent;
    cursor: pointer;

}
#formStep5 input[type="date"]::before{
    content: attr(data-placeholder);
    width: 100%;
}
#formStep5 input[type="date"]:valid::before{
    display: none;
}
#formStep5 input[type="data-placeholder"]::before{
    font-size: 10px;
}

#formStep5 .grid-container {
    display: flex;
}

#formStep5 .grid-item {
    margin-left: 20px;
    margin-right: 15px;
}
#formStep5 .table-container {
    max-height: 250px; /* 원하는 높이로 설정 (px 또는 다른 단위로) */
    overflow-y: auto; /* 세로 스크롤이 필요한 경우만 표시 */
}
#formStep5 .table-container::-webkit-scrollbar {
    width: 5px;
}
#formStep5 .table-container::-webkit-scrollbar-thumb {
    background: linear-gradient(transparent, #C09247);
    border-radius: 10px;
}
#formStep5 .table-container::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(transparent, #00c6ff, transparent);
}

#formStep5 table {
    border-collapse: collapse;
    width: 100%;
    margin-top: 20px; /* 원하는 간격으로 조절 */
}

#formStep5 th, #formStep5 td {
    padding: 8px;
    text-align: center;
}

#formStep5 .del-icon {
    max-width: 20px;
    max-height: 20px;
    cursor: pointer;
}
</style>
