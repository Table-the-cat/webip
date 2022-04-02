<template>
  <div id="img-process">
    <el-row>
      <el-col :span="3">
        <div class="menu-title">
          <h3>操作选项</h3>
        </div>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          style="height: 830px"
          @open="handleOpen"
          @close="handleClose">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-s-operation"></i>
              <span>调整</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">
                <el-popover
                  placement="right"
                  title="拖拽"
                  width="200"
                  trigger="hover"
                  content="按住鼠标左键并移动，可以拖拽图片">
                  <el-button slot="reference">拖拽</el-button>
                </el-popover>
              </el-menu-item>
              <el-menu-item index="1-2">
                <el-popover
                  placement="right"
                  title="缩放"
                  width="200"
                  trigger="hover"
                  content="按住alt键并滚动鼠标滚轮，可以缩放图片">
                  <el-button slot="reference">缩放</el-button>
                </el-popover>
              </el-menu-item>
              <el-menu-item index="1-2">
                <el-popover
                  placement="right"
                  title="缩放"
                  width="200"
                  trigger="hover"
                  content="按住alt键的同时按住鼠标左键，同时移动鼠标，可以旋转图片">
                  <el-button slot="reference">旋转</el-button>
                </el-popover>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-camera"></i>
              <span>滤镜效果</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="2-1" v-on:click="back">
                <el-button v-on:click="back">还原</el-button>
              </el-menu-item>
              <el-menu-item index="2-2">
                <el-button v-on:click="turnGrey">灰度</el-button>
              </el-menu-item>
              <el-menu-item index="2-3">
                <el-button v-on:click="turnMonochrome">黑白</el-button>
              </el-menu-item>
              <el-menu-item index="2-4">
                <el-button v-on:click="turnRGBReverse">负片</el-button>
              </el-menu-item>
              <el-menu-item index="2-5">
                <el-button v-on:click="turnConvolution">卷积</el-button>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-edit"></i>
              <span>标注</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="3-1">
                <el-button @click="filterObject('line')">直线</el-button>
              </el-menu-item>
              <el-menu-item index="3-2">
                <el-button v-on:click="filterObject('rect')">矩形</el-button>
              </el-menu-item>
              <el-menu-item index="3-3">
                <el-button v-on:click="filterObject('arrows')">箭头</el-button>
              </el-menu-item>
              <el-menu-item index="3-4">
                <el-button v-on:click="filterObject('circle')">圆形</el-button>
              </el-menu-item>
              <el-menu-item index="3-5">
                <el-button v-on:click="filterObject('text')">文字框</el-button>
              </el-menu-item>
              <el-menu-item index="3-6">
                <el-button v-on:click="filterObject()">取消选择</el-button>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col>

      <el-col :span="21" id="img-proc">
        <h3><i class="el-icon-picture-outline" style="font-size: larger"></i><span>  滤镜算法处理效果图</span></h3>
        <div class="canvas-box">
          <canvas width="1487" height="800" id="myCanvas"></canvas>
          <canvas width="1487" height="800" id="drawingBorad"></canvas>
        </div>
      </el-col>
    </el-row>

    <textarea
      id="textarea"
      name="textBox"
      cols="9"
      rows="1"
      class="text-style"
      v-show="isShowText"
    ></textarea>

  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'ImgProcess',
  data () {
    return {
      isShowDrawPane: false,
      canvas: null,
      context: null,
      // 线宽
      lwidth: 2,
      // 画笔颜色
      lcolor: 'orange',
      // 维护绘画状态的数组
      paintTypeArr: {
        line: false,
        arrows: false,
        rect: false,
        circle: false,
        text: false
      },
      // 最近一次的canvas图片的数据
      imageData: null,
      // 是否显示文字编写框
      isShowText: false,
      // 保存画布图片历史的数据
      historyImageData: [],
      // 保存已被撤销的历史画布图片数据
      newHistoryImageData: [],
      socket: null
    }
  },
  methods: {
    back: function () {
      ctx.setTransform(1, 0, 0, 1, 0, 0) // 重置canvas坐标(重置变换矩阵)
      ctx.clearRect(0, 0, cvs.width, cvs.height)
      ctx.drawImage(img, 0, 0, processImg.initWidth, processImg.initHeight)

      // 重置各参数
      processImg.position.x = 0
      processImg.position.y = 0
      processImg.width = processImg.initWidth
      processImg.height = processImg.initHeight
      processImg.imgSrc = img
      PO.x = 0
      PO.y = 0
      ctx.translate(processImg.width / 2, processImg.height / 2)
    },
    turnGrey: function () {
      ctx.clearRect(-cvs.width, -cvs.height, cvs.width, cvs.height)
      curImage(grey)
      ctx.drawImage(processImg.imgSrc, -processImg.width / 2, -processImg.height / 2, processImg.width, processImg.height)
    },
    turnMonochrome: function () {
      ctx.clearRect(-cvs.width, -cvs.height, cvs.width, cvs.height)
      curImage(monochrome)
      ctx.drawImage(processImg.imgSrc, -processImg.width / 2, -processImg.height / 2, processImg.width, processImg.height)
    },
    turnRGBReverse: function () {
      ctx.clearRect(-cvs.width, -cvs.height, cvs.width, cvs.height)
      curImage(RGBReverse)
      ctx.drawImage(processImg.imgSrc, -processImg.width / 2, -processImg.height / 2, processImg.width, processImg.height)
    },
    turnConvolution: function () {
      ctx.clearRect(-cvs.width, -cvs.height, cvs.width, cvs.height)
      curImage(convolution)
      ctx.drawImage(processImg.imgSrc, -processImg.width / 2, -processImg.height / 2, processImg.width, processImg.height)
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },

    //初始化画布
    init() {
      this.canvas = document.getElementById("drawingBorad")
      this.context = this.canvas.getContext("2d")
      this.imageData && this.context.putImageData(this.imageData, 0, 0)
      console.log(this.canvas)
    },
    //监听鼠标,用于画笔任意绘制和橡皮擦
    listen() {
      let self = this
      let lastPoint = { x: undefined, y: undefined }
      let rect = self.canvas.getBoundingClientRect()
      let scaleX = self.canvas.width / rect.width
      let scaleY = self.canvas.height / rect.height
      let textPoint = { x: undefined, y: undefined }


      // 只有判断在绘制模式时才进行如下监听
      self.canvas.onmousedown = function (e) {
        console.log(self.inDrawMode())

        if (self.inDrawMode()) {
          let x1 = e.clientX
          let y1 = e.clientY
          x1 -= rect.left
          y1 -= rect.top
          lastPoint = { x: x1 * scaleX, y: y1 * scaleY }

          if (self.paintTypeArr["text"]) {
            let textarea = document.getElementById("textarea")
            if (self.isShowText) {
              let textContent = textarea.value
              self.isShowText = false
              textarea.value = ""
              self.drawText(textPoint.x, textPoint.y, textContent)
            } else if (!self.isShowText) {
              self.isShowText = true

              textarea.style.left = lastPoint.x + "px"
              textarea.style.top = lastPoint.y + "px"
              textPoint = { x: lastPoint.x, y: lastPoint.y }
              // textarea.style['z-index'] = 6
            }
          }

          if (self.paintTypeArr["erase"]) {
            let ctx = self.context
            ctx.save()
            ctx.globalCompositeOperation = "destination-out"
            ctx.beginPath()
            let radius = self.lWidth / 2 > 5 ? self.lWidth / 2 : 5
            ctx.arc(lastPoint.x, lastPoint.y, radius, 0, 2 * Math.PI)
            ctx.clip()
            ctx.clearRect(0, 0, self.canvas.width, self.canvas.height)
            ctx.restore()
          }

          var thee = e ? e : window.event
          self.stopBubble(thee)
        }
      }
      self.canvas.onmousemove = function (e) {
        if (self.inDrawMode()) {
          let x2 = e.clientX
          let y2 = e.clientY
          x2 -= rect.left
          y2 -= rect.top
          let newPoint = { x: x2 * scaleX, y: y2 * scaleY }

          if (self.paintTypeArr["line"]) {
            self.clearCanvas()
            self.imageData && self.context.putImageData(self.imageData, 0, 0)
            self.drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
          } else if (self.paintTypeArr["arrows"]) {
            self.clearCanvas()
            self.imageData && self.context.putImageData(self.imageData, 0, 0)
            self.drawArrow(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
          } else if (self.paintTypeArr["rect"]) {
            self.clearCanvas()
            self.imageData && self.context.putImageData(self.imageData, 0, 0)
            self.drawRect(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
          } else if (self.paintTypeArr["circle"]) {
            self.clearCanvas()
            self.imageData && self.context.putImageData(self.imageData, 0, 0)
            self.drawCircle(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
          }

          let thee = e ? e : window.event
          self.stopBubble(thee)
        }
      }
      self.canvas.onmouseup = function () {
        if (self.inDrawMode()) {
          lastPoint = { x: undefined, y: undefined }
          self.canvasDraw()
          // console.log(123)
          // self.filterObject()
        }
      }

    },
    filterObject (type) {
      if (!type) {
        for (const key in this.paintTypeArr) {
          this.paintTypeArr[key] = false
        }
        document.getElementById("drawingBorad").style['pointer-events'] = 'none'
        document.getElementById("myCanvas").style['pointer-events'] = 'auto'
      } else {
        for (const key in this.paintTypeArr) {
          key === type
            ? (this.paintTypeArr[key] = true)
            : (this.paintTypeArr[key] = false)
        }
        document.getElementById("drawingBorad").style['pointer-events'] = 'auto'
        document.getElementById("myCanvas").style['pointer-events'] = 'none'
      }
      console.log(this.paintTypeArr)
    },
    //画线
    drawLine(fromX, fromY, toX, toY) {
      let ctx = this.context
      ctx.beginPath()
      ctx.lineWidth = this.lwidth
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.moveTo(fromX, fromY)
      ctx.lineTo(toX, toY)
      ctx.stroke()
      ctx.closePath()
    },
    //画箭头
    drawArrow(fromX, fromY, toX, toY) {
      let ctx = this.context
      let headlen = 10   //自定义箭头线的长度
      let theta = 45   //自定义箭头线与直线的夹角，个人觉得45°刚刚好
      let arrowX, arrowY   //箭头线终点坐标
      // 计算各角度和对应的箭头终点坐标
      let angle = (Math.atan2(fromY - toY, fromX - toX) * 180) / Math.PI
      let angle1 = ((angle + theta) * Math.PI) / 180
      let angle2 = ((angle - theta) * Math.PI) / 180
      let topX = headlen * Math.cos(angle1)
      let topY = headlen * Math.sin(angle1)
      let botX = headlen * Math.cos(angle2)
      let botY = headlen * Math.sin(angle2)
      ctx.beginPath()
      //画直线
      ctx.moveTo(fromX, fromY)
      ctx.lineTo(toX, toY)

      arrowX = toX + topX
      arrowY = toY + topY
      //画上边箭头线
      ctx.moveTo(arrowX, arrowY)
      ctx.lineTo(toX, toY)

      arrowX = toX + botX
      arrowY = toY + botY
      //画下边箭头线
      ctx.lineTo(arrowX, arrowY)

      ctx.stroke()
      ctx.closePath()
    },
    //绘制矩形
    drawRect(topLeftX, topLeftY, botRightX, botRightY) {
      let ctx = this.context
      ctx.strokeRect(
        topLeftX,
        topLeftY,
        Math.abs(botRightX - topLeftX),
        Math.abs(botRightY - topLeftY)
      )
    },
    //画圆
    drawCircle(circleX, circleY, endX, endY) {
      let ctx = this.context
      let radius = Math.sqrt(
        (circleX - endX) * (circleX - endX) +
        (circleY - endY) * (circleY - endY)
      )
      ctx.beginPath()
      ctx.arc(circleX, circleY, radius, 0, Math.PI * 2, true)
      ctx.stroke()
    },
    //画文字
    drawText(startX, startY, content) {
      let ctx = this.context
      ctx.save()
      ctx.beginPath()
      ctx.font = "25px orbitron"
      ctx.textBaseline = "top"
      ctx.fillText(content, parseInt(startX), parseInt(startY))
      ctx.restore()
      ctx.closePath()
    },
    //清屏
    clearCanvas() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },
    //阻止事件冒泡
    stopBubble(evt) {
      if (evt.stopPropagation) {
        evt.stopPropagation()
      } else {
        //ie
        evt.cancelBubble = true
      }
    },
    //定格画布图片
    canvasDraw() {
      this.imageData = this.context.getImageData(0,0,this.canvas.width, this.canvas.height)
      this.historyImageData.push(this.imageData)
      console.log(this.historyImageData)
    },
    inDrawMode () {
      let self = this
      if (self.paintTypeArr["line"]) {
        return true
      } else if (self.paintTypeArr["arrows"]) {
        return true
      } else if (self.paintTypeArr["rect"]) {
        return true
      } else if (self.paintTypeArr["circle"]) {
        return true
      } else if (self.paintTypeArr["text"]) {
        return true
      } else {
        return false
      }
    }
  },
  created () {
    this.$axios.get('/getImg?name=' + this.$route.params.name).then(res => {
      let imgPath = res.data.path
      cvs = document.getElementById('myCanvas')
      ctx = cvs.getContext('2d')
      img = new Image()
      img.onload = function () {
        processImg.initWidth = this.width / 2
        processImg.initHeight = this.height / 2
        processImg.width = this.width / 2
        processImg.height = this.height / 2

        ctx.drawImage(processImg.imgSrc, 0, 0, processImg.width, processImg.height)
        ctx.translate(processImg.width / 2, processImg.height / 2)
      }
      img.src = '/api' + imgPath
      processImg.imgSrc = img
      let self = this

      console.log(this.inDrawMode())
      // 只有在非绘制模式下才进行如下监听
      cvs.onmousedown = function (event) {
        isDown = true
        if(!self.inDrawMode()) {
          let loc = {x: event.layerX, y: event.layerY}
          beginX = loc.x
          beginY = loc.y
        }
      }

      cvs.onmousemove = function (event) {
        onCvs = true
        if(!self.inDrawMode()) {
          let loc = {x: event.layerX, y: event.layerY}
          let x = loc.x
          let y = loc.y
          let dx = x - beginX
          let dy = y - beginY

          if (isDown === true) { // 鼠标按下
            ctx.clearRect(-cvs.width, -cvs.height, cvs.width * 2, cvs.height * 2)

            if (altDown === false) { // alt键未按下，此时实现拖拽功能
              PO = {x: PO.x + dx, y: PO.y + dy} // 更新PO
              processImg.position.x = PO.x
              processImg.position.y = PO.y

              ctx.translate(dx, dy)
              ctx.drawImage(processImg.imgSrc, -processImg.width / 2, -processImg.height / 2, processImg.width, processImg.height)
            } else { // alt键按下，此时实现旋转功能
              ctx.rotate(dy * 0.5 * Math.PI / 180)
              ctx.drawImage(processImg.imgSrc, -processImg.width / 2, -processImg.height / 2, processImg.width, processImg.height)
            }
            beginX = x
            beginY = y // 记录移动后鼠标在屏幕坐标系的新位置
          }
        }
      }

      cvs.onmouseup = function () {
        isDown = false
      }

      cvs.onmouseout = function () {
        onCvs = false
        isDown = false
      }

      document.onkeydown = function (event) {
        if (event.key === 'Alt') {
          // 判断是否按下Alt键
          altDown = true
          console.log('press!')
        }
      }

      document.onkeyup = function (event) {
        if (event.key === 'Alt') {
          altDown = false
          console.log('release!')
        }
      }

      let scale = 1
      cvs.onwheel = function (e) {
        if (onCvs && altDown) {
          ctx.clearRect(-cvs.width, -cvs.height, cvs.width * 2, cvs.height * 2)
          let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)))
          scale += delta * 0.1
          processImg.width = processImg.initWidth * scale
          processImg.height = processImg.initHeight * scale
          ctx.drawImage(processImg.imgSrc, -processImg.width / 2, -processImg.height / 2, processImg.width, processImg.height)
        }
      }
    }).catch(function (error) {
      console.log(error)
    })
  },
  mounted() {
    let self = this;
    self.init()
    window.onresize = function () {
      self.init()
    }
    // document.getElementById("lwRange").onchange = function () {
    //   self.lwidth = parseInt(document.getElementById("lwRange").value)
    // }
    // document.getElementById("lcolor").onchange = function () {
    //   self.context.fillStyle = document.getElementById("lcolor").value
    //   self.context.strokeStyle = document.getElementById("lcolor").value
    // }
    this.listen()
    // this.initWebSocket()
  },
}

let cvs
let ctx
let img
let beginX
let beginY
let isDown = false
let onCvs = false
let altDown = false
let PO = {x: 0, y: 0}
let processImg = {imgSrc: img, initWidth: 0, initHeight: 0, width: 0, height: 0, position: PO}

function curImage (filter) {
  let canvas = document.createElement('canvas')
  let context = canvas.getContext('2d')
  canvas.width = processImg.width
  canvas.height = processImg.height

  context.drawImage(img, 0, 0, processImg.width, processImg.height)
  let newImageData = filter(context.getImageData(0, 0, processImg.width, processImg.height), context)
  // console.log(filter + '\n' + newImageData)
  context.putImageData(newImageData, 0, 0)

  processImg.imgSrc = canvas
}

function grey (imgData, ctx) {
  for (let i = 0; i < imgData.data.length; i += 4) {
    let grey = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3
    imgData.data[i] = imgData.data[i + 1] = imgData.data[i + 2] = grey
    imgData.data[i + 3] = 255
  }

  return imgData
}

function monochrome (imgData, ctx) {
  for (let i = 0; i < imgData.data.length; i += 4) {
    let avg = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3
    imgData.data[i] = imgData.data[i + 1] = imgData.data[i + 2] = avg >= 100 ? 255 : 0
  }

  return imgData
}

function RGBReverse (imgData, ctx) {
  for (let i = 0; i < imgData.data.length; i += 4) {
    imgData.data[i] = 255 - imgData.data[i]
    imgData.data[i + 1] = 255 - imgData.data[i + 1]
    imgData.data[i + 2] = 255 - imgData.data[i + 2]
  }

  return imgData
}

function convolutionMatrix (output, input, kernel) {
  let w = input.width
  let h = input.height
  let iD = input.data
  let oD = output.data
  for (let y = 1; y < h - 1; y += 1) {
    for (let x = 1; x < w - 1; x += 1) {
      for (let c = 0; c < 3; c += 1) {
        let i = (y * w + x) * 4 + c
        oD[i] = kernel[0] * iD[i - w * 4 - 4] +
          kernel[1] * iD[i - w * 4] +
          kernel[2] * iD[i - w * 4 + 4] +
          kernel[3] * iD[i - 4] +
          kernel[4] * iD[i] +
          kernel[5] * iD[i + 4] +
          kernel[6] * iD[i + w * 4 - 4] +
          kernel[7] * iD[i + w * 4] +
          kernel[8] * iD[i + w * 4 + 4]
      }
      oD[(y * w + x) * 4 + 3] = 255
    }
  }
  return output
}

function convolution (imageData, ctx) {
  let kernel = [-1, -1, -1, -1, 8, -1, -1, -1, -1]

  return convolutionMatrix(ctx.createImageData(imageData), imageData, kernel)
}

</script>

<style scoped>
.canvas-box {
  border-style: solid;
  border-radius: 8px;
  border-color: #9b9b9b;
  border-width: 2px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-right: 10px;
}

.menu-title {
  padding-top: 3px;
  text-align: center;
  background-color: #eef8fd;
  height: 50px;
}

#img-proc {
  padding-left: 5px;
}

#drawingBorad {
  position: absolute;
  left: 216px;
  top: 68px;
  z-index: 10;
}
#myCanvas {
  position: absolute;
  left: 216px;
  top: 68px;
  background: #ffffff;
  z-index: 0;
}
</style>
/* eslint-disable */
