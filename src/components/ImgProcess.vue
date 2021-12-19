<template>
  <div id="img-process">
    <el-row>
      <h2>滤镜算法Demo</h2>
    </el-row>
    <el-row>
      <el-select v-model="selected" placeholder="Select">
        <el-option
          v-for="item in imgs"
          :key="item.path"
          :label="item.img_name"
          :value="item.path"
        >
        </el-option>
      </el-select>
    </el-row>

    <el-row>
      <h3>原图</h3>
      <img :src="'/api'+selected" width="512" height="288" id="pic" crossorigin="anonymous"/>
    </el-row>

    <el-row>
      <el-col :span="24">
        <h3>滤镜算法处理效果图</h3>
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
<!--      <el-col :span="2">-->
<!--        <el-button v-on:click="turnGaussBlur">高斯模糊</el-button>-->
<!--      </el-col>-->
    </el-row>

    <el-row>
      <canvas width="1000" height="1000" id="myCanvas"></canvas>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'ImgProcess',
  methods: {
    back: function () {
      ctx.drawImage(img, 0, 0, 512, 288)
    },
    turnGrey: function () {
      ctx.drawImage(img, 0, 0, 512, 288)
      imgData = ctx.getImageData(0, 0, 512, 288)
      ctx.putImageData(grey(imgData), 0, 0)
    },
    turnMonochrome: function () {
      ctx.drawImage(img, 0, 0, 512, 288)
      imgData = ctx.getImageData(0, 0, 512, 288)
      ctx.putImageData(monochrome(imgData), 0, 0)
    },
    turnRGBReverse: function () {
      ctx.drawImage(img, 0, 0, 512, 288)
      imgData = ctx.getImageData(0, 0, 512, 288)
      ctx.putImageData(RGBReverse(imgData), 0, 0)
    },
    turnConvolution: function () {
      ctx.drawImage(img, 0, 0, 512, 288)
      imgData = ctx.getImageData(0, 0, 512, 288)
      ctx.putImageData(convolution(imgData, ctx), 0, 0)
    },
    turnGaussBlur: function () {
      ctx.drawImage(img, 0, 0, 512, 288)
      imgData = ctx.getImageData(0, 0, 512, 288)
      ctx.putImageData(gaussBlur(imgData, 500, 100), 0, 0)
    },
  },
  data () {
    return {
      imgs: [],
      selected: '\\img\\EVA_01.jpg'
    }
  },
  created () {
    this.$axios.get('/display').then(res => {
      this.imgs = res.data
      c = document.getElementById('myCanvas')
      ctx = c.getContext('2d')
      img = document.getElementById('pic')
      ctx.drawImage(img, 0, 0, 512, 288)
      // 获取canvas中图像的data属性（每个像素点的rgba）
      imgData = ctx.getImageData(0, 0, 512, 288)
      // ctx.putImageData(imgData,0,0)
    }).catch(function (error) {
      console.log(error)
    })
  }
}

let c
let ctx
let img
let imgData

function grey (imgData) {
  for (let i = 0; i < imgData.data.length; i += 4) {
    let grey = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3
    imgData.data[i] = imgData.data[i + 1] = imgData.data[i + 2] = grey
    imgData.data[i + 3] = 255
  }

  return imgData
}

function monochrome (imgData) {
  for (let i = 0; i < imgData.data.length; i += 4) {
    let avg = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3
    imgData.data[i] = imgData.data[i + 1] = imgData.data[i + 2] = avg >= 100 ? 255 : 0
  }

  return imgData
}

function RGBReverse (imgData) {
  for (let i = 0; i < imgData.data.length; i += 4) {
    imgData.data[i] = 255 - imgData.data[i]
    imgData.data[i + 1] = 255 - imgData.data[i + 1]
    imgData.data[i + 2] = 255 - imgData.data[i + 2]
  }

  return imgData
}


function convolutionMatrix(output, input, kernel) {
  let w = input.width, h = input.height;
  let iD = input.data, oD = output.data;
  for (let y = 1; y < h - 1; y += 1) {
    for (let x = 1; x < w - 1; x += 1) {
      for (let c = 0; c < 3; c += 1) {
        let i = (y * w + x) * 4 + c;
        oD[i] = kernel[0] * iD[i - w * 4 - 4] +
          kernel[1] * iD[i - w * 4] +
          kernel[2] * iD[i - w * 4 + 4] +
          kernel[3] * iD[i - 4] +
          kernel[4] * iD[i] +
          kernel[5] * iD[i + 4] +
          kernel[6] * iD[i + w * 4 - 4] +
          kernel[7] * iD[i + w * 4] +
          kernel[8] * iD[i + w * 4 + 4];
      }
      oD[(y * w + x) * 4 + 3] = 255;
    }
  }
  return output;
}
function convolution (imageData, ctx) {
  let kernel = [-1, -1, -1,
                -1, 8, -1,
                -1, -1, -1]

  return convolutionMatrix(ctx.createImageData(imageData), imageData, kernel);
}


function gaussBlur(imgData, radius, sigma) {
  let pixes = imgData.data,
    height = imgData.height,
    width = imgData.width;
    radius = radius || 5
  sigma = sigma || radius / 3;

  let gaussEdge = radius * 2 + 1;

  let gaussMatrix = [],
    gaussSum = 0,
    a = 1 / (2 * sigma * sigma * Math.PI),
    b = -a * Math.PI;

  for(let i = -radius; i <= radius; i++) {
    for(let j = -radius; j <= radius; j++) {
      let gxy = a * Math.exp((i * i + j * j) * b)
      gaussMatrix.push(gxy)
      gaussSum += gxy
    }
  }
  let gaussNum = (radius + 1) * (radius + 1)
  for(let i = 0; i < gaussNum; i++) {
    gaussMatrix[i] /= gaussSum
  }

  for(let x = 0; x < width; x++) {
    for(let y = 0; y < height; y++) {
      let r = g = b = 0
      for(let i = -radius; i<=radius; i++) {
        let m = handleEdge(i, x, width)
        for(let j = -radius; j <= radius; j++) {
          let mm = handleEdge(j, y, height)
          let currentPixId = (mm * width + m) * 4
          let jj = j + radius
          let ii = i + radius
          r += pixes[currentPixId] * gaussMatrix[jj * gaussEdge + ii]
          g += pixes[currentPixId + 1] * gaussMatrix[jj * gaussEdge + ii]
          b += pixes[currentPixId + 2] * gaussMatrix[jj * gaussEdge + ii]
        }
      }
      let pixId = (y * width + x) * 4

      pixes[pixId] = ~~r
      pixes[pixId + 1] = ~~g
      pixes[pixId + 2] = ~~b
    }
  }
  imgData.data = pixes
  return imgData
}

function handleEdge(i, x, w) {
  let m = x + i
  if (m < 0) {
    m = -m
  } else if (m >= w) {
    m = w + i - x
  }
  return m
}
</script>

<style scoped>

</style>
