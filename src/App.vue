<template>
  <div id="app">
    <el-row id="top-bar">
      <router-link to="/ImgList"><i class="el-icon-edit"></i>在线图像处理</router-link>
    </el-row>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

a {
  text-decoration:none ;
  color: #cbf0fc;
  font-size: 35px;
}

body {
  margin: 0;
}

.router-link-active {
  text-decoraction: none ;
  color: #cbf0fc;
}

#top-bar {
  background-color: #29313b;
  padding-top: 15px;
  height: 75px;
  padding-left: 10px;
  border-left-color: #44566e;
  border-left-style: solid;
  border-left-width: 20px;
}
</style>
