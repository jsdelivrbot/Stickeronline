<template>
	<div class="sqlbuilder">
		<div class="sqlb_head">
			<div class="sqlbh_name">{{sqldata.name}}</div>
			<div class="sqlbh_group"><span class="sqlbhspan" @click="addcondition"><i class="fa fa-plus"></i>条件</span><span class="sqlbhspan"> <i class="fa fa-plus"></i>分组</span></div>
		</div>
		<div class="sqlb_content" v-for="(con, key, index) in wherelist" :key="index">
			<div class="sqlbc_col">

				<el-row v-if="index==0" :gutter="20">
					<el-col :span="8">
						<el-select class="full-width" v-model="con.selectfield" placeholder="字段" @change="sqlblur">
							<el-option v-for="item in sqldata.fields" :key="item.name" :label="item.aliasname" :value="item.name">
								<span style="float: left">{{ item.aliasname }}</span>
								<span style="float: right; color: #8492a6; font-size: 13px">{{ item.typename }}</span>
							</el-option>
						</el-select>
					</el-col>
					<el-col :span="8">
						<el-select class="full-width" v-model="con.selectcondition" placeholder="条件" @change="sqlblur">
							<el-option v-for="c in conditions" :key="c.name" :label="c.name" :value="c.value"></el-option>
						</el-select>
					</el-col>
					<el-col :span="8">
						<el-input class="full-width" v-model="con.selectvalue" placeholder="请输入内容" @blur="sqlblur"></el-input>
					</el-col>
				</el-row>
				<el-row v-else :gutter="20">
					<el-col :span="2" class="sqlbh_col">
						<el-switch class="sqlbh_switch" @change="sqlblur" v-model="con.selectparataxis" on-color="#009688" off-color="#FEC106" on-text="AND" off-text="OR">
						</el-switch>
					</el-col>
					<el-col :span="6">
						<el-select class="full-width" v-model="con.selectfield" placeholder="字段" @change="sqlblur">
							<el-option v-for="item in sqldata.fields" :key="item.name" :label="item.aliasname" :value="item.name">
								<span style="float: left">{{ item.aliasname }}</span>
								<span style="float: right; color: #8492a6; font-size: 13px">{{ item.typename }}</span>
							</el-option>
						</el-select>
					</el-col>
					<el-col :span="8">
						<el-select class="full-width" v-model="con.selectcondition" placeholder="条件" @change="sqlblur">
							<el-option v-for="c in conditions" :key="c.name" :label="c.name" :value="c.value"></el-option>
						</el-select>
					</el-col>
					<el-col :span="6">
						<el-input class="full-width" v-model="con.selectvalue" placeholder="请输入内容" @blur="sqlblur"></el-input>
					</el-col>
					<el-col :span="2" class="sqlbh_col">
						<button type="primary" @click="delcondition(index)" class="deleteX" >X</button>
					</el-col>
				</el-row>

			</div>

		</div>
	</div>
</template>

<script>
var squel = require("squel");
	export default {
		name: 'sqlbuilder',
		props: {
			sqldata: {
				type: Object,
				default: function() {
					return {

          }
				},
        require: true
			},

		},
		data() {
			return {
        wherelist: [
          {
            selectfield: "",
            selectcondition: "",
            selectvalue: "",
          }
        ],
				conditions: [{
					"name": "大于",
					"value": "> ?"
				}, {
					"name": "小于",
					"value": "< ?"
				}, {
					"name": "等于",
					"value": "= ?"
				},{
					"name": "等于",
					"value": "= ?"
				}]
			}
		},
		methods: {
      initEvent() {
          debugger
        var that = this;
        this.$bus.on('initSQLBuilder', (obj) => {
          that.wherelist=that.sqldata.wherelist;
        });

      },
			//根据表名获取所有字段
			getFieldsById(tid) {
				var that = this;
				var url = this.$http.defaults.baseURL + 'datacenter/datas/' + tid + '/field';
				that.$http.get(url).then((r) => {
					if(r.data.result) {
						that.$set(that.sqldata, "fields", r.data.data);
					}
				});
			},
      //添加新的条件
			addcondition() {
          debugger
				this.wherelist.push({
					selectfield: "",
					selectcondition: "",
					selectvalue: "",
					selectparataxis: true,
          isAnd:true
				});
			},
      //添加新数据表以后的添加新条件
      addnewcondition(){
        debugger
      },
      //删除某个条件组列表
			delcondition(index){
				this.wherelist.splice(index,1);
			},
      //条件语句选择完成 失去焦点事件
			sqlblur(){
				console.log("失去焦点："+this.wherelist[0].selectfield);
				console.log("失去焦点："+this.wherelist[0].selectcondition);
				console.log("失去焦点："+this.wherelist[0].selectvalue);
				console.log("表名："+this.sqldata.id);
			},
		},
		computed: {

		},

		created() {

		},
    //页面初始化根据表名查询字段
		mounted() {
		    debugger
      this.wherelist=this.sqldata.wherelist;
			this.getFieldsById(this.sqldata.id)
      console.log(this.sqldata)
      this.initEvent();

		}
	}
</script>

<style scoped>
	.sqlbuilder {
		padding: 10px 10px 6px;
		/*border: 1px solid #DCC896;*/
		/*background: rgba(250, 240, 210, .5);*/
		/*margin: 5px;*/
	}

	.sqlb_head {
		height: 48px;
		width: 100%;
		line-height: 48px;
		/*position: relative;*/
    background: #f8f8f8;
    border-radius: 4px;
	}

	.sqlbh_name {
		float: left;
    margin-left:10px;
	}

	.sqlbh_group {
		float: right;
    margin-right:10px;
	}

	.sqlbh_group span {
		display: inline-block;
		margin: 0 5px;
		font-size: 12px;
		width: 50px;
		text-align: center;
		border-radius: 3px;
		height: 25px;
		line-height: 25px;
	}

	.sqlbhspan {
		color: #fff;
		background-color: #009688;
	}

	.sqlbh_group span:hover {
		cursor: pointer;
	}

	.sqlbh_group i {
		margin: 0 2px;
	}

	.el-select-dropdown__item.selected {
		color: black !important;
		background-color: #fff !important;
	}

	.sqlbc_col {
    height: 48px;
    width: 100%;
    line-height: 48px;
    /* position: relative; */
    background: #f8f8f8;
    border-radius: 4px;
    /* background: #f8f8f8; */
    margin-top: 5px;
	}

	.sqlbh_col {
		line-height: 48px;
		text-align: center;
	}

	.sqlbh_switch {
		line-height: 35px;
	}
	.sqlb_content{
		/*margin: 5px;*/
	}
  .deleteX{
    outline: none;
    border: 0;
    background: #f8f8f8;
    color: #009688;
    font-weight: bold;
    font-size: 18px;
  }
  .dbm_table{
    margin-top:8px;
  }
</style>
