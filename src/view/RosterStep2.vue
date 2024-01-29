<template>
    <div>
        <h1>Roster Step 2</h1>

        <!-- Employee List Rendering -->
        <table>
            <thead>
            <tr>
                <th>선택</th>
                <th>이름</th>
                <th>직책</th>
                <th>휴무갯수</th>
                <th>수정</th>
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
                    <button v-if="employeeList[index].isModified" @click="saveEmployee(index)">저장</button>
                </td>
            </tr>
            </tbody>
        </table>

        <!-- Add Employee Button -->
        <button @click="addEmptyEmployeeRow">직원 추가</button>

        <!-- Remove Selected Employees Button -->
        <button @click="removeSelectedEmployees">선택 직원 삭제</button>

        <button @click="moveToNextStep">다음</button>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            employeeList: [], // 직원 목록
        };
    },
    mounted() {
        // 컴포넌트가 마운트될 때 직원 목록을 가져옵니다.
        this.fetchEmployeeList();
    },
    methods: {
        // 수정 여부를 표시합니다.
        setModified(index) {
            this.employeeList[index].isModified = true;
        },

        // 다음 단계로 이동합니다.
        moveToNextStep() {
            // 수정된 직원이 있는지 확인합니다.
            const modifiedEmployees = this.employeeList.filter(employee => employee.isModified);

            if (modifiedEmployees.length > 0) {
                // 아직 저장되지 않은 수정 사항이 있으면 에러 메시지를 표시하고 다음 단계로 이동을 막습니다.
                alert('수정된 내용을 저장해주세요.');
                return;
            }

            // 수정 사항이 없으면 다음 단계로 이동합니다.
            this.$router.push({ name: 'RosterStep3' });
        },
        async fetchEmployeeList() {
            try {
                // 직원 목록을 가져오기 위한 API 호출
                const response = await axios.get('http://localhost:8080/api/employees/getAll');
                this.employeeList = response.data.map(employee => ({
                    ...employee,
                    isModified: false, // 직원 데이터가 수정되었는지 여부를 추적하는 플래그
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
        async saveEmployee(index) {
            try {
                const updatedEmployee = this.employeeList[index];
                await axios.post('http://localhost:8080/api/employees/addOrUpdate', [updatedEmployee]);
                console.log('직원이 성공적으로 업데이트되었습니다:', updatedEmployee);

                // 수정된 플래그를 초기화합니다.
                this.employeeList[index].isModified = false;

                // 저장 후 업데이트된 직원 목록을 가져옵니다.
                await this.fetchEmployeeList();
            } catch (error) {
                console.error('직원을 업데이트하는 중 오류 발생:', error.message);
            }
        },

        async removeSelectedEmployees() {
            try {
                // 선택된 직원을 필터링하고 직원 목록을 업데이트합니다.
                const selectedEmployees = this.employeeList.filter(employee => employee.selected);
                console.log('선택된 직원들:', selectedEmployees);
                await axios.delete('http://localhost:8080/api/employees/delete', { data: selectedEmployees });
                console.log('선택된 직원들이 성공적으로 삭제되었습니다:', selectedEmployees);

                // 삭제 후 업데이트된 직원 목록을 가져옵니다.
                await this.fetchEmployeeList();
            } catch (error) {
                console.error('선택된 직원들을 삭제하는 중 오류 발생:', error.message);
            }
        }
    },
};
</script>

<style>
/* Add necessary styles */
</style>
