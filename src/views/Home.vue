<template>
  <div class="home">
    <canvas-battle/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    'canvas-battle': () => import('@/components/CanvasBattle.vue')
  }
})
export default class Home extends Vue {}
</script>
