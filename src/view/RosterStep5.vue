<template>
    <div>
        <h2>Roster Step 5</h2>
        <p>Content for Roster Step 5</p>
    </div>
</template>

<script>
export default {
    methods: {
        moveToNextStep() {
            this.$emit('moveToNextStep');
        },
    },
};
</script>

<style>
/* 필요한 스타일 추가 */
</style>
