<template>
  <div class="canvas-battle">
    <div>
      <button @click="start">démarrer</button>
      <button @click="init">réinitialiser</button>
      <button @click="next(0, false)">suivant</button>
      <button @click="random">random</button>
    </div>
    <div class="canvas-container">
      <canvas ref="canvas" :width="size" :height="size"></canvas>
    </div>
    <div class="log-container">
      <pre v-for="(unity, k) in unities" :key="k">{{ unity }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import { Action, Getter } from 'vuex-class'
import { Component, Vue } from 'vue-property-decorator'
import Unity from '@/models/Unity'

@Component
export default class CanvasBattle extends Vue {
  @Action
  public setContext!: any
  @Action
  public addUnity!: any
  @Action
  public resetUnities!: any
  @Getter
  public context!: CanvasRenderingContext2D | null
  @Getter
  public unities!: Unity[]
  public canvas: HTMLCanvasElement | null = null
  public size: number = 400

  public mounted(): void {
    this.init()
  }

  public init(): void {
    this.resetUnities()
    this.canvas = this.$refs.canvas as HTMLCanvasElement
    this.setContext(this.canvas.getContext('2d'))
    const centerX = this.canvas.width / 2
    const centerY = this.canvas.height / 2

    const ally = new Unity(
      'France',
      { x: centerX - 50, y: centerY + 100 },
      '#0550af'
    )
    const enemy = new Unity(
      'Austria',
      { x: centerX + 100, y: centerY - 100 },
      '#af0550'
    )
    ally.setTarget(enemy)

    this.addUnity([enemy, ally])
  }

  public start(): void {
    requestAnimationFrame(this.next)
  }

  public next(time: number, request: boolean = true): void {
    if (!this.context || !this.canvas) {
      return
    }
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.unities.forEach((s: Unity) => s.draw())
    if (request) {
      requestAnimationFrame(this.next)
    }
  }

  public random(): void {
    if (this.unities && this.unities.length) {
      this.unities[0].position.x = Math.random() * this.size
      this.unities[0].position.y = Math.random() * this.size
    }
  }
}
</script>

<style scoped>
.canvas-battle {
  display: flex;
}
.canvas-container,
.log-container {
  width: 100%;
}
.log-container {
  display: flex;
}
</style>
