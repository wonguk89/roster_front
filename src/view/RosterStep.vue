<template>
    <div class="container-fluid">
        <div class="row justify-content-center">
            <div :class="currentStep !== 5 ? 'col-11 col-sm-10 col-md-10 col-lg-1 col-xl-5 text-center p-0 mt-3 mb-2' : 'col-11 col-sm-10 col-md-10 col-lg-1 col-xl-11 text-center p-0 mt-3 mb-2'">
                <div class="card px-0 pt-4 pb-0 mt-3 mb-3">
                    <form id="msform">
                        <!-- progressbar -->
                        <ul id="progressbar">
                            <li v-for="(step, index) in steps" :key="step.id" :class="{ active: index <= currentStep }" :id="step.id">
                                <strong>{{ step.label }}</strong>
                            </li>
                        </ul>
                        <div class="progress">
                            <div
                                class="progress-bar progress-bar-striped progress-bar-animated"
                                role="progressbar"
                                :style="{ width: progressWidth }"
                            ></div>
                        </div>
                        <br>
                        <!-- fieldsets -->
                        <fieldset>
                            <!-- 상위 컴포넌트 템플릿 부분 -->
                            <component :is="stepComponents[currentStep]" @moveToNextStep="moveToNextStep" :ref="steps[currentStep].id"></component>
                            <input type="button" @click="nextStep" class="next action-button" :value="currentStep < steps.length - 2 ? '다음' : currentStep < steps.length - 1 ? '생성' : '저장'" />
                            <input type="button" v-if="currentStep > 0" @click="previousStep" class="previous action-button-previous" value="이전" />
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import RosterStep1 from './RosterStep1.vue';
import RosterStep2 from './RosterStep2.vue';
import RosterStep3 from './RosterStep3.vue';
import RosterStep4 from './RosterStep4.vue';
import RosterStep5 from './RosterStep5.vue';
import RosterStep6 from './RosterStep6.vue';

export default {
    data() {
        return {
            currentStep: 0,
            steps: [
                { id: "step1", label: "Step 1" },
                { id: "step2", label: "Step 2" },
                { id: "step3", label: "Step 3" },
                { id: "step4", label: "Step 4" },
                { id: "step5", label: "Step 5" },
                { id: "step6", label: "Step 6" },
            ],
            stepComponents: [
                RosterStep1,
                RosterStep2,
                RosterStep3,
                RosterStep4,
                RosterStep5,
                RosterStep6,
            ]
        };
    },
    computed: {
        progressWidth() {
            return `${(100 / this.steps.length) * (this.currentStep + 1)}%`;
        },
    },
    methods: {
        nextStep() {
                this.$refs[this.steps[this.currentStep].id].moveToNextStep();
        },
        moveToNextStep(){
            if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;            } else {
                console.log('Form submitted or completed');
            }
        },
        previousStep() {
            if (this.currentStep > 0) {
                this.currentStep--;
            }
        }
    }
};
</script>

<style>
* {
    margin: 0;
    padding: 0;
    font-family: FontAwesome;
}

html {
    height: 100%
}

p {
    color: grey
}

#heading {
    text-transform: uppercase;
    color: #CAB387;
    font-weight: normal
}

#msform {
    text-align: center;
    position: relative;
    margin-top: 20px
}

#msform fieldset {
    background: white;
    border: 0 none;
    border-radius: 0.5rem;
    box-sizing: border-box;
    width: 100%;
    margin: 0;
    padding-bottom: 20px;
    position: relative
}

.form-card {
    text-align: left
}

#msform fieldset:not(:first-of-type) {
    display: none
}

#msform input:focus,
#msform textarea:focus {
    -moz-box-shadow: none !important;
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
    border: 2px solid #C09247;
    border-radius: 5px;
    outline-width: 0
}

#msform .action-button {
    width: 100px;
    background: #CAB387!Important;
    font-weight: bold;
    color: white;
    border: 0 none;
    border-radius: 0px;
    cursor: pointer;
    padding: 10px 5px;
    margin: 10px 5px 10px 5px;
    float: right;
    border-radius: 5px;
}

#msform .action-button:hover{
    background-color: #C09247!Important;
}

#msform .action-button-previous {
    width: 100px;
    background: #616161;
    font-weight: bold;
    color: white;
    border: 0 none;
    border-radius: 0px;
    cursor: pointer;
    padding: 10px 5px;
    margin: 10px 5px 10px 0px;
    float: right;
    border-radius: 5px;
}

#msform .action-button-previous:hover{
    background-color: #000000
}
.card {
    z-index: 0;
    border: none;
    position: relative
}

#progressbar {
    margin-bottom: 30px;
    overflow: hidden;
    color: lightgrey
}

#progressbar .active {
    color: #CAB387
}

#progressbar li {
    list-style-type: none;
    font-size: 15px;
    width: 16.666666%; /* 100% / 6 */
    float: left;
    position: relative;
    font-weight: 400;
    text-align: center; /* 가운데 정렬을 위해 추가 */
}

#progressbar li:before {
    width: 50px;
    height: 50px;
    line-height: 45px;
    display: block;
    font-size: 20px;
    color: #ffffff;
    background: lightgray;
    border-radius: 50%;
    margin: 0 auto 10px auto;
    padding: 2px;
    content: '\f00c'; /* Font Awesome의 체크 아이콘 코드 */
    font-family: FontAwesome;
}

#progressbar li:after {
    content: '';
    width: 100%;
    height: 2px;
    background: lightgray;
    position: absolute;
    left: 0;
    top: 25px;
    z-index: -1
}

#progressbar li.active:before,
#progressbar li.active:after {
    background: #CAB387
}

.progress {
    height: 20px
}

.progress-bar {
    background-color: #CAB387 !Important;
}

</style>