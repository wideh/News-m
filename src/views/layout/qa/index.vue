<template>
  <div class="qa">
    <canvas id="canvas" width="360" height="270" ref="canvas"></canvas>
  </div>
</template>

<script>
export default {
  name: 'qa',
  data () {
    return {
      cxt: null
    }
  },
  mounted () {
    const canvas = this.$refs.canvas
    this.cxt = canvas.getContext('2d')
    setInterval(() => {
      this.renderClock()
    }, 1000)
  },
  methods: {
    renderClock () {
      this.cxt.clearRect(0, 0, 360, 270) // 清除
      this.cxt.save()
      // 画圆心，坐标原点移到中央,方便控制时针旋转，逆时针旋转45度
      this.cxt.translate(180, 135)
      this.cxt.rotate(-2 * Math.PI / 4)
      this.cxt.save()
      // 绘制表盘
      this.cxt.beginPath()
      this.cxt.arc(0, 0, 125, 0, 2 * Math.PI) // 画圆，圆属于路径
      this.cxt.fillStyle = 'gray'
      this.cxt.strokeStyle = 'rgb(255, 255 ,255)'
      this.cxt.lineWidth = 4
      this.cxt.fill()
      this.cxt.stroke()
      this.cxt.closePath()
      // 绘制时钟刻度
      for (var i = 0; i < 12; i++) {
        this.cxt.rotate(Math.PI / 6)
        this.cxt.beginPath()
        this.cxt.moveTo(110, 0)
        this.cxt.lineTo(120, 0)
        if ((i + 1) % 3 === 0) {
          this.cxt.strokeStyle = 'orangered'
        } else {
          this.cxt.strokeStyle = 'rgb(255, 255 ,255)'
        }
        this.cxt.lineWidth = 3
        this.cxt.stroke()
        this.cxt.closePath()
      }
      this.cxt.restore() // 恢复到坐标在圆心，然后坐标没旋转
      this.cxt.save()
      for (var j = 0; j < 60; j++) {
        this.cxt.rotate(Math.PI / 30)
        this.cxt.beginPath()
        this.cxt.moveTo(113, 0)
        this.cxt.lineTo(119, 0)
        if ((j + 1) % 15 === 0) {
          this.cxt.strokeStyle = 'orangered'
        } else {
          this.cxt.strokeStyle = 'rgb(255, 255 ,255)'
        }
        this.cxt.lineWidth = 3
        this.cxt.stroke()
        this.cxt.closePath()
      }
      this.cxt.restore() // 恢复到坐标在圆心
      this.cxt.save()
      // 获取时间
      var time = new Date()
      var hour = time.getHours()
      var min = time.getMinutes()
      var sec = time.getSeconds()
      // 如果时间大于12，直接减去12
      hour = hour > 12 ? hour - 12 : hour
      // 绘制秒针
      this.cxt.beginPath()
      // 根据秒针时间进行旋转
      this.cxt.rotate(2 * Math.PI / 60 * sec)
      this.cxt.moveTo(-12, 0)
      this.cxt.lineTo(108, 0)
      this.cxt.strokeStyle = 'red'
      this.cxt.lineWidth = 1
      this.cxt.stroke()
      this.cxt.closePath()
      // 绘制分针
      this.cxt.restore() // 恢复到坐标在圆心
      this.cxt.save()
      this.cxt.beginPath()
      this.cxt.rotate(2 * Math.PI / 60 * min + 2 * Math.PI / 3600 * sec)
      this.cxt.moveTo(-8, 0)
      this.cxt.lineTo(90, 0)
      this.cxt.strokeStyle = 'darkblue'
      this.cxt.lineWidth = 3
      this.cxt.stroke()
      this.cxt.closePath()
      this.cxt.restore() // 恢复到坐标在圆心
      this.cxt.save()
      // 绘制时针
      this.cxt.beginPath()
      this.cxt.rotate(2 * Math.PI / 12 * hour + 2 * Math.PI / 60 / 12 * min + 2 * Math.PI / 60 / 60 / 12 * sec)
      this.cxt.moveTo(-5, 0)
      this.cxt.lineTo(80, 0)
      this.cxt.strokeStyle = 'orange'
      this.cxt.lineWidth = 5
      this.cxt.stroke()
      this.cxt.closePath()
      this.cxt.beginPath()
      this.cxt.arc(0, 0, 3, 0, 2 * Math.PI)
      this.cxt.fillStyle = 'black'
      this.cxt.fill()
      this.cxt.closePath()
      this.cxt.restore() // 恢复到坐标在圆心
      this.cxt.restore() // 恢复到原始状态
    }
  }
}
</script>
<style lang="less" scoped>
.qa{
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 50px);
  background-color:#fff;
  canvas{
    transform: scale(1);
  }
}
</style>
