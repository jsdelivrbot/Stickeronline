<template>
  <div class="render-config-content">
    <div class="map-info">
      <h2>{{ render.newMapInfo.name }}</h2>
      <!--2017-5-5-->
    </div>

    <hr>

    <el-tabs :value="tabValue" @tab-click="tabClick">
      <el-tab-pane label="图层" name="layer">
        <div class="layer-tree">
          <div class="addBtnDiv">
            <el-button type="success" @click="showDataDialog">添加数据</el-button>
          </div>

          <!-- 创建地图选择弹出框dialog -->
          <el-dialog title="创建地图" :visible.sync="dialogDataVisible" :close-on-press-escape="false" :close-on-click-modal="false">
            <div class="data-map-main">
              <div class="edit-log">
                <!-- 数据列表 -->
                <div class="data-list" v-loading="datalistLoading">

                  <div :class="[ 'data-container', item.checked ? 'data-checked' : '', item.geotype ? 'geo-data-container' : 'not-geo-data-container' ]"  v-for="item in data_list" :key="item.name"  @click="dataClick(item)">
                    <div class="data-items" :class="item.layertype"><img :src="choseDataIcon(item)" alt=""></div>
                    <div class="data-items">{{item.name}}</div>
                    <div class="data-items">{{item.pubdate || '未知'}}</div>
                  </div>

                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="currentDataChange"
                    :current-page.sync="pagination.currentPage"
                    :page-sizes="pagination.pageSizes"
                    :page-size="pagination.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pagination.total" class="data-pagination">
                  </el-pagination>
                </div>
                <!-- 数据列表结束 -->
              </div>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="addData">添 加</el-button>
            </div>
          </el-dialog>

          <draggable v-model="layerTree" @end="layerDradEnd">
            <div :class="[ 'layer', item.isAdded ? 'is-added' : 'is-not-added', item.isRendering ? 'layer-rendering' : 'layer-not-rendering']" v-for="item in layerTree" :key="item.id"  @click="renderCurrent(item)">
              <div class="left">
                <div class="box"><img src="../../../assets/mapDesign/img/esriGeometryPoint.png" alt=""></div>
              </div>
              <div style="display: table-cell">{{ item.id }}</div>
              <div class="right">
                <div class="box">
                  <i :class="[ item.isAdded ? 'fa-eye' : 'fa-eye-slash', 'fa', 'layer-eye']" @click.stop.prevent="layerDisplayControl(item)"></i>
                </div>
              </div>
            </div>
          </draggable>

        </div>
      </el-tab-pane>
      <el-tab-pane label="组件" name="widget">
        <div class="addBtnDiv">
          <el-button type="success" @click="showWidgetDialog">添加组件</el-button>
        </div>

        <!-- 创建地图选择弹出框dialog -->
        <el-dialog title="添加组件" :visible.sync="widgetVisible" size="tiny" :close-on-press-escape="false" :close-on-click-modal="false">
          <div class="data-map-main">
            <div class="edit-log">
              <!-- 组件列表 -->
              <el-row :gutter="10">
                <el-col :xs="12" :sm="12" :md="6" :lg="6" v-for="item in widget_list" :key="item.name">
                  <div :class="[ 'widget', item.checked? 'widget-checked' : '']" @click="widgetClick(item)">
                    <img :src="item.src" alt="" class="widget-img">
                    <div class="widget-info">{{ item.alias }}</div>
                  </div>
                </el-col>
              </el-row>
              <!-- 组件列表结束 -->
            </div>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addWidget">添 加</el-button>
          </div>
        </el-dialog>

        <div v-for="item in widgetTree" :key="item.id" v-if="item.checked" class="widget-list">
          <div class="widget-item">
            <img :src="item.src" alt="">
          </div>
          <div class="widget-item">
            {{ item.name }}
          </div>
          <div class="widget-item" @click="deleteWidget(item)"><i class="fa fa-trash"></i></div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  import draggable from 'vuedraggable'
  import Tool from '@/components/tool.vue'

  export default {
    name: 'renderConfig',
    components: {
      draggable,
    },
    computed: {
      ...mapGetters([
        'render'
      ])
    },
    data () {
      return {
        // tab页
        tabValue: 'layer',

        // 图层树
        layerTree: [],
        /*layerTree: {
         id: TBDATA00001,
         isAdded: true
         }*/
        currentLayer: {
          /*id: '',
           name: '',
           isAdded: true,
           idRendering: false,*/
        },
        _idChecked: [],

        /* 创建地图dialog */
        dialogDataVisible: false,
        datalistLoading: false,
        data_list: [],
        //  分页的配置
        pagination: {
          currentPage: 1,
          total: 0,
          pageSizes: [5, 10, 15],
          pageSize: 5,
        },
        /* 创建地图dialog */

        /* 组件dialog */
        widgetVisible: false,
        widgetTree: [],
        widget_list: [{
          src: '/static/mapDesign/img/legend.png',
          name: 'scale',
          alias: '比例尺',
          checked: false,
        },{
          src: '/static/mapDesign/img/scale.png',
          name: 'legend',
          alias: '图例',
          checked: false,
        },{
          src: '/static/mapDesign/img/measure.png',
          name: 'measure',
          alias: '测量',
          checked: false,
        },{
          src: '/static/mapDesign/img/basemap.png',
          name: 'basemap',
          alias: '底图',
          checked: false,
        }],
      };
    },
    created () {
      this.initEvent();
    },
    mounted () {

    },
    beforeDestroy () {
      this.destroyEvent();
    },
    methods: {
      ...mapActions([
        'setRenderType','addGeoJsons', 'resetGeoJsons', 'setCurrentLayerId', 'setLayers',
        'addIdChecked', 'removeIdChecked', 'addSavedLayersWidget', 'removeSavedLayersWidget'
      ]),
      initEvent () {
        this.$bus.on('update-layers', layers => {
          var _temArray = Tool.clone(layers);
          this.layerTree.push(_temArray);
         /* console.log('RenderConfig 的layerTree', this.layerTree);
           debugger*/
        });

        this.$bus.on('reset-render-config-widget-tree', () => {
          this.widgetTree = [];
        });

        this.$bus.on('add-render-config-widget-tree', obj => {
          this.widgetTree.push(obj);
        });
      },

      destroyEvent () {
        this.$bus.off('update-layers');
        this.$bus.off('reset-render-config-widget-tree');
        this.$bus.off('add-render-config-widget-tree');
      },

      /* tab页点击事件 */
      tabClick (tab) {
        this.tabValue = tab.name;
      },

      /* 清空当前存储的状态 */
      clearCurrentLayer () {
        /* 当前组件 */
        this.currentLayer = {};
        this.layerTree.forEach((item) => {
          item.isRendering = false;
        });

        /* vuex 中 render */
        this.setCurrentLayerId('');
        this.setLayers(Tool.clone(this.layerTree));
      },

      /* 对图层进行排序,以便于提交至后台 */
      layerDradEnd(drag) {
        console.log(drag.newIndex)
        console.log(drag.oldIndex)
      },

      /* 选择图层进行渲染 */
      renderCurrent (item) {
        if (!item.isAdded) {
          this.$message({
            showClose: true,
            message: '未显示图层不允许编辑',
            type: 'warning',
          });
          return;
        }

        item.isRendering = !item.isRendering;

        if (!this.render.currentLayerId) {  // !当前渲染ing的图层
          this.renderNewLayer(item.id);
          return;
        }

        if (this.render.currentLayerId === item.id) { // 点击图层 === 当前渲染ing的图层
          if (item.isRendering) { // 当前图层正处在编辑状态
            this.$bus.emit('show-render-set');
          } else {
            this.$bus.emit('hide-render-set');
            this.clearCurrentLayer();
          }
          this.setLayers(Tool.clone(this.layerTree));

          return;
        }

        // 点击图层 ！== 当前渲染ing的图层
        this.saveCurrentTypeRender() // 保存当前样式
        this.currentLayer = Tool.clone(item); // 先将当前渲染的样式从Simple.vue || Grade.vue || Type.vue 中缓存到vuex中(缓存另一个位置是RenderHeader.vue组件点击保存按钮的时候)
        this.renderNewLayer(item.id);

        console.log('this.render.savedLayers.over_layer: ',this.render.savedLayers.over_layer);
        console.log('item.isRendering', item.isRendering);
      },

      /* 点击图层 ！== 当前渲染ing的图层，保存下当前渲染的样式至vuex */
      saveCurrentTypeRender () {
        let renderType = this.render.renderType;
        this.$bus.emit('save-current-'+ renderType +'-render')
      },

      /* 渲染选中的新图层 */
      renderNewLayer (id) { // 数据id， 数据名称
        this.setCurrentLayerId(id);
        var overLayers = this.render.savedLayers.over_layer;
        this.$bus.emit('show-render-set');
        this.$bus.emit('init-render-set', id, overLayers);
        this.$bus.emit('init-label');

        this.layerTree.forEach((item) => {
          if (item.id === id) {
            item.isRendering = true;
          } else {
            item.isRendering = false;
          }
        });

        this.setLayers(Tool.clone(this.layerTree));  // 更新vuex
      },

      /* 点击眼睛的图层是否正处在编辑状态 */
      currentLayerIsRendering (id) {
        var layers = this.render.layers, isRendering = false;

        layers.some((item) => {
          if (item.id === id) {
            isRendering = item.isRendering;
          }
        });

        return isRendering;
      },

      layerDisplayControl (item) {
        item.isAdded = !item.isAdded;
        var isRendering = this.currentLayerIsRendering(item.id);
        if (item.isAdded) { // 图层眼睛睁着
          this.$bus.emit('show-layer', item.id);
          this.$bus.emit('show-label');

          if (isRendering) {  // 当前图层正处在编辑状态
            this.$bus.emit('show-render-set');
            console.log('显示 set')
          }
        } else {            // 图层眼睛闭着
          this.$bus.emit('hide-layer', item.id);
          this.$bus.emit('hide-label');


          if (isRendering) {  // 当前图层正处在编辑状态
            this.$bus.emit('hide-render-set');
            console.log('隐藏 set')
          }
        }

        this.$bus.emit('render-map-resize'); // renderSet容器宽度变化，map也要适应新的宽度
        this.setLayers(Tool.clone(this.layerTree));
      },

      /* 添加新图层数据 */
      addData () {
        this.dialogDataVisible = false;
        var idChecked = this._idChecked;

        if (idChecked.length <= 0) {
          this._idChecked = [];
          return;
        }
        console.log('渲染界添加数据后RenderConfig this._idChecked ', idChecked);
        console.log('渲染界添加数据后vuex this.render.idChecked ', this.render.idChecked);


        console.log('idChecked', idChecked);
        this.$bus.emit('add-data-render', idChecked);
        this._idChecked = [];  // 将当前组件数组清空
      },

      /* 创建新数据弹框 */
      showDataDialog () {
        this._resetIdChecked();
        this.dialogDataVisible = true;
        this.fetchData(this.pagination.pageSize, this.pagination.currentPage);
      },

      /* 获取用户数据集 */
      fetchData (pageSize, currentPage) {
        this.datalistLoading = true;
        var url = 'mapdesign/maps/layers?limit='+ pageSize + '&page='+ currentPage;
        this.$http.get(url).then((res) => {
          this.datalistLoading = false;
          if (!res.data.data) {
            console.log('ajax 获取数据集 接口数据结构变化: ' + res.data);  //  清空数据，并且重置数据条数为0、默认显示第一页，
            this.data_list = [];
            this.pagination.total = 0;
            this.pagination.currentPage = 1;
            return;
          }

          var temArray = []; // temArray = 用户数据列表，为每一个列表加checked字段，初始为false，用于判断是否勾选
          res.data.data.forEach((item) => {
            item.checked = false;
            temArray.push(item);
          });

          this.pagination.total = temArray.length;
          this.data_list = temArray;
        }).catch((err) => { console.log(err) });
      },

      /* 数据列表每页总数改变 */
      handleSizeChange (size) {
        this.fetchData(size, this.pagination.currentPage);
      },

      /* 数据列表当前页数改变 */
      currentDataChange(currentPage){
        this.fetchData(this.pagination.pageSize, currentPage);
      },

      /* 根据数据类型给不同的icon */
      choseDataIcon (item) {
        var type = Tool.gType(item.geotype), imgSrc = '';
        if (!item.geotype) {
          imgSrc = '/static/mapDesign/img/table.png';
          return imgSrc;
        }
        switch (type) {
          case 'point':
            imgSrc = '/static/mapDesign/img/esriGeometryPoint.png';  break;

          case 'line':
            imgSrc = '/static/mapDesign/img/esriGeometryPolyline.png'; break;

          case 'polygon':
            imgSrc = '/static/mapDesign/img/esriGeometryPolygon.png';  break;
        }

        return imgSrc;
      },

      _addIdChecked (obj) {
        let temArray = []; // 存放id

        this._idChecked.forEach((item) => {
          temArray.push(item.layerid);
        });

        var index = temArray.indexOf(obj.layerid);
        if (index < 0) {
          this._idChecked.push(obj);
        }
      },

      _removeIdChecked (obj) {
        var vm = this;
        this._idChecked.some((item, index) => {
          if (obj.layerid === item.layerid) {
            vm._idChecked.splice(index, 1);
            return;
          }
        });
      },

      _resetIdChecked () {
        this._idChecked = [];
      },

      dataClick (item) {
        item.checked = !item.checked;
        if (item.checked) {
          this._addIdChecked(item);
          this.addIdChecked( Tool.clone(item) );
        } else {
          this._removeIdChecked(item);
          this.removeIdChecked( Tool.clone(item) );
        }
        console.log(this.render.idChecked);
      },

      /* 添加新图层数据 */
      addWidget () {
        this.widgetVisible = false;
        var vm = this, tempArray = [];
        this.widgetTree.forEach(item => {
          tempArray.push(item.name)
        });

        this.widget_list.forEach(item => {
          if (item.checked && tempArray.indexOf(item.name) < 0) {
            vm.widgetTree.push(item);
            vm.$bus.emit('add-map-widget', item);
            vm.addSavedLayersWidget(Tool.clone(item));  // 添加组件到vuex
          }
        });

        console.log(this.render.savedLayers.widget)
      },

      deleteWidget (obj) {
        var vm = this;
        this.widgetTree.forEach((item, index) => {
          if (obj.name === item.name) {
            vm.widgetTree.splice(index, 1);
            vm.$bus.emit('remove-map-widget', item);
            vm.removeSavedLayersWidget(Tool.clone(item));  // 删除组件到vuex
            vm.widget_list.some(_item => {
              if (obj.name === _item.name) {
                _item.checked = false;
                return;
              }
            });
          }
        });

        console.log(this.render.savedLayers.widget)
      },

      showWidgetDialog () {
        this.widgetVisible = true;
        this.$bus.emit('create-map-widget');
      },

      widgetClick (item) {
        item.checked = !item.checked;
        console.log(this.render.idChecked);
      },

    },
  }
</script>

<style scoped>
  .map-info {
    text-align: center;
  }

  .addBtnDiv {
    text-align: center;
    margin: 15px 0;
  }

  .layer {
    display: table;
    width: 100%;
    margin: 10px 0;
    box-sizing: border-box;
    border-radius: 5px;
    cursor: pointer;
  }

  /* 当前图层是否正在渲染 */
  .layer-not-rendering {
    border: 1px solid #eee;
  }

  .layer-rendering {
    border: 1px solid #AAA;
  }

  /* 当前图层是否添加到地图上 */
  .is-not-added {
    opacity: 0.5;
  }

  .is-added {
    opacity: 1;
  }

  .layer:hover {
    border: 1px solid #AAA;
  }

  .box {
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    display: inline-block;
    color: #20a0ff;
  }

  .box img {
    width: 30px;
    height: 30px;
    vertical-align: middle;
  }

  .box i {
    vertical-align: middle;
    padding: 5px;
  }

  /* 数据 */
  .data-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 5%;
    cursor: pointer;
    box-sizing: border-box;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
  }

  .data-items img {
    width: 50px;
    height: 50px;
  }

  .data-checked {
    border: 1px solid #AAA;
  }

  .geo-data-container:hover {
    border: 1px solid #AAA;
  }

  .not-geo-data-container:hover {
    border: 1px solid darkred;
  }

  .data-pagination {
    text-align: center;
    margin-top: 25px;
  }

  /* 组件 */
  .widget {
    text-align: center;
    padding: 15px;
    cursor: pointer;
    box-sizing: border-box;
  }

  .widget-checked {
    border: 1px solid #AAA;
  }

  .widget:hover {
    border: 1px solid #AAA;
  }

  .widget-list {
    display: flex;
    align-content: space-between;
    align-items: center;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    cursor: pointer;
  }

  .widget-list:hover {
    border: 1px solid #AAA;
    box-sizing: border-box;
  }

  .widget-item {
    flex-grow: 1;
    text-align: center;
  }

  .widget-item img {
    display: inline-block;
    width: 37px;
    height: 37px;
  }
</style>
