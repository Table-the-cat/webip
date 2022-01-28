<template>
  <div id="img-list">
    <el-row>
      <h2>图片列表</h2>
    </el-row>
    <el-row v-for="img in imgs" :key="img.img_name" class="img-box div-center">
      <el-col :span="12">
        <h3>{{img.img_name}}</h3>
        <a :href="img.path" download>
          <img :src="'/api'+img.path" alt="单击下载图片" width="256" height="144" id="pic"/>
        </a>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" v-on:click="toProcess(img.img_name)" round>处理</el-button>
      </el-col>
      <el-col :span="3">
        <el-button type="danger" icon="el-icon-delete" circle></el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'ImgList',
  data () {
    return {imgs: []}
  },
  created () {
    this.$axios.get('/display').then(res => {
      this.imgs = res.data
    }).catch(function (error) {
      console.log(error)
    })
  },
  methods: {
    toProcess (name) {
      this.$router.push({
        path: `/ImgProcess/${name}`
      })
    }
  }
}
</script>

<style scoped>
.div-center{
  display: flex;
  align-items: center;
}
.img-box{
  border-style: solid;
  border-radius: 4px;
  border-color: #9b9b9b;
  border-width: 1px;
  margin: 10px 15px 0 15px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: #b3e0fd;
}
</style>
