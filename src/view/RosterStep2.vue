<template>
    <div>
        <!-- Employee List Rendering -->
        <form id="formStep2">
            <table>
                <thead>
                <tr>
                    <th style="width: 20%; padding-bottom: 20px">선택</th>
                    <th style="width: 20%; padding-bottom: 20px">이름</th>
                    <th style="width: 25%; padding-bottom: 20px">직책</th>
                    <th style="width: 15%; padding-bottom: 20px">휴무갯수</th>
                    <th style="width: 20%; padding-bottom: 20px">수정</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(employee, index) in employeeList" :key="employee.employeeID">
                    <td>
                        <input type="checkbox" v-model="employeeList[index].selected" />
                    </td>
                    <td>
                        <input v-model="employeeList[index].name" type="text" @input="setModified(index)" />
                    </td>
                    <td>
                        <input v-model="employeeList[index].position" type="text" @input="setModified(index)" />
                    </td>
                    <td>
                        <input v-model="employeeList[index].holidayCnt" type="number" @input="setModified(index)" />
                    </td>
                    <td>
                        <img v-if="employeeList[index].isModified" class="modified-image" src="../assets/checkIcon.jpg" alt="Modified Image" />
                    </td>
                </tr>
                </tbody>
            </table>

            <!-- Add Employee Button -->
            <input type="button" @click="addEmptyEmployeeRow" class="next select-button" value="직원추가" />
            <!-- Remove Selected Employees Button -->
            <input type="button" @click="removeSelectedEmployees" class="previous select-button-previous" value="선택삭제" />
            <!-- Save All Modified Employees Button -->
            <input v-if="hasModifiedEmployees" type="button" @click="saveAllModifiedEmployees" class="next select-button" value="저장" />


            <!-- 수정 메시지 표시 -->
            <div v-if="showSaveError" class="error-message">
                {{ saveErrorMessage }}
            </div>

            <br />
        </form>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    data() {
        return {
            employeeList: [], // 직원 목록
            showSaveError: false,
        };
    },
    computed: {
        saveErrorMessage() {
            return '저장되지 않은 변경 사항이 있습니다. 먼저 변경 사항을 저장하세요.';
        },
        hasModifiedEmployees() {
            return this.employeeList.some(employee => employee.isModified);
        },
    },
    mounted() {
        // 컴포넌트가 마운트될 때 직원 목록을 가져옵니다.
        this.fetchEmployeeList();
    },
    methods: {
        // 수정 여부를 표시합니다.
        setModified(index) {
            const currentEmployee = this.employeeList[index];
            currentEmployee.isModified = (
                currentEmployee.name !== currentEmployee.originalName ||
                currentEmployee.position !== currentEmployee.originalPosition ||
                currentEmployee.holidayCnt !== currentEmployee.originalHolidayCnt
            );
        },

        // 다음 단계로 이동합니다.
        moveToNextStep() {
            // 수정된 직원이 있는지 확인합니다.
            const modifiedEmployees = this.employeeList.filter(employee => employee.isModified);

            if (modifiedEmployees.length > 0) {
                // 아직 저장되지 않은 수정 사항이 있으면 에러 메시지를 표시하고 다음 단계로 이동을 막습니다.
                this.showSaveError = true;
                return;
            }
            this.$emit('moveToNextStep');
        },
        async fetchEmployeeList() {
            try {
                // 직원 목록을 가져오기 위한 API 호출
                const response = await axios.get('http://localhost:8080/api/employees/getAll');
                this.employeeList = response.data.map(employee => ({
                    ...employee,
                    isModified: false, // 직원 데이터가 수정되었는지 여부를 추적하는 플래그
                    originalName: employee.name, // 원래 이름 저장
                    originalPosition: employee.position, // 원래 직책 저장
                    originalHolidayCnt: employee.holidayCnt, // 원래 휴무 갯수 저장
                }));
            } catch (error) {
                console.error('직원 목록을 가져오는 중 오류 발생:', error.message);
            }
        },

        // 빈 직원 행을 추가합니다.
        addEmptyEmployeeRow() {
            this.employeeList.push({
                name: '',
                position: '',
                holidayCnt: 0,
                isModified: true, // 새로운 행이므로 플래그를 true로 설정합니다.
            });
        },

        async removeSelectedEmployees() {
            try {
                // 선택된 직원을 필터링하고 직원 목록을 업데이트합니다.
                const selectedEmployees = this.employeeList.filter(employee => employee.selected);
                await axios.delete('http://localhost:8080/api/employees/delete', { data: selectedEmployees });
                console.log('선택된 직원들이 성공적으로 삭제되었습니다:', selectedEmployees);

                // 삭제 후 업데이트된 직원 목록을 가져옵니다.
                await this.fetchEmployeeList();
            } catch (error) {
                console.error('선택된 직원들을 삭제하는 중 오류 발생:', error.message);
            }
        },

        // 모든 수정된 직원을 저장합니다.
        async saveAllModifiedEmployees() {
            try {
                // 수정된 직원만 필터링합니다.
                const modifiedEmployees = this.employeeList.filter(employee => employee.isModified);

                // API를 통해 모든 수정된 직원을 한 번에 업데이트합니다.
                await axios.post('http://localhost:8080/api/employees/addOrUpdate', modifiedEmployees);
                console.log('모든 수정된 직원이 성공적으로 업데이트되었습니다:', modifiedEmployees);

                // 모든 수정된 플래그를 초기화합니다.
                this.employeeList.forEach(employee => (employee.isModified = false));
                this.showSaveError = false;
                await this.fetchEmployeeList();
            } catch (error) {
                console.error('직원을 업데이트하는 중 오류 발생:', error.message);
            }
        },
    },
};
</script>


<style>
#formStep2 .select-button {
    width: 85px;
    background: #673AB7!Important;
    font-weight: bold;
    color: white;
    border: 0 none;
    border-radius: 0px;
    cursor: pointer;
    padding: 7px 5px;
    margin: 10px 0px 10px 5px;
    border-radius: 5px;
}
#formStep2 .select-button:hover {
    background-color: #311B92!Important;
}
#formStep2 .select-button-previous {
    width: 85px;
    background: #616161;
    font-weight: bold;
    color: white;
    border: 0 none;
    border-radius: 0px;
    cursor: pointer;
    padding: 7px 5px;
    margin: 10px 0px 10px 5px;
    border-radius: 5px;
}
#formStep2 .select-button-previous:hover {
    background-color: #000000;
}
.error-message {
    color: red;
    margin-top: 5px;
    font-size: 12px;
}
#formStep2 .modified-image {
    max-width: 20px; /* 최대 가로 크기 설정 */
    max-height: 20px; /* 최대 세로 크기 설정 */
    margin: 0px 0px 5px 0px;
    cursor: pointer;
}

#formStep2 input,
#formStep2 textarea {
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
#formStep2 input::-webkit-inner-spin-button {
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
}
</style>
