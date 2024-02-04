<template>
    <div>
        <h2>{{ yearMonth }} Calendar</h2>
        <div class="calendar-grid">
            <div class="weekday" v-for="(day, index) in weekdays" :key="index">
                {{ day }}
            </div>
            <div v-for="(day, index) in dates" :key="index" class="calendar-day">
                {{ day !== null ? getSequentialName(index) : '' }}
            </div>
        </div>
        <button @click.prevent="generateRandomSchedule" style="margin-top: 10px;" class="action-button">재시도</button>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            dates: this.generateDates(),
            schedule: [],
            skills: [],
            employees: [],
            generateRandomScheduleCount: 0,
            globalSchedule: [],
            holidays : [],
        };
    },
    methods: {
        getSequentialName(index) {
            // 이름 배열의 인덱스에 따라 순서대로 이름 반환
            if (this.globalSchedule.length === 0) {
                return '';
            }
            return this.globalSchedule[index % this.globalSchedule.length];
        },
        generateDates() {
            if (!this.yearMonth) return []; // 값이 없을 때는 빈 배열 반환

            const [year, month] = this.yearMonth.split('-').map(Number);
            // 나머지 코드는 그대로 유지
            const firstDay = new Date(year, month - 1, 1).getDay();
            const daysInMonth = this.getDaysInMonth(year, month);
            const dates = Array.from({length: daysInMonth + firstDay}, (_, i) =>
                i < firstDay ? null : i - firstDay + 1
            );

            return dates;
        },
        getDaysInMonth(year, month) {
            return new Date(year, month, 0).getDate();
        },
        moveToNextStep() {
            this.$emit('moveToNextStep');
        },
        async generateRandomSchedule() {
            try {
                // Make Axios request to generate schedule
                const response = await axios.get('http://localhost:8080/api/random/generate', {
                    params: {
                        selectedMonth: this.yearMonth,
                    },
                });
                this.eventData = response.data;
            } catch (error) {
                console.error('Error generating schedule:', error.response.data);
            }
        },
        async reGenerateRandomSchedule() {
            try {
                // Make Axios request to generate schedule
                const response = await axios.get('http://localhost:8080/api/random/generate', {
                    params: {
                        selectedMonth: this.yearMonth,
                    },
                });
                this.schedule = response.data;
                console.log(response.data);
                // Fetch and replace skills
                await this.fetchAndReplaceSkills();

                // Fetch and replace employees
                await this.fetchAndReplaceEmployees();

                await this.fetchHolidaysByMonth();

                this.handleScheduleResponse();
            } catch (error) {
                //console.error('Error generating schedule:', error.response.data);
                if (this.generateRandomScheduleCount < 10) {
                    // Retry
                    this.generateRandomScheduleCount++;
                    console.log(this.generateRandomScheduleCount + '만큼시도 하는중 꿍찠');
                    await this.reGenerateRandomSchedule();
                } else {
                    // Handle failure after retry limit
                    alert(this.generateRandomScheduleCount + '만큼시도했는데 안되네 데헷 뒤로 돌아갓');
                    this.generateRandomScheduleCount = 0;
                }
            }
        },
        async fetchAndReplaceSkills() {
            try {
                // Make Axios request to get all skills
                const skillsResponse = await axios.get('http://localhost:8080/api/skills/getAll');
                this.skills = skillsResponse.data;

                // Replace skillID with skill names in the schedule
                this.replaceSkillNames();
            } catch (error) {
                console.error('Error fetching skills:', error);
                // Handle error as needed
            }
        },
        async fetchAndReplaceEmployees() {
            try {
                // Make Axios request to get all employees
                const employeesResponse = await axios.get('http://localhost:8080/api/employees/getAll');
                this.employees = employeesResponse.data;

                // Replace employeeID with employee names in the schedule
                this.replaceEmployeeNames();
            } catch (error) {
                console.error('Error fetching employees:', error);
                // Handle error as needed
            }
        },
        async fetchHolidaysByMonth() {
            try {
                // Make Axios request to get holidays for the month
                const response = await axios.get(`http://localhost:8080/api/holiday/getByMonth?date=${this.yearMonth}`);
                console.log(response.data);
                this.holidays = response.data;
            } catch (error) {
                console.error('Error fetching holidays:', error);
            }
        },
        replaceSkillNames() {
            this.shchedulData.forEach((entry) => {
                const skill = this.skillData.find((sk) => sk.skillID === entry.skillID);
                if (skill) {
                    entry.skill = skill.skill;
                }
            });
        },
        replaceEmployeeNames() {
            this.schedule.forEach((entry) => {
                const employee = this.employees.find((emp) => emp.employeeID === entry.employeeID);
                if (employee) {
                    entry.employeeName = employee.name;
                }
            });
        },
        getSkillName(skillID) {
            const skill = this.skills.find((sk) => sk.skillID === skillID);
            return skill ? skill.skill : 'Unknown Skill';
        },
        getEmployeeName(employeeID) {
            const employee = this.employees.find((emp) => emp.employeeID === employeeID);
            return employee ? employee.name : 'Unknown Employee';
        },
        handleScheduleResponse() {
            const nullCount = this.dates.filter(date => date === null).length;
            this.globalSchedule = new Array(nullCount).fill([]); // 널의 개수만큼 빈 배열 추가

            // 나머지 데이터를 추가
            for (const entry of this.schedule) {
                const date = entry.date;
                const globalEntry = {
                    employeeName: this.getEmployeeName(entry.employeeID),
                    skillName: this.getSkillName(entry.skillID),
                };

                // globalSchedule에 해당 날짜의 일정이 이미 있는지 확인
                const existingDateIndex = this.globalSchedule.findIndex(item => item.date === date);

                if (existingDateIndex !== -1) {
                    // 이미 해당 날짜의 일정이 있으면 해당 날짜의 일정에 추가
                    this.globalSchedule[existingDateIndex].entries.push(globalEntry);
                } else {
                    // 해당 날짜의 일정이 없으면 새로운 객체 생성
                    const newDateEntry = {
                        date,
                        entries: [globalEntry],
                    };
                    // 날짜에 맞게 배열에 추가
                    const insertIndex = this.findIndexToInsert(date, this.globalSchedule);
                    this.globalSchedule.splice(insertIndex, 0, newDateEntry);
                }
            }
            console.log("이거다!!!!!!!!!!!!!!!!!!!!!!"+this.globalSchedule);
        },
        findIndexToInsert(date, array) {
            const formattedDate = new Date(date);
            for (let i = 0; i < array.length; i++) {
                const currentDate = new Date(array[i].date);
                if (formattedDate < currentDate) {
                    return i;
                }
            }
            return array.length;
        },
    },
    computed: {
        yearMonth() {
            // Vuex 스토어에서 yearMonth 값 가져오기
            return this.$store.getters.getYearMonth;
        },
        groupedSchedule() {
            const grouped = {};
            this.schedule.forEach((entry) => {
                if (!grouped[entry.date]) {
                    grouped[entry.date] = [];
                }
                grouped[entry.date].push(entry);
            });
            console.log("grouped"+grouped)
            return grouped;
        },
    },
    mounted() {
        // Automatically generate schedule when the component is mounted
        this.generateRandomSchedule();
    },
};
</script>


<style>
.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 10px;
}

.calendar-day {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
}

.weekday {
    font-weight: bold;
    text-align: center;
}

#formStep6 .action-button {
    width: 50px!important;
    background: #673AB7!Important;
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

#formStep6 .action-button:hover{
    background-color: #311B92!Important;
}
</style>
