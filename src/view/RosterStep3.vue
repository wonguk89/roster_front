<template>
    <div>
        <!-- Skill List Rendering -->
        <form id="formStep3">
            <div class="table-container">
            <table style="width: 100%;">
                <thead>
                <tr>
                    <th style="width: 20%; padding-bottom: 20px">이름</th>
                    <th v-for="skill in skillList" :key="skill.skillID" style="width: 20%; padding-bottom: 20px">
                        {{ skill.skill }}
                    </th>
                    <th style="width: 20%; padding-bottom: 20px">수정</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(employee, employeeIndex) in employeeList" :key="employee.employeeID">
                    <td>{{ employee.name }}</td>
                    <td v-for="skill in skillList" :key="skill.skillID">
                        <input
                            type="checkbox"
                            :checked="employeeSkills[employeeIndex].includes(skill.skillID)"
                            @change="handleCheckboxChange(employeeIndex, skill.skillID)"
                        />
                    </td>
                    <td>
                        <img
                            v-if="isEmployeeModified(employeeIndex)"
                            class="modified-image"
                            src="../assets/brownCheck2.jpg"
                            alt="Modified Image"
                        />
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
            <!-- Save All Modified Employees Button -->
            <input
                v-if="hasAnyModifications"
                type="button"
                @click="saveAllModifiedEmployees"
                class="next select-button"
                value="저장" />
            <div v-if="showSaveError" class="error-message">
                {{ saveErrorMessage }}
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            employeeList: [],
            skillList: [],
            employeeSkills: [],
            modifiedSkills: [],
            showSaveError: false,
        };
    },
    mounted() {
        this.fetchEmployeeList();
    },

    computed: {
        saveErrorMessage() {
            return '저장되지 않은 변경 사항이 있습니다. 먼저 변경 사항을 저장하세요.';
        },
        hasAnyModifications() {
            return this.calculateModifications();
        },
    },
    methods: {
        calculateModifications() {
            const hasModifiedSkills = this.modifiedSkills.some((modifiedSkill) => modifiedSkill.length > 0);
            const hasModifiedEmployees = this.employeeList.some((employee, index) => this.isEmployeeModified(index));

            if (hasModifiedSkills || hasModifiedEmployees) {
                return true;
            } else {
                this.showSaveError = false;
                return false;
            }
        },
        moveToNextStep() {
            const hasModifiedEmployees = this.hasAnyModifications;

            if (hasModifiedEmployees) {
                this.showSaveError = true;
                return;
            }

            this.$emit('moveToNextStep');
        },
        async fetchEmployeeList() {
            try {
                const response = await axios.get('http://localhost:8080/api/employees/getAll');
                this.employeeList = response.data;
                this.employeeSkills = new Array(this.employeeList.length).fill([]);
                this.modifiedSkills = new Array(this.employeeList.length).fill([]);
                await this.fetchSkillList();
            } catch (error) {
                console.error('Error fetching employee list:', error.message);
            }
        },
        async fetchSkillList() {
            try {
                const response = await axios.get('http://localhost:8080/api/skills/getAll');
                this.skillList = response.data;
                await this.fetchEmployeeSkills();
            } catch (error) {
                console.error('Error fetching skill list:', error.message);
            }
        },
        async fetchEmployeeSkills() {
            try {
                const response = await axios.get('http://localhost:8080/api/employeeSkill/getAll');

                this.employeeSkills = Array.from({ length: this.employeeList.length }, () => []);
                this.modifiedSkills = Array.from({ length: this.employeeList.length }, () => []);

                response.data.forEach((employeeSkill) => {
                    const employeeIndex = this.employeeList.findIndex(
                        (employee) => employee.employeeID === employeeSkill.employeeID
                    );

                    this.employeeSkills[employeeIndex].push(employeeSkill.skillID);
                });
            } catch (error) {
                console.error('Error fetching employee skills:', error.message);
            }
        },
        handleCheckboxChange(employeeIndex, skillID) {
            if (!this.modifiedSkills[employeeIndex].includes(skillID)) {
                this.modifiedSkills[employeeIndex].push(skillID);
            } else {
                const index = this.modifiedSkills[employeeIndex].indexOf(skillID);
                if (index !== -1) {
                    this.modifiedSkills[employeeIndex].splice(index, 1);
                }
            }
        },
        isEmployeeModified(employeeIndex) {
            return this.modifiedSkills[employeeIndex].length > 0;
        },
        async saveAllModifiedEmployees() {
            const allModifiedSkills = [];

            for (let index = 0; index < this.modifiedSkills.length; index++) {
                const modifiedSkill = this.modifiedSkills[index];

                // Check if the employee has modified skills
                if (modifiedSkill.length > 0) {
                    const employeeID = this.employeeList[index].employeeID;
                    const modifiedSkillsForEmployee = modifiedSkill.map((skillID) => ({ employeeID, skillID }));

                    allModifiedSkills.push(...modifiedSkillsForEmployee);
                }
            }

            console.log(allModifiedSkills);

            try {
                // Save or delete modified skills
                await axios.post('http://localhost:8080/api/employeeSkill/saveOrDelete', allModifiedSkills);
                console.log('수정된 스킬에 대한 정보를 저장하였습니다.');
                this.modifiedSkills = new Array(this.employeeList.length).fill([]);
                await this.fetchEmployeeList();
            } catch (error) {
                console.error('스킬 정보 저장 중 오류 발생:', error.message);
            }
        },
    },
};
</script>

<style>
#formStep3 .select-button {
    width: 85px;
    background: #CAB387!Important;
    font-weight: bold;
    color: white;
    border: 0 none;
    border-radius: 0px;
    cursor: pointer;
    padding: 7px 5px;
    margin: 10px 0px 10px 5px;
    border-radius: 5px;
}
#formStep3 .select-button:hover {
    background-color: #C09247!Important;
}

#formStep3 .modified-image {
    max-width: 20px;
    max-height: 20px;
    margin: 0px 0px 5px 0px;
}

#formStep3 .error-message {
    color: red;
    margin-top: 5px;
    font-size: 12px;
}
#formStep3 input[type="checkbox"] {
    accent-color: #CAB387;
}
#formStep3 input[type="checkbox"]:hover {
    accent-color: #C09247;
}

#formStep3 input,
#formStep3 textarea {
    padding: 8px 15px 8px 15px;
    margin-bottom: 15px;
    margin-top: 15px;
    width: 90%;
    box-sizing: border-box;
    font-family: montserrat;
    color: #2C3E50;
    letter-spacing: 1px;
}
#formStep3 table{
    font-size: 15px;
    font-family: montserrat;
}

#formStep3 .table-container {
    max-height: 300px; /* 원하는 높이로 설정 (px 또는 다른 단위로) */
    overflow-y: auto; /* 세로 스크롤이 필요한 경우만 표시 */
}
#formStep3 .table-container::-webkit-scrollbar {
    width: 5px;
}
#formStep3 .table-container::-webkit-scrollbar-thumb {
    background: linear-gradient(transparent, #C09247);
    border-radius: 10px;
}
#formStep3 .table-container::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(transparent, #00c6ff, transparent);
}
</style>
