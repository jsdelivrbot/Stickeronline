<template>

  <div id="map-index">
    <ContentLeft @getByTree="getByTreepid" @backTomapList="backTomapList" @getmapByCondition="getmapByCondition"></ContentLeft>

    <div id="map_content2" class="map_content map_content2">
      <div class="fc_title">
        <h3>{{listdata.title}}</h3>
      </div>
      <div class="fc_content" >
        <DataShowModel :child-data="defaultAddData.data" @deleteItem="deleteItem" @addItem="showCreateDialog"></DataShowModel>
      </div>
      <div class="fc_content">
        <DataShowModel :child-data="listdata.data" @lookShare="lookShare"  @goShare="shareItem" @deleteItem="deleteItem" @previewItem="previewMap" @editItem="editMap"></DataShowModel>
      </div>
    </div>
    <div id="map_content1" class="map_content map_content1">
      <el-tabs class="fc_tabs" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane class="fc_tab" label="新建地图" name="first">
          <DataShowModel :child-data="defaultAddData.data" @deleteItem="deleteItem" @addItem="showCreateDialog"></DataShowModel>
          <div class="fct1_title">从共享中心新建地图</div>
          <DataShowModel :child-data="mapdata.recentlyshare"></DataShowModel>
        </el-tab-pane>
        <el-tab-pane label="最近编辑" name="second">
          <DataShowModel :child-data="mapdata.recently" :show-list="true" @deleteItem="deleteItem"></DataShowModel>
        </el-tab-pane>
        <el-tab-pane label="共享中心" name="third">
          <DataShowModel :child-data="mapdata.exchange" :show-list="true"></DataShowModel>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 创建地图选择弹出框dialog -->
    <el-dialog :title="isDataView ? '添加数据' : '创建地图'" :visible.sync="dialogCreateMapVisible" :close-on-press-escape="false" :close-on-click-modal="false">
      <div class="data-map-main">
        <div class="edit-log">
          <el-row :gutter="10" v-if="!isDataView">
            <el-col :xs="24" :sm="24" :md="12" :lg="12">
              <el-input v-model="mapInfo.name" placeholder="请输入地图名称"></el-input>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12">
              <el-input v-model="mapInfo.description" placeholder="请输入地图描述"></el-input>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24">
              <el-input type="textarea" autosize placeholder="请输入地图标签(以逗号隔开)" v-model="mapInfo.tag" style="margin: 10px 0;">
              </el-input>
            </el-col>
          </el-row>
          <div v-if="isDataView">
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
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateMapVisible = false">取 消</el-button>
        <el-button type="primary" @click="showDataView" v-show="!isDataView">继 续</el-button>
        <el-button type="primary" @click="toRender" v-show="isDataView">创 建</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import ContentLeft from './ContentLeft.vue';
  import Tool from '@/components/tool.vue'
  import DataShowModel from '../common/DataShowModel.vue';
  import {
    mapGetters,
    mapActions
  } from 'vuex'

  export default {
    name: 'map-index',
    components: {
      ContentLeft,
      DataShowModel
    },
    data() {
      return {
        mapPath: '/mapDesign/init/',
        title: "文件夹",
        activeName: 'first',
        type:16,
        defaultAddData: {
          data: {
            data: [{
              formid: 1,
              name: "创建地图",
              type: 27,
              img: "/static/Index/img/newform.png",
              url: "/formDesign/init/new",
              usable: true,
              price: 0,
              author: "管理员",
              createdate: "2017-08-08"
            }]
          }
        },
        listdata: {
          title: "未命名文件夹",
          data: {
            url: {
              preview: "/formDesign/preview",
              edit: "/formDesign/edit",
              share: "/formDesign/init",
              delete: "formdesign/forms/delete/",
              move: ""
            },
            data: []
          }
        },
        mapdata: {
          recentlyshare: {
            url: {
              preview: "/formDesign/init",
              edit: "/formDesign/init",
              share: "/formDesign/init",
              delete: "formdesign/forms/delete/",
              move: ""
            },
            data:[]
          },
          recently: {
            url: {
              preview: "/formDesign/init",
              edit: "/formDesign/init",
              share: "/formDesign/init",
              delete: "formdesign/forms/delete/",
              move: ""
            },
            data:[]
          },
          exchange: {
            url: {
              preview: "/formDesign/init",
              edit: "/formDesign/init",
              share: "/formDesign/init",
              delete: "formdesign/forms/delete/",
              move: ""
            },
            data:[]
          }
        },
        /* 创建新地图基本信息 */
        mapInfo: {
          name: '',
          description: '',
          tag: '',
        },

        /* 创建地图dialog */
        dialogCreateMapVisible: false,
        isDataView: false,
        datalistLoading: false,
        data_list: null,
        //  分页的配置
        pagination: {
          currentPage: 1,
          total: 0,
          pageSizes: [5, 10, 15],
          pageSize: 5,
        },
        /* 创建地图dialog */
      }
    },
    computed: {
      ...mapGetters([
        'render',
      ]),
    },
    methods: {
      ...mapActions([
        'setNewMapInfo', // 保存下创建新地图的基础信息
        'addIdChecked', 'removeIdChecked', 'resetIdChecked', // 数据列表页，对用户勾选的数据进行id记录    添加， 删除， 重置
        'setCurrentId', 'setEditLog',
        'setNotFirstRender', 'setFirstRender', // 设置成非首次渲染     首次渲染
        'setCurrentMapId',   // 设置当前选中的mapid
        'setCurrentLayerId', // 正在渲染的图层id
        'resetOverLayer', // 清空vuex中
        'resetSavedLayers', // 清空vuex中
        'resetRender', // 清空vuex中存储主要的数据
      ]),

      lookShare(uuid){
        this.$router.replace({name: 'sharemap', params: {uuid}});
      },

      /* 显示创建地图弹出框 */
      showCreateDialog () {
        this.dialogCreateMapVisible = true;
        this.beforeShowCreateDialog();
      },

      /* 弹出框显示前配置 */
      beforeShowCreateDialog () {
        this.$set(this.mapInfo, 'name', '');
        this.$set(this.mapInfo, 'description', '');
        this.$set(this.mapInfo, 'tag', '');
        this.isDataView = false;
      },

      /* 用户数据列表展示 */
      showDataView () {
        if (!this.mapInfo.name) {
          this.$message({
            showClose: true,
            message: '地图名称不能为空',
            type: 'warning',
          });
          return;
        }

        this.isDataView = true;
        this.resetIdChecked();
        console.log(this.render.idChecked)
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
            imgSrc = '/static/mapDesign/img/esriGeometryPoint.png';
            break;

          case 'line':
            imgSrc = '/static/mapDesign/img/esriGeometryPolyline.png';
            break;

          case 'polygon':
            imgSrc = '/static/mapDesign/img/esriGeometryPolygon.png';
            break;
        }

        return imgSrc;
      },

      dataClick (item) {
        if (!item.geotype) return;

        item.checked = !item.checked;
        if (item.checked) {
          this.addIdChecked( Tool.clone(item) );
        } else {
          this.removeIdChecked( Tool.clone(item) );
        }
        console.log('进入渲染界面前this.render.idChecked ', this.render.idChecked);
      },

      /* 转至地图渲染页面(首次渲染) */
      toRender () {
        this.beforeToRender();
        this.$router.push('/mapdesign/new');
      },

      /* 跳转至渲染页面之前 */
      beforeToRender () {
        this.setFirstRender(); // 渲染状态改为首次渲染

        this.setCurrentLayerId(''); // 没有图层正在渲染

        this.resetSavedLayers(); // 将vuex中数据清空

        /* 在vuex中先保存下新地图的基础信息 */
        this.setNewMapInfo(this.mapInfo);
      },

      /********************************************* 二次编辑 **************************************************/
      editMap (id) {
        // 先清空vuex中状态
        this.resetRender();

        this.setCurrentMapId(id);
        this.setNotFirstRender(); // 非首次渲染
        this.$router.push(this.listdata.data.url.render  + id);
      },

      previewMap (item){
        var id = item.id;
        this.$router.push(this.listdata.data.url.preview  + id);
      },

      handleClick (tab, event) {
        console.log(tab, event);
      },

      getByTreepid (node, store, data, childids) {
        document.getElementById("map_content1").style.display = "none";
        document.getElementById("map_content2").style.display = "block";
        this.listdata.title = data.name;
        if(data.id == "999") {
          var url = 'mapdesign/maps';
          this.getMapByUrl(url, 0);
        } else {
          var url = 'mapdesign/maps/folder/' + data.id;
          this.getMapByUrl(url, 0);
        }
        this.getMapByUrl(url, 28);
      },

      getmapByCondition(type, name) {
        this.listdata.title = name;
        document.getElementById("map_content1").style.display = "none";
        document.getElementById("map_content2").style.display = "block";
        if(type == 0) { //我的地图
          var url = 'mapdesign/maps';
          this.getMapByUrl(url, type);
        }  else if(type == 2) { //已分享的表单
          var url = 'mapdesign/maps/share';
          this.getMapByUrl(url, type);
        }
      },

      getMapByUrl(url, type) {
        this.$http.get(url).then((res) => {
          console.log(type, res)

          if (!res.data) {
            console.log('判断条件res.data： ', res.data)
            return;
          }

          switch(type) {
            case 0:
              this.listdata.data.url.preview = "/mapdesign/preview/";
              this.listdata.data.url.render = "/mapdesign/render/";
              this.listdata.data.url.share = "/mapdesign/init/";
              this.listdata.data.url.delete = "mapdesign/maps/delete/";
              this.listdata.data.url.move = "";
              break;
            case 2:
              break;
            default:
          }
          this.listdata.data.data = res.data;
        });
      },

      backTomapList(evt) {
        document.getElementById("map_content2").style.display = "none";
        document.getElementById("map_content1").style.display = "block";
      },


      /* 删除地图 */
      deleteItem(id) {
        var url = "mapdesign/maps/delete/" + id;
        this.$http.get(url).then((res) => {
          if(res.data.result) {
            this.$message({
              message: res.data.message,
              type: 'success'
            });
            this.$bus.$emit("gettreedata");
            this.init();
            this.updateListData(this.listdata.data.data, id);
            this.updateListData(this.mapdata.recently.data, id);
          } else {
            this.$message.error("删除失败");
          }
        });
      },

      /* 分享地图 */
      shareItem(odata){
        let url = "map/share",
          data ={
            mapid: odata.id,
            issecret: odata.issecret,
            code: odata.code
          },
          prams = encodeURI("data="+JSON.stringify(data));
        console.log(prams);

        this.$http.post(url,prams).then((res) => {
          let uuid = res.data.data.uuid;
          console.log('分享成功',uuid);

          this.$confirm('分享成功！', '提示', {
            confirmButtonText: '去看看',
            cancelButtonText: '知道了',
            type: 'success'
          }).then(() => {
            this.$router.replace({name: 'sharemap', params: {uuid}});
          }).catch(() => {  });

        }).catch((error) => { console.log("出错了",error); });
      },

      updateListData(list, id) {
        var data = [];
        for(var item in list) {
          if(list[item].id != id) {
            data.push(list[item]);
          }
        }
        list = data;
      },

      init() {
        var that = this;
        var url = "mapdesign/maps/inits";
        that.$http.get(url).then((res) => {
          if(res.data != null) {
            that.mapdata.recently.data = res.data.data.Modify;
            that.mapdata.recentlyshare.data = res.data.data.RecentlyShare;
            that.mapdata.exchange.data = res.data.data.OtherShare;
          }
        });
      },

      /* 跳转至geo数据编辑界面 */
      toEdit(id) {
        this.setCurrentDataId(id); // 重置用户选择的数据id
        this.setEditLog(false); // 重置编辑界面右侧条的伸缩
        this.$router.push('/datacenter/edit/' + id);
      },
    },
    created() {

    },
    mounted() {
      this.init();

    }
  }
</script>

<style>
  #map-index {
    height: 100%;
    padding-left: 260px;
  }

  .map_content {
    height: 100%;
    margin-left: 1px;
  }

  .fc_title {
    height: 55px;
    box-shadow: 0 0 5px rgba(0, 0, 0, .1);
    background: #fff;
    position: relative;
    z-index: 10;
    border-bottom: 1px solid #eee;
    line-height: 55px;
  }

  .fc_title h3 {
    font-size: 16px;
    float: left;
    line-height: 55px;
    padding-left: 20px;
    color: #333;
    margin: 0;
  }

  .fc_tabs {
    padding: 15px 0 0 0;
    /*margin: 0 35px;*/
  }

  .map_content .el-tabs__active-bar {}

  .map_content .el-tabs__item {
    /*background: #eee;*/
  }

  .map_content .el-tabs__item.is-active {
    color: #009688;
    /*background: #232c32 !important;*/
  }

  .map_content1 {}

  .map_content2 {
    display: none;
  }

  .data-list {

  }

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

/*  .fct1_title {
    font-size: 14px;
    line-height: 30px;
    padding: 0 20px;
    font-weight: bold;
    width: 100%;
    float: left;
    color: #758697;
  }

  .fc_content {
    margin-top: 20px;
    width: 100%;
    float: left;
  }*/


</style>
