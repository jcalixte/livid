<template>
  <div class="canvas-battle">
    <div>
      <button @click="start">démarrer</button>
      <button @click="init">réinitialiser</button>
      <button @click="next(0, false)">suivant</button>
    </div>
    <div>
      <canvas ref="canvas" :width="size" :height="size"></canvas>
    </div>
    <pre v-for="(shape, k) in shapes" :key="k">{{ shape }}</pre>
  </div>
</template>

<script lang="ts">
import { Action, Getter } from 'vuex-class'
import { Component, Vue } from 'vue-property-decorator'
import Shape from '@/engine/Shape'

@Component
export default class CanvasBattle extends Vue {
  @Action
  public setContext!: any
  @Action
  public addShape!: any
  @Action
  public resetShapes!: any
  @Getter
  public context!: CanvasRenderingContext2D | null
  @Getter
  public shapes!: Shape[]
  public canvas: HTMLCanvasElement | null = null
  public size: number = 400

  public mounted(): void {
    this.init()
  }

  public init(): void {
    this.resetShapes()
    this.canvas = this.$refs.canvas as HTMLCanvasElement
    this.setContext(this.canvas.getContext('2d'))
    const centerX = this.canvas.width / 2
    const centerY = this.canvas.height / 2

    const shape = new Shape(
      { x: centerX - 50, y: centerY + 100 },
      { width: 10, height: 100, color: '#0550af' }
    )
    const enemy = new Shape(
      { x: centerX + 100, y: centerY - 100 },
      { width: 10, height: 100, color: '#af0550' }
    )
    shape.setTarget(enemy)

    this.addShape([enemy, shape])
  }

  public start(): void {
    requestAnimationFrame(this.next)
  }

  public next(time: number, request: boolean = true): void {
    if (!this.context || !this.canvas) {
      return
    }
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.shapes.forEach((s: Shape) => s.draw())
    if (request) {
      requestAnimationFrame(this.next)
    }
  }
}
</script>

<style scoped>
.canvas-battle {
  display: flex;
}
</style>
