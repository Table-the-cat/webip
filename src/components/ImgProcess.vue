<template>
  <div id="img-process">
    <el-row>
      <h2>滤镜算法Demo</h2>
    </el-row>

    <el-row>
      <el-col :span="24">
        <h3>滤镜算法处理效果图</h3>
        <div class="canvas-box">
          <canvas width="1650" height="600" id="myCanvas"></canvas>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="2">
        <el-button v-on:click="back">原图</el-button>
      </el-col>
      <el-col :span="2">
        <el-button v-on:click="turnGrey">灰色</el-button>
      </el-col>
      <el-col :span="2">
        <el-button v-on:click="turnMonochrome">黑白</el-button>
      </el-col>
      <el-col :span="2">
        <el-button v-on:click="turnRGBReverse">反色</el-button>
      </el-col>
      <el-col :span="2">
        <el-button v-on:click="turnConvolution">卷积</el-button>
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
      ctx.drawImage(img, 0, 0, 512, 288)

      // 重置各参数
      processImg.position.x = 0
      processImg.position.y = 0
      processImg.width = 512
      processImg.height = 288
      processImg.imgSrc = img
      PO.x = 0
      PO.y = 0
    },
    turnGrey: function () {
      ctx.clearRect(0, 0, cvs.width, cvs.height)
      curImage(grey)
      ctx.drawImage(processImg.imgSrc, processImg.position.x, processImg.position.y, processImg.width, processImg.height)
    },
    turnMonochrome: function () {
      ctx.clearRect(0, 0, cvs.width, cvs.height)
      curImage(monochrome)
      ctx.drawImage(processImg.imgSrc, processImg.position.x, processImg.position.y, processImg.width, processImg.height)
    },
    turnRGBReverse: function () {
      ctx.clearRect(0, 0, cvs.width, cvs.height)
      curImage(RGBReverse)
      ctx.drawImage(processImg.imgSrc, processImg.position.x, processImg.position.y, processImg.width, processImg.height)
    },
    turnConvolution: function () {
      ctx.clearRect(0, 0, cvs.width, cvs.height)
      curImage(convolution)
      ctx.drawImage(processImg.imgSrc, processImg.position.x, processImg.position.y, processImg.width, processImg.height)
    }
  },
  created () {
    this.$axios.get('/getImg?name=' + this.$route.params.name).then(res => {
      let imgPath = res.data.path
      cvs = document.getElementById('myCanvas')
      ctx = cvs.getContext('2d')
      img = new Image(512, 288)
      img.src = '/api' + imgPath
      ctx.drawImage(img, 0, 0, 512, 288)
      // 获取canvas中图像的data属性（每个像素点的rgba）
      imgData = ctx.getImageData(0, 0, 512, 288)
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
            ctx.drawImage(processImg.imgSrc, processImg.position.x, processImg.position.y, processImg.width, processImg.height)
          } else { // alt键按下，此时实现旋转功能
            ctx.rotate(dy * 0.5 * Math.PI / 180)
            ctx.drawImage(processImg.imgSrc, processImg.position.x, processImg.position.y, processImg.width, processImg.height)
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
          ctx.drawImage(processImg.imgSrc, PO.x, PO.y, 512 * scale, 288 * scale)
          processImg.width = 512 * scale
          processImg.height = 288 * scale
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
let imgData
let beginX
let beginY
let isDown = false
let onCvs = false
let altDown = false
let PO = {x: 0, y: 0}
let processImg = {imgSrc: img, width: 512, height: 288, position: PO}

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
.canvas-box{
  border-style: solid;
  border-radius: 8px;
  border-color: #9b9b9b;
  border-width: 2px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}
</style>
