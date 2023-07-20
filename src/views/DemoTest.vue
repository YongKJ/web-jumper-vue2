<template>
  <wallpaper-plus color="208,233,242">
    <el-button
        style="position: relative"
        @click="demoTestService.handleButtonClick()">
      测试
    </el-button>

    <el-form class="login-container" label-position="left" label-width="0px">
      <h3 class="login_title">袖珍网盘吧</h3>
      <el-form-item style="user-select: none;">
        <el-upload
            drag
            multiple
            ref="upload"
            :auto-upload="false"
            :action="demoTestService.url"
            :file-list="demoTestService.files"
            :on-change="demoTestService.changeFiles"
            :http-request="demoTestService.uploadFiles"
        >
          <i class="el-icon-upload avatar-uploader-icon-computer"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </el-form-item>

      <el-form-item style="user-select: none;">
        <el-input type="text" v-model="demoTestService.userName" placeholder="请输入邮箱地址或用户名..."></el-input>
      </el-form-item>

      <el-form-item style="user-select: none;">
        <el-input type="password" v-model="demoTestService.password" placeholder="请输入密码..."></el-input>
      </el-form-item>

      <el-form-item style="width: 100%">
        <el-button type="primary" style="width: 100%;background: #4169E1;border: none" @click="demoTestService.connect()">连接websocket
        </el-button>
      </el-form-item>

      <el-form-item style="width: 100%">
        <el-button type="primary" style="width: 100%;background: #4169E1;border: none" @click="demoTestService.disconnect()">关闭websocket
        </el-button>
      </el-form-item>

      <el-form-item style="width: 100%">
        <el-button type="primary" style="width: 100%;background: #4169E1;border: none" @click="demoTestService.login()">登录
        </el-button>
      </el-form-item>

      <el-form-item style="width: 100%">
        <el-button type="primary" class="button-border" @click="demoTestService.register()">还没有账号？</el-button>
      </el-form-item>

      <el-form-item style="width: 100%">
        <el-button type="primary" class="button-border-red" @click="demoTestService.reset()">忘记密码？</el-button>
      </el-form-item>

      <el-form-item style="width: 100%">
        <el-pagination
            @size-change="demoTestService.pageSizeChange"
            :page-size="demoTestService.pageSize"
            :total="demoTestService.totalRecord"
            @current-change="demoTestService.pageNumberChange"
            :current-page="demoTestService.pageNumber"
            layout="prev, pager, next"
            :pager-count="5"
            ref="pagination"
        ></el-pagination>
      </el-form-item>
    </el-form>

    <aplayer
        fixed
        :lrcType="0"
        ref="aplayer"
        :mini="false"
        :autoplay="true"
        :listFolded="true"
        :audio="demoTestService.audios"
        v-if="demoTestService.musicFlag"
    />
  </wallpaper-plus>
</template>

<script lang="ts">
import Vue from "vue";
import WallpaperPlus from "@/components/WallpaperPlus.vue";
import {DemoTestService} from "@/common/service/DemoTestService";
import {LogUtil} from "@/common/util/LogUtil";
import {Log} from "@/common/pojo/dto/Log";

export default Vue.extend({
  name: "DemoTest",
  data() {
    return {
      demoTestService: new DemoTestService(this)
    }
  },
  mounted() {
    this.demoTestService.initData();
  },
  components: {
    WallpaperPlus
  }
});
</script>

<style scoped>
/deep/ .el-upload-list__item-name:hover {
  color: #606266;
}

/deep/ .el-upload-list__item-name {
  color: white;
}

/deep/ .el-upload-dragger {
  width: 330px;
}

.button {
  width: 100px;
  height: 20px;
  position: relative;
}

.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 90px auto;
  width: 330px;
  padding: 35px 35px 15px 35px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px rgba(155, 89, 182, .5);
  position: relative;
}

.login_title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #f3f9f1;
  user-select: none;
  font-size: 32px;
  font-weight: 500;
}

.button-border {
  width: 100%;
  background: rgba(45, 45, 45, 0.33);
  /*   border: none; */
  border: 1px solid #40E0D0;
  /*   box-shadow: 0 0 25px rgba(155,89,182,.5); */
  /*   box-shadow: 0 0 25px rgba(64,224,208,.5); */
}

.button-border:hover {
  width: 100%;
  background: rgba(45, 45, 45, 0.33);
  /*   border: none; */
  border: 1px solid #40E0D0;
  /*   box-shadow: 0 0 25px rgba(155,89,182,.5); */
  box-shadow: 0 0 25px rgba(64, 224, 208, .5);
}

.button-border-red {
  width: 100%;
  background: rgba(45, 45, 45, 0.33);
  border: 1px solid #E74C3C;
}

.button-border-red:hover {
  width: 100%;
  background: rgba(45, 45, 45, 0.33);
  border: 1px solid #E74C3C;
  box-shadow: 0 0 25px rgba(236, 112, 99, .5);
}
</style>