<template>
    <v-container class="py-6">
        <p class="text-h4 mb-4">{{ usename }} 您好</p>
        <p class="mb-4">歡迎登入中華電機學會後台</p>
        <p class="mb-6">目前時間是 {{ showCurrentTime }}</p>
    </v-container>
    <LoadingComponent :loading="loading"/>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import userHelper from '@/utils/helpers/user.js';
import dayjs from 'dayjs';
import LoadingComponent from '@/components/LoadingComponent.vue';

const router = useRouter();
const route = useRoute();

// const id = userHelper.getUserProfile();
// 使用者名稱
const usename = computed(() => {
    return userHelper.getUsername();
});

// 目前時間
const currentTime = ref(new Date());
const showCurrentTime = ref(dayjs(currentTime.value).format('YYYY 年 MM 月 DD 日 HH 時 mm 分'));
const calculateTime = () => {
    showCurrentTime.value = dayjs(new Date()).format('YYYY 年 MM 月 DD 日 HH 時 mm 分');
}
setInterval(() => calculateTime(), 60000);

onUnmounted(() => {
    clearInterval(calculateTime);
});


const loading = ref(false);


const modifyTime = (dateStr) => {
    return dayjs(dateStr).format('YYYY-MM-DD HH:mm:ss');
}

</script>
