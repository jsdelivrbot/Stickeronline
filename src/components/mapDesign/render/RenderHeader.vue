<template>
  <div class="header">
    <div class="mapDesignIcon">MapDesign</div>
    <div class="savesBtns">
      <el-button type="success" @click="saveMap">保存</el-button>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  import Tool from '@/components/tool.vue'

  export default {
      name: 'header',
    data () {
      return {

      };
    },
    computed: {
      ...mapGetters([
        'render'
      ])
    },
    created () {

    },
    mounted () {

    },
    methods: {
      ...mapActions([
          'resetRender', //清空vuex中状态
      ]),
      /* 保存新创建的地图 */
      saveMap () {
        this.$bus.emit('get-map-basemap');
        /*console.log(this.render.savedLayers.base_layer)
        debugger*/
        // 先将当前渲染的样式从Simple.vue || Grade.vue || Type.vue 中缓存到vuex中(缓存另一个位置是RenderConfig.vue组件切换渲染图层的时候)
        this.saveCurrentTypeRender();

        var url = 'mapdesign/maps/add',
          layers = Tool.clone(this.render.savedLayers),
          img = '';

        var params = "data=" + JSON.stringify({
            lid: 1,
            description: this.render.newMapInfo.description,
            name: this.render.newMapInfo.name,
            tag: this.render.newMapInfo.tag,
            mark: this.render.newMapInfo.name,
            createdate: "2017-07-26",
            modifydate: "2017-07-26",
            img: img,
            layers: layers
          });

        console.log('params', {
          lid: 1,
          description: this.render.newMapInfo.description,
          name: this.render.newMapInfo.name,
          tag: this.render.newMapInfo.tag,
          mark: this.render.newMapInfo.name,
          createdate: "2017-07-26",
          modifydate: "2017-07-26",
          img: img,
          layers: layers
        });

        this.$http.post(url, params).then((res) => {
          if (res.data) {
            this.$message({
              showClose: true,
              message: '成功保存至数据库',
              type: 'success',
            });
            this.$router.replace({name: 'mapDesign'});
            // 清空vuex中状态
            this.resetRender();
          }
        }).catch((err) => { console.log(err) });

        console.log('this.render.savedLayers', this.render.savedLayers);
      },

      saveCurrentTypeRender () {
        let renderType = this.render.renderType;
        this.$bus.emit('save-current-'+ renderType +'-render')
      },
    }
  }
</script>

<style scoped>
  .header {
    width: 100%;
    height: 100%;
  }

  .mapDesignIcon {
    width: 82px;
    position: absolute;
    left: 30px;
    font-weight: bold;
  }

  .savesBtns {
    width: 150px;
    position: absolute;
    right: 50px;
  }
</style>
