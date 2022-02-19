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

        </el-menu>
      </el-col>

      <el-col :span="21" id="img-proc">
        <h3><i class="el-icon-picture-outline" style="font-size: larger"></i><span>  滤镜算法处理效果图</span></h3>
        <div class="canvas-box">
          <canvas width="1487" height="800" id="myCanvas"></canvas>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
export default {
  name: 'ImgProcess',
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

      cvs.onmousedown = function (event) {
        isDown = true
        let loc = {x: event.layerX, y: event.layerY}
        beginX = loc.x
        beginY = loc.y
      }

      cvs.onmousemove = function (event) {
        onCvs = true
        if (isDown === true) { // 鼠标按下
          let loc = {x: event.layerX, y: event.layerY}
          let x = loc.x
          let y = loc.y
          let dx = x - beginX
          let dy = y - beginY
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
  }
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
  console.log(filter + '\n' + newImageData)
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
  let kernel = [-1, -1, -1,
                -1, 8, -1,
                -1, -1, -1]

  return convolutionMatrix(ctx.createImageData(imageData), imageData, kernel)
}

</script>

<style scoped>
.canvas-box {
  border-style: solid;
  border-radius: 8px;
  border-color: #9b9b9b;
  border-width: 2px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
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
</style>
