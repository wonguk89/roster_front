<template>
    <div class="table-container">
    <div class="calendar-container">
        <h6>{{ yearMonth.split('-')[0] }}</h6><h4>{{ parseInt(yearMonth.split('-')[1]) }}</h4>
        <div class="calendar">
            <div class="weekdays">
                <span class="sun">Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span class="sat">Sat</span>
            </div>
            <div class="days">
                <div v-for="day in days" :key="day" class="day">
                    <div class="day-number">{{ day }}</div>
                    <div v-for="data in getDataForDay(day)" :key="data.sno" class="event">
                        <div class="input-container">
                            <input v-model="data.name" class="input-box" placeholder="Employee ID" readonly>
                            <input v-model="data.skill" :class="{ 'open': data.skill === 'open', 'middle': data.skill === 'middle', 'close': data.skill === 'close' }" placeholder="Skill ID"  readonly>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>


<script>
import axios from 'axios';
import router from "@/router";
export default {
    data() {
        return {
            days: [],
            eventData: [],
            shchedulData:[],
            shchedulDataForSave:[],
            skillData:[],
            nameData:[],
        };
    },
    mounted() {
        this.generateRandomSchedule();
    },
    computed: {
        yearMonth() {
            return this.$store.getters.getYearMonth;
        },
    },
    methods: {
        async generateRandomSchedule() {
            try {
                const response = await axios.get('http://localhost:8080/api/random/generate', {
                    params: {
                        selectedMonth: this.yearMonth,
                    },
                });
                this.shchedulDataForSave = response.data;
                this.shchedulData = response.data;
                await this.fetchAndReplaceSkills();

            } catch (error) {
                console.error('Error generating schedule:', error.response.data);
            }
        },
        async fetchAndReplaceSkills() {
            try {
                const skillsResponse = await axios.get('http://localhost:8080/api/skills/getAll');
                this.skillData = skillsResponse.data;
                this.replaceSkillNames();

                await this.fetchAndReplaceEmployees();

            } catch (error) {
                console.error('Error fetching skills:', error);
            }
        },
        async fetchAndReplaceEmployees() {
            try {
                const employeesResponse = await axios.get('http://localhost:8080/api/employees/getAll');
                this.nameData = employeesResponse.data;

                this.replaceEmployeeNames();
                this.eventData = this.shchedulData;
                this.generateCalendar();

            } catch (error) {
                console.error('Error fetching employees:', error);
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
            this.shchedulData.forEach((entry) => {
                const employee = this.nameData.find((emp) => emp.employeeID === entry.employeeID);
                if (employee) {
                    entry.name = employee.name;
                }
            });
        },
        generateCalendar() {
            const currentDate = new Date(this.yearMonth);
            const firstDayOfMonth = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                1
            );
            const lastDayOfMonth = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                0
            );

            for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
                this.days.push(i);
            }

            const firstDayOfWeek = firstDayOfMonth.getDay();
            for (let i = 0; i < firstDayOfWeek; i++) {
                this.days.unshift('');
            }
        },
        getDataForDay(day) {
            const formattedDate = `${this.yearMonth}-${day.toString().padStart(2, '0')}`;
            return this.eventData.filter(data => data.date === formattedDate);
        },
        async moveToNextStep() {
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/calendarSchedule/getByMonth?date=${this.yearMonth}`
                );

                if (response.data.length > 0) {
                    // 데이터가 있을 때 컨펌 창을 띄워 유저에게 물어봄
                    const confirmResponse = confirm('이미 저장된 스케쥴이 있습니다. 변경하시겠습니까?');

                    if (confirmResponse) {
                        // Yes를 선택한 경우 데이터 삭제 후 새로운 데이터 생성
                        await axios.delete(
                            `http://localhost:8080/api/calendarSchedule/delete?date=${this.yearMonth}`
                        );

                        await axios.post('http://localhost:8080/api/calendarSchedule/create', this.shchedulDataForSave);
                        console.log('스케쥴 정보를 저장하였습니다.');
                        router.go(0);
                    }
                } else {
                    // 데이터가 없을 때 새로운 데이터 생성
                    await axios.post('http://localhost:8080/api/calendarSchedule/create', this.shchedulDataForSave);
                    console.log('스케쥴 정보를 저장하였습니다.');
                    router.go(0);
                }
            } catch (error) {
                console.error('스케쥴 정보 저장 중 오류 발생:', error.message);
            }
        },
    },
};
</script>

<style scoped>

.calendar-container {
    position: relative;
}

.calendar {
    position: relative;
    max-width: 1030px;
}
.weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-bottom: 0;
    font-weight: bold;
    border-bottom: 2px solid #000;
}
.weekdays .sat{
    color: #311B92;
}

.weekdays .sun{
    color: #dc3545;
}

.days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
}

.day-number {
    margin-bottom: 5px; /* 조절 가능 */
    text-align: left!important;
}
.day {
    border: 1px solid #ccc;
}

.input-container {
    display: inline-block;
    height: 7px;
}
.input-box{
    width: 45%;
    margin-right: 3px;
    margin-left: 2px;
    border-radius: 0px;
    border-width: 0 0 0 0;
    margin-bottom: 5px;
    box-sizing: border-box;
    font-family: montserrat;
    color: grey;
    font-size: 10px;
    letter-spacing: 1px;
    text-align: center;
}
.input-container input:focus{
    -moz-box-shadow: none !important;
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
    border: 2px solid #C09247!important;
    border-radius: 5px;
    outline-width: 0
}


.open {
    width: 45%;
    margin-right: 3px;
    margin-left: 2px;
    border: 2px solid #C09247 ;
    border-radius: 0px;
    border-width: 0 0 3px 0;
    margin-bottom: 5px;
    box-sizing: border-box;
    font-family: montserrat;
    color: grey;
    font-size: 10px;
    letter-spacing: 1px;
    text-align: center;
}

.middle {
    width: 45%;
    margin-right: 3px;
    margin-left: 2px;
    border: 2px solid #CAB387 ;
    border-radius: 0px;
    border-width: 0 0 3px 0;
    margin-bottom: 5px;
    box-sizing: border-box;
    font-family: montserrat;
    color: grey;
    font-size: 10px;
    letter-spacing: 1px;
    text-align: center;
}

.close {
    width: 45%;
    margin-right: 3px;
    margin-left: 2px;
    border: 2px solid #F2EBE0;
    border-radius: 0px;
    border-width: 0 0 3px 0;
    margin-bottom: 5px;
    box-sizing: border-box;
    font-family: montserrat;
    color: grey;
    font-size: 10px;
    letter-spacing: 1px;
    text-align: center;
}
.calendar-container h4{
    font-weight: bold;
}
.event{
    margin-bottom: 1px;
}

.table-container {
    max-height: 360px; /* 원하는 높이로 설정 (px 또는 다른 단위로) */
    overflow-y: auto; /* 세로 스크롤이 필요한 경우만 표시 */
}
.table-container::-webkit-scrollbar {
    width: 5px;
}
.table-container::-webkit-scrollbar-thumb {
    background: linear-gradient(transparent, #C09247);
    border-radius: 10px;
}
.table-container::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(transparent, #00c6ff, transparent);
}
</style>

