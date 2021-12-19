<template>
  <div id="img-list">
    <el-row v-for="img in imgs" :key="img.img_name">
      <h3>{{img.img_name}}</h3>
      <a :href="img.path" download>
        <img :src="'/api'+img.path" alt="单击下载图片" width="512" height="288" id="pic"/>
      </a>
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
  }
}
</script>

<style scoped>

</style>
