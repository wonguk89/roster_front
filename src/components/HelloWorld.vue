<template>
    <div>
        <!-- Main component content -->

        <!-- Render RosterStep component with current step number -->
        <roster-step
            :stepNumber="currentStep"
            :totalSteps="totalSteps"
            @updateStep="updateStep"
        ></roster-step>
    </div>
</template>

<script>
import RosterStep from '../view/RosterStep.vue';

export default {
    data() {
        return {
            currentStep: 1,
            totalSteps: 6,
        };
    },
    components: {
        RosterStep,
    },
    methods: {
        updateStep(newStep) {
            this.currentStep = newStep;
        },
    },
};
</script>

<style>
/* Add necessary styles */
</style>
