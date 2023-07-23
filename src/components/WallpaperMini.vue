<template>
  <div class="main" :style="wallpaperMiniService.getBgImgStyle(bgImg)">
    <happy-scroll
        resize
        size="6"
        ref="scroll"
        :style="wallpaperMiniService.getScrollbarHeightStyle()"
        :color="'rgba(' + color + ',0.3)'"
    >
      <div :style="wallpaperMiniService.getMainWidthStyle()">
        <div id="content-details" style="position: relative; margin: 0 auto">
          <vue-particles
              color="#ffffff"
              :particleOpacity="0.7"
              :particlesNumber="number"
              shapeType="circle"
              :particleSize="3"
              linesColor="#E6E6FA"
              :linesWidth="1"
              :lineLinked="linked"
              :lineOpacity="0.6"
              :linesDistance="150"
              :moveSpeed="speed"
              :moveDirection="direction"
              :hoverEffect="true"
              hoverMode="grab"
              :clickEffect="true"
              :clickMode="mode"
          >
          </vue-particles>
          <slot></slot>
        </div>
      </div>
    </happy-scroll>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {WallpaperMiniService} from "@/common/service/WallpaperMiniService";
import {WallpaperPlusImage} from "@/common/pojo/po/WallpaperPlusImage";
import VueParticles from "@/components/VueParticles.vue";

export default Vue.extend({
  name: "WallpaperMini",
  props: {
    bgImg: {
      type: String,
      default: WallpaperPlusImage.BACKGROUND
    },
    color: {
      type: String,
      default: "152,118,170"
    },
    type: {
      type: String,
      default: "grid"
    },
  },
  data() {
    return {
      linked: this.type !== "snow",
      speed: this.type === "snow" ? 3 : 6,
      number: this.type === "snow" ? 100 : 50,
      mode: this.type === "snow" ? "repulse" : "push",
      direction: this.type === "snow" ? "bottom" : "none",
      wallpaperMiniService: new WallpaperMiniService(this),
    }
  },
  mounted() {
    this.wallpaperMiniService.initData();
  },
  components: {
    VueParticles
  }
});
</script>

<style scoped>
.main {
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: cover;
  scroll-bar-width: none;
  position: fixed;
  transition: unset;
  overflow: scroll;
  height: 100%;
  width: 100%;
  inset: 0;
}

#particles-js {
  position: fixed;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
  top: 0;
}

.main::-webkit-scrollbar {
  display: none;
}
</style>