<template>
  <wallpaper-plus color="208,233,242" :bg-img="visualizedAnalysisService.bgImg">
    <div id="target"></div>

    <el-form class="login-container" label-position="left" label-width="0px">
      <h3 class="login_title">可视化分析</h3>
      <el-form-item style="user-select: none;">
        <el-upload
            drag
            ref="upload"
            :auto-upload="false"
            :action="visualizedAnalysisService.url"
            :file-list="visualizedAnalysisService.files"
            :on-remove="visualizedAnalysisService.removeFile"
            :on-change="visualizedAnalysisService.changeFiles"
            :http-request="visualizedAnalysisService.uploadFiles"
        >
          <i class="el-icon-upload avatar-uploader-icon-computer"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击选择</em></div>
          <div class="upload-tips">数据文件格式支持 XLSX、XLS、CSV、JSON</div>
        </el-upload>
      </el-form-item>

      <el-form-item style="width: 100%">
        <el-button type="primary" class="button-border-purple" @click="visualizedAnalysisService.changeBgImgIndex()">更换背景图片</el-button>
      </el-form-item>

      <el-form-item style="width: 100%">
        <el-button type="primary" class="button-border-orange" @click="visualizedAnalysisService.exportExcelOperate()">导出 EXCEL
          数据
        </el-button>
      </el-form-item>

      <el-form-item style="width: 100%">
        <el-button type="primary" class="button-border" @click="visualizedAnalysisService.showDefaultData()">展示默认数据</el-button>
      </el-form-item>

      <el-form-item style="user-select: none;">
        <el-row style="text-align: center">
          <el-col :span="3">
            <el-button
                class="layout-button"
                icon="el-icon-minus"
                style="float: left"
                @click="visualizedAnalysisService.visualDecrease()"></el-button>
          </el-col>
          <el-col :span="18">
            <el-progress
                text-color="white"
                :stroke-width="30"
                :text-inside="true"
                :percentage="visualizedAnalysisService.percentage"
                :color="visualizedAnalysisService.colors"/>
          </el-col>
          <el-col :span="3">
            <el-button
                class="layout-button"
                icon="el-icon-plus"
                style="float: right"
                @click="visualizedAnalysisService.visualIncrease()"></el-button>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item v-if="visualizedAnalysisService.sheetNames.length > 1" style="user-select: none;">
        <el-select
            v-model="visualizedAnalysisService.sheetName"
            placeholder="请选择 sheet 表格数据"
            style="width: 100%">
          <el-option
              :key="index"
              :label="sheetName"
              :value="sheetName"
              v-for="(sheetName, index) in visualizedAnalysisService.sheetNames">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item style="user-select: none;">
        <el-input type="text" v-model="visualizedAnalysisService.layoutTitle" placeholder="请输入可视化图表标题"></el-input>
      </el-form-item>

      <el-form-item style="user-select: none;">
        <el-input type="text" v-model="visualizedAnalysisService.xAxisTitle" placeholder="请输入 X 轴标题"></el-input>
      </el-form-item>

      <el-form-item style="user-select: none;">
        <el-select
            v-model="visualizedAnalysisService.xAxis"
            placeholder="请选择 X 轴方向数据"
            style="width: 100%">
          <el-option
              :key="index"
              :label="field"
              :value="field"
              v-for="(field, index) in visualizedAnalysisService.fields"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item style="user-select: none;">
        <el-input type="text" v-model="visualizedAnalysisService.yAxisTitle" placeholder="请输入 Y 轴标题"></el-input>
      </el-form-item>

      <el-form-item style="user-select: none;">
        <el-select
            v-model="visualizedAnalysisService.yAxis"
            placeholder="请选择 Y 轴方向数据"
            style="width: 100%"
            multiple>
          <el-option
              :key="index"
              :label="field"
              :value="field"
              v-for="(field, index) in visualizedAnalysisService.fields">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item style="width: 100%">
        <el-button type="primary" class="button-border-blue"
                   @click="visualizedAnalysisService.visualizedAnalysis()">数据可视化
        </el-button>
      </el-form-item>

      <el-form-item style="width: 100%">
        <el-button type="primary" class="button-border-red" @click="visualizedAnalysisService.resetVisualizedAnalysis()">重置可视化操作</el-button>
      </el-form-item>
    </el-form>

    <freeze-excel/>
  </wallpaper-plus>
</template>

<script lang="ts">
import Vue from "vue";
import FreezeExcel from "@/components/FreezeExcel.vue";
import WallpaperPlus from "@/components/WallpaperPlus.vue";
import {VisualizedAnalysisService} from "@/common/service/VisualizedAnalysisService";
import {WallpaperPlusImage} from "@/common/pojo/po/WallpaperPlusImage";

export default Vue.extend({
  name: "VisualizedAnalysis",
  data() {
    return {
      WallpaperPlusImage,
      visualizedAnalysisService: new VisualizedAnalysisService(this)
    }
  },
  components: {
    WallpaperPlus,
    FreezeExcel
  }
});
</script>

<style scoped>
.layout-button {
  padding: 6px 6px;
  position: relative;
}

.upload-tips {
  color: rgba(0, 0, 0, .45);
  font-size: 12px;
  margin-top: -15px;
  margin-bottom: 10px;
}

/deep/ .el-upload-dragger .el-icon-upload {
  line-height: 29px;
}

/deep/ .el-upload-list__item-name:hover {
  color: #606266;
}

/deep/ .el-upload-list__item-name {
  color: white;
}

/deep/ .el-upload-dragger {
  width: 330px;
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
  border: 1px solid #40E0D0;
}

.button-border:hover {
  width: 100%;
  background: rgba(45, 45, 45, 0.33);
  border: 1px solid #40E0D0;
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

.button-border-blue {
  width: 100%;
  background: rgba(45, 45, 45, 0.33);
  border: 1px solid rgb(40, 116, 252);
}

.button-border-blue:hover {
  width: 100%;
  background: rgba(45, 45, 45, 0.33);
  border: 1px solid rgb(40, 116, 252);
  box-shadow: 0 0 25px rgba(6, 147, 227, .5);
}

.button-border-orange {
  width: 100%;
  background: rgba(45, 45, 45, 0.33);
  border: 1px solid rgb(255,105,0);
}

.button-border-orange:hover {
  width: 100%;
  background: rgba(45, 45, 45, 0.33);
  border: 1px solid rgb(255,105,0);
  box-shadow: 0 0 25px rgba(251,105,98, .5);
}

.button-border-purple {
  width: 100%;
  background: rgba(45, 45, 45, 0.33);
  border: 1px solid rgb(151,120,209);
}

.button-border-purple:hover {
  width: 100%;
  background: rgba(45, 45, 45, 0.33);
  border: 1px solid rgb(151,120,209);
  box-shadow: 0 0 25px rgba(155,81,224, .5);
}
</style>