<template>
  <el-container>
    지난 회의 이력 페이지
  </el-container>
</template>

<script>
import { onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'History',
  setup () {
    const store = useStore()

    // 페이지 진입시 불리는 훅
    onMounted (() => {
      store.commit('root/setMenuActiveMenuName', 'history')
    })
  }
}
</script>
