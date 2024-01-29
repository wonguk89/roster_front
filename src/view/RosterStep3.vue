<template>
    <div>
        <h1>Roster Step 3</h1>
        <p>Content for Roster Step 3</p>
        <button @click="moveToNextStep">Next</button>
    </div>
</template>

<script>
export default {
    methods: {
        moveToNextStep() {
            this.$router.push({ name: 'RosterStep4' });
        },
    },
};
</script>

<style>
/* 필요한 스타일 추가 */
</style>
