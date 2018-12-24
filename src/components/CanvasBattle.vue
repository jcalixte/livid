<template>
  <div class="canvas-battle">
    <canvas ref="canvas" :width="size" :height="size"></canvas>
  </div>
</template>

<script lang="ts">
import { Action, Getter } from 'vuex-class'
import { Component, Prop, Vue } from 'vue-property-decorator'
import Shape from '@/engine/Shape'

@Component
export default class CanvasBattle extends Vue {
  @Action
  public setContext!: any
  @Action
  public addShape!: any
  @Getter
  public context!: CanvasRenderingContext2D | null
  @Getter
  public shapes!: Shape[]
  public canvas: HTMLCanvasElement | null = null
  public size: number = 800

  public mounted(): void {
    this.canvas = this.$refs.canvas as HTMLCanvasElement
    this.setContext(this.canvas.getContext('2d'))
    const centerX = this.canvas.width / 2
    const centerY = this.canvas.height / 2

    const shape = new Shape(
      { x: centerX, y: centerY },
      { width: 20, height: 80 }
    )
    const enemy = new Shape(
      { x: centerX + 100, y: centerY + 100 },
      { width: 20, height: 80, color: '#af0580' }
    )
    shape.setTarget(enemy.position)

    this.addShape([shape, enemy])

    const after: FrameRequestCallback = (time: number) => {
      if (!this.context || !this.canvas) {
        return
      }
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.shapes.forEach((s: Shape) => s.draw())
      requestAnimationFrame(after)
    }
    requestAnimationFrame(after)
  }
}
</script>

