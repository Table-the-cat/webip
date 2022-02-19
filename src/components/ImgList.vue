<template>
  <div id="img-list">
    <el-row class="div-center">
      <el-col :span="20" :offset="2">
        <h2>图片列表</h2>
      </el-col>

      <el-col :span="2">
        <el-button @click="dialogVisible = true" type="primary" class="text-main" plain>
          <i class="el-icon-upload2"></i><span> 添加</span>
        </el-button>

        <el-dialog title="上传图片" :visible.sync="dialogVisible">
          <div class="fileInput">
            <el-input v-model="input"
                      placeholder="请输入内容"
                      type="file"
                      id="Updateimage"
                      lay-verify="required"
                      accept="image/jpeg, image/png, image/jpg">
            </el-input>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="upload">确 定</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
    <el-row v-for="img in imgs" :key="img.img_name" class="img-box div-center">
      <el-col :span="12">
        <h3>{{img.img_name}}</h3>
        <img :src="'/api' + img.path" alt="图片不可用" width="256" height="144" id="pic"/>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" v-on:click="toProcess(img.img_name)" round>处理</el-button>
      </el-col>
      <el-col :span="3">
        <el-button type="danger" v-on:click="deleteImg(img.img_name)" icon="el-icon-delete" circle></el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Axios from 'axios'

export default {
  name: 'ImgList',
  data () {
    return {
      imgs: [],
      input: '',
      dialogVisible: false
    }
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
    },
    upload () {
      let file = document.querySelector('input[type=file]').files[0]
      let param = new FormData() // 创建form对象
      param.append('file', file, file.name) // 通过append向form对象添加数据
      param.append('chunk', '0') // 添加form表单中其他数据
      console.log(param.get('file')) // FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let config = {
        headers: {'Content-Type': 'multipart/form-data;charset=UTF-8'}
      } // 添加请求头
      Axios.post('/uploadImg', param, config)
        .then(response => {
          console.log(response.data)
        })

      this.dialogVisible = false
      window.location.reload()
    },
    deleteImg (name) {
      Axios.get('/deleteImg?name=' + name)
        .then(response => {
          console.log(response.data)
        })

      window.location.reload()
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
  background-color: #c5e7fd;
}

#img-list {
  text-align: center;
}

.text-main {
  color: #606266;
  font-size: large;
}
</style>
