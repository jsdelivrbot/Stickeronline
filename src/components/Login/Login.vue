
<template>
	<div class="container demo-1">
		<div class="content">
			<div id="large-header" class="large-header">
				<canvas id="demo-canvas"></canvas>
				<div class="logo_box" id="logobox">
					<div class="box_login active lbox" id="box_login">
						<h3>MapWayOnline</h3>
						<div class="input_outer">
							<span class="u_user"></span>
							<input name="logname" autocomplete="off" class="text" v-model="loginForm.username" style="color: #FFFFFF !important" type="text"  placeholder="请输入账户">
						</div>
						<div class="fg1">
								<p v-show="showTishi1" align="center" style="margin: 0px; text-align: left; color: orange;" >{{tishi1}}</p>
						</div>
						<div class="input_outer">
							<span class="us_uer"></span>
							<input name="logpass" class="text" v-model="loginForm.password" style="color: #FFFFFF !important; position:absolute; z-index:100;" type="password" placeholder="请输入密码">
						</div>
						<div class="fg1">
								<p v-show="showTishi2" align="center" style="margin: 0px; text-align: left; color: orange;" >{{tishi2}}</p>							
						</div>
						<div class="fg-forget">	
							<div class="forget" v-on:click="toForget" style="text-align: right;">忘记密码?</div>
						</div>	
						<div class="mb2">
							<a class="act-but submit" v-on:click="login" href="javascript:;" style="color: #FFFFFF">登录</a>
						</div>
						<div class="fg-register">							
							<div class="register" v-on:click="toRegister" style="text-align: center;">还没有账号？注册</div>
						</div>
						<div>
								<p v-show="showTishi" align="center" >{{tishi}}</p>
						</div>
					</div>
					<div class="box_forget lbox" id="box_forget">
						<h3>忘记密码</h3>

						<form action="#" name="f" method="post">
							<div class="input_outer">
								<span class="u_user"></span>
								<input name="logname" autocomplete="off" class="text" v-model="forget.logname" style="color: #FFFFFF !important" type="text" @blur="check1('logname')" placeholder="请输入账户">
								<i class="el-icon-circle-check" v-show="button1" style="position: absolute;right: 10px;top: 14px;"></i>
							</div>
							<div class="fg1">
								<p v-show="showTishi1" align="center" style="margin: 0px; text-align: left; color: orange;" >{{tishi1}}</p>
							</div>
							<div class="input_outer">
								<span class="us_uer"></span>
								<input name="logpass1" class="text" v-model="forget.logpass1" style="color: #FFFFFF !important; position:absolute; z-index:100;" @blur="check1('logpass1')" value="" type="password" placeholder="请输入新密码">
								<i class="el-icon-circle-check" v-show="button2" style="position: absolute;right: 10px;top: 14px;"></i>
							</div>
							<div class="fg1">
								<p v-show="showTishi2" align="center" style="margin: 0px; text-align: left; color: orange;" >{{tishi2}}</p>
							</div>
							<div class="input_outer">
								<span class="us_uer"></span>
								<input name="logpass2" class="text" v-model="forget.logpass2" style="color: #FFFFFF !important; position:absolute; z-index:100;" @blur="check1('logpass2')" value="" type="password" placeholder="请再输入新密码">
								<i class="el-icon-circle-check" v-show="button3" style="position: absolute;right: 10px;top: 14px;"></i>
							</div>
							<div class="fg1">
								<p v-show="showTishi3" align="center" style="margin: 0px; text-align: left; color: orange;" >{{tishi3}}</p>
							</div>
							<div class="input_outer">
								<span class="us_phone"></span>
								<div  @click="send1"  style="width: 130px;height：40px;line-height: 40px;overflow: hidden;border:0.5px whitesmoke solid;border-radius: 50px;text-align: center;position: absolute;right: 0px;top: 0px;z-index: 999999999999;" >
									<code-btn  :disabled="disabled1" ref="btn1"></code-btn>
								</div>
								<input name="verify" class="text"  style="color: #FFFFFF !important; position:absolute; z-index:100;" value="" type="text" placeholder="请输入验证码">
							</div>
							<div class="fg1">
								<p v-show="showTishi4" align="center" style="margin: 0px; text-align: left; color: orange;" >{{tishi4}}</p>
							</div>
							<div class="mb2">
								<a class="act-buts submit" v-on:click="Gotoretrieve" href="javascript:;" style="color: #FFFFFF">提交</a>
							</div>
							<div class="fg-register">							
								<div class="register" v-on:click="fBackToLogin" style="text-align: center;">返回</div>
							</div>
							<!--<div class="registerbtn">
								<span class="forget_back backbtn" v-on:click="fBackToLogin"></span>
								<span class="register_next nextbtn" v-on:click="Gotoretrieve"></span>
							</div>
							<div>
								<p v-show="showTishi" align="center" >{{tishi}}</p>
							</div>-->
						</form>

					</div>
					<div class="box_register lbox" id="box_register">
						<h3>用户注册</h3>
						<form action="#" name="f" method="post">
							<div class="input_outer">
								<span class="u_user"></span>
								<input autocomplete="off" name="logname" v-model="register.logname" class="text" style="color: #FFFFFF !important" type="text"  @blur="check('logname')"  placeholder="请输入手机号">
								<i class="el-icon-circle-check" v-show="button1" style="position: absolute;right: 10px;top: 14px;"></i>
							</div>
							<div class="fg1">
								<p v-show="showTishi1" align="center" style="margin: 0px; text-align: left; color: orange;" >{{tishi1}}</p>
							</div>
							<div class="input_outer">
								<span class="us_uer"></span>
								<input name="logpass1" v-model="register.logpass1"  class="text" @blur="check('logpass1')" style="color: #FFFFFF !important; position:absolute; z-index:100;" value="" type="password" placeholder="请输入密码">
								<i class="el-icon-circle-check" v-show="button2" style="position: absolute;right: 10px;top: 14px;"></i>
							</div>
							<div class="fg1">
								<p v-show="showTishi2" align="center" style="margin: 0px; text-align: left; color: orange;" >{{tishi2}}</p>
							</div>
							<div class="input_outer">
								<span class="us_uer"></span>
								<input name="logpass2" v-model="register.logpass2"  class="text" @blur="check('logpass2')" style="color: #FFFFFF !important; position:absolute; z-index:100;" value="" type="password" placeholder="请再输入密码">
								<i class="el-icon-circle-check" v-show="button3" style="position: absolute;right: 10px;top: 14px;"></i>
							</div>
							<div class="fg1">
								<p v-show="showTishi3" align="center" style="margin: 0px; text-align: left; color: orange;" >{{tishi3}}</p>
							</div>
							<div class="input_outer">
								<span class="us_phone"></span>
								<div @click="send2" style="width: 130px;height：40px;line-height: 40px;overflow: hidden;border:0.5px whitesmoke solid;border-radius: 50px;text-align: center;position: absolute;right: 0px;top: 0px;z-index: 999999999999;">
									<code-btn :disabled="disabled2" ref="btn2"></code-btn>
								</div>
								<input name="verify" class="text" style="color: #FFFFFF !important; position:absolute; z-index:100;" value="" type="text" placeholder="请输入验证码" >
							</div>
							<div class="fg1">
								<p v-show="showTishi4" align="center" style="margin: 0px; text-align: left; color: orange;" >{{tishi4}}</p>
							</div>
							<!--<div class="registerbtn">
								<span class="register_back backbtn" v-on:click="rBackToLogin"></span>								
								<span class="register_next nextbtn" v-on:click="Gotoregister"></span>
							</div>-->
							<div class="mb2">
								<a class="act-buts submit" v-on:click="Gotoregister" href="javascript:;" style="color: #FFFFFF">注册</a>
							</div>
							<div class="fg-register">							
								<div class="register" v-on:click="rBackToLogin" style="text-align: center;">返回登录</div>
							</div>
							<!--<div>
								<p v-show="showTishi" align="center" >{{tishi}}</p>
							</div>-->
						</form>

					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {mapGetters,mapActions} from 'vuex';
	var Circ = require('./js/EasePack.min.js');
	var TweenLite = require('./js/TweenLite.min.js');
	require('./css/normalize.css');
	require('./css/demo.css');
	require('./css/component.css');

	import code from "@/components/Login/SMSVerification.vue";

	export default {
		name: 'login',
		components:{
			"code-btn":code
		},
		data() {
			return {			
				disabled1:false,
				disabled2:false,
				disabled:false,
				loginurl: '',
				loginForm: {
					username: '',
					password: ''
				},
                showLogin: true,
                showRegister: false,
                showTishi: false,
                showTishi1: false,
                showTishi2: false,
                showTishi3: false,
                showTishi4: false,
                tishi: '',
                tishi1: '',
                tishi2: '',
                tishi3: '',
                tishi4: '',
                button1:false,
                button2:false,
                button3:false,
                forget:{
					logname:'',
					logpass1:'',
					logpass2:''
				},
				register:{
					logname:'',
					logpass1:'',
					logpass2:''
				},
				rememberPassword: true,
				width: 0,
				height: 0,
				largeHeader: document.createElement("div"),
				canvas: {},
				ctx: {},
				points: {},
				target: {},
				animateHeader: true
			}
		},
		beforeUpdate(){

		},
		mounted() {
			console.log(this.$refs.btn)
			var _this=this;
			this.initHeader();
			this.initAnimation();
			this.addListeners();
			setTimeout(function() {
					_this.initstar();
				}, 10);
		},
		created() {
			this.loginurl = this.$http.defaults.baseURL + this.loginurl;
		},
		
		methods: {
			...mapActions([
				'setUserName',
				'setUserInfo'
			]),
			send1() {
                this.disabled1 = true;
                setTimeout(this.sended1, 1000);
            },
            sended1() {
            	this.disabled1 = true;
                this.$refs.btn1.run();                
            },
            send2() {
                this.disabled2 = true;
                setTimeout(this.sended2, 1000);
            },
            sended2() {
                this.$refs.btn2.run();
                this.disabled2 = true;
            },
			send() {
	            this.disabled = true;
	            setTimeout(this.sended, 2000);
	        },
	        sended(){
	        	
	            this.$refs.btn.run();
	            this.disabled = false;
	        },
			login() {
				this.showTishi= false
                this.showTishi1= false
                this.showTishi2= false
				if(this.loginForm.username == ""){
					this.tishi1 = "用户名不能为空！"
				    this.showTishi1 = true		
				}else if(this.loginForm.password == ""){
					this.tishi2 = "密码不能为空！"
				    this.showTishi2 = true
				}else{
						this.setUserName(this.loginForm.username);
						var param = "data=" + JSON.stringify(this.loginForm);
						this.$http.post(this.$http.defaults.url+'userinfo/login', param).then((res) => {
							if(res.data.result){
								this.setUserInfo(res.data.data);
								this.$http.defaults.baseURL=this.$http.defaults.url+res.data.data.id+'/'
								this.setCookies("userid",res.data.data.id)
								this.setCookies("username",res.data.data.username)
								this.$router.replace('/index')
							}else{
								this.tishi2 = res.data.message
				        		this.showTishi2 = true
							}
						});
//		
//				this.$router.push('/user/' + this.loginForm.username);  
				}
			},			 
			setCookies(name,value){
				   var Day = 1;
				   var exp= new Date(); 
				   exp.setTime(exp.getTime() + Day*24*60*60*1000);
				   document.cookie = name + "="+ escape(value) +";expires="+ exp.toGMTString();
			},
			signUp() {
				// 跳转到注册页
				this.$router.replace('/signup')

			},
			//忘记密码
			toForget() {
				this.showTishi= false
                this.showTishi1= false
                this.showTishi2= false
                this.showTishi3= false
                this.showTishi4= false
				document.getElementById("logobox").style.transitionDuration = "2s";
				document.getElementById("logobox").style.transform = "rotateY(180deg)";
				setTimeout(function() {
					document.getElementById("box_forget").style.display = "block";
					document.getElementById("box_forget").style.transform = "rotateY(180deg)";
					document.getElementById("box_login").style.display = "none";
				}, 600);
			},
			//忘记密码
			Gotoretrieve() {
				if(this.forget.logname == "" ){
					this.tishi1 = "账户不能为空"
			        this.showTishi1 = true
			    }else if(this.forget.logpass1 == "" ){
					this.tishi2 = "请填写密码！"
			        this.showTishi2 = true
			        this.button2=false	
			    }else if(this.forget.logpass2 == "" ){
					this.tishi3 = "请再次输入密码！"
			        this.showTishi3 = true
			        this.button3=false	    
				}else if(this.showTishi1 || this.showTishi2 || this.showTishi3 ){
					this.tishi4 = "修改信息有误,请重新填写！"
			        this.showTishi4 = true
			    }else{
			    	this.button1=true
					this.button2=true
					this.button3=true
			        let data = {'username':this.forget.logname,'password1':this.forget.logpass1,'password2':this.forget.logpass2};
			        var params = "data="+JSON.stringify(data);
			        this.$http.post(this.$http.defaults.url+'userinfo/retrieve',params).then((res)=>{
			            console.log(res)
			            if(res.data.result){
			                showTishi1: false
			                showTishi2: false
			                showTishi3: false
//			                showTishi4: false
			                /*this.register.logname:''
							this.register.logpass1:''
							this.register.logpass2:''*/
			                this.tishi4 = res.data.message
			                this.showTishi4 = true
			                 /*注册成功之后再跳回登录页*/
				                setTimeout(function(){
				                	this.showTishi= false
					                this.showTishi1= false
					                this.showTishi2= false
					                this.showTishi3= false
					                this.showTishi4= false
					                this.button1=false
							    	this.button2=false
							    	this.button3=false
				                	document.getElementById("logobox").style.transitionDuration = "2s";
									document.getElementById("logobox").style.transform = "rotateY(0deg)";
									this.forget = {
											logname:'',
											logpass1:'',
											logpass2:''
									};
									setTimeout(function() {
										document.getElementById("box_login").style.display = "block";
										document.getElementById("box_login").style.transform = "rotateY(0deg)";
										document.getElementById("box_forget").style.display = "none";
									}, 600);
									
				                }.bind(this),3000)
				                
			            }else{
			            	this.tishi4 = res.data.message
			                this.showTishi4 = true
			            }
			        })
			    }
			},
			check1(forget){
//				console.log('111',this.islogin());
				switch(forget){
					case "logname":
						this.button1=false
						if(!(/^1[34578]\d{9}$/.test(this.forget.logname))){
							this.tishi1 = "手机号格式错误，请重新填写！"
			                this.showTishi1 = true			              
			            }else{
			            	this.islogin(this.forget.logname);
			            }  
						break;
					case "logpass1":	
						this.button2=false
						if(!this.showTishi1&&this.forget.logname !== ""){
							if(this.forget.logpass1 === ""){
								this.tishi2 = "请输入密码！"
				                this.showTishi2 = true	
							}else if(this.forget.logpass1.length < 6 || this.forget.logpass1.length > 12){
								this.tishi2 = "密码必须为6~12位！"
				                this.showTishi2 = true
				            }else{
				            	this.showTishi2 = false	
				            	this.button2=true
				            }
				        }
						break;
					case "logpass2":
						this.button3=false
						if((!(this.showTishi1 || this.showTishi2))&&(this.forget.logname !== "" && this.forget.logpass1 !== "" )){
							if( this.forget.logpass2 == ""){
								this.tishi3 = "请再次输入密码！"
				                this.showTishi3 = true
							}else if(!(this.forget.logpass2 === this.forget.logpass1)){
								this.tishi3 = "两次输入密码不一致！"
				                this.showTishi3 = true
							}else{
				            	this.showTishi3 = false
				            	this.button3=true
				            }
						}
						break;
				}
			},
			//忘记密码返回到登录
			fBackToLogin() {
				this.showTishi1= false
			    this.showTishi2= false
			    this.showTishi3= false
			    this.showTishi4= false
			    this.button1=false
				this.button2=false
				this.button3=false
				document.getElementById("logobox").style.transitionDuration = "2s";
				document.getElementById("logobox").style.transform = "rotateY(0deg)";
				this.register = {
								logname:'',
								logpass1:'',
								logpass2:''
							};

				setTimeout(function() {
					document.getElementById("box_login").style.display = "block";
					document.getElementById("box_login").style.transform = "rotateY(0deg)";
					document.getElementById("box_forget").style.display = "none";
				}, 600);
			},
			//注册
			toRegister() {
				this.showTishi= false
                this.showTishi1= false
                this.showTishi2= false
                this.showTishi3= false
                this.showTishi4= false
				document.getElementById("logobox").style.transitionDuration = "2s";
				document.getElementById("logobox").style.transform = "rotateY(180deg)";
				setTimeout(function() {
					document.getElementById("box_register").style.display = "block";
					document.getElementById("box_register").style.transform = "rotateY(180deg)";
					document.getElementById("box_login").style.display = "none";
				}, 600);
			},
			//注册
			Gotoregister() {
				if(this.register.logname == "" ){
					this.tishi1 = "注册手机号不能为空"
			        this.showTishi1 = true
			        this.button1=false
			   	}else if(this.register.logpass1 == "" ){
					this.tishi2 = "请填写密码！"
			        this.showTishi2 = true
			        this.button2=false	
			    }else if(this.register.logpass2 == "" ){
					this.tishi3 = "请再次输入密码！"
			        this.showTishi3 = true
			        this.button3=false	    
				}else if(this.showTishi1 || this.showTishi2 || this.showTishi3 ){
					this.tishi4 = "注册信息有误,请重新填写！"
			        this.showTishi4 = true
			    }else{
			    	this.button1=true
			    	this.button2=true
			    	this.button3=true
			        let data = {'username':this.register.logname,'password1':this.register.logpass1,'password2':this.register.logpass2};
			        var params = "data="+JSON.stringify(data);
			        this.$http.post(this.$http.defaults.url+'userinfo/register',params).then((res)=>{
			            console.log(res)
			            if(res.data.result){
			                showTishi1: false
			                showTishi2: false
			                showTishi3: false
//			                showTishi4: false
			                /*this.register.logname:''
							this.register.logpass1:''
							this.register.logpass2:''*/
			                this.tishi4 = res.data.message
			                this.showTishi4 = true
			                 /*注册成功之后再跳回登录页*/
				                setTimeout(function(){
				                	this.showTishi= false
					                this.showTishi1= false
					                this.showTishi2= false
					                this.showTishi3= false
					                this.showTishi4= false
					                this.button1=false
							    	this.button2=false
							    	this.button3=false
				                	document.getElementById("logobox").style.transitionDuration = "2s";
									document.getElementById("logobox").style.transform = "rotateY(0deg)";
									this.register = {
											logname:'',
											logpass1:'',
											logpass2:''
									};
									setTimeout(function() {
										document.getElementById("box_login").style.display = "block";
										document.getElementById("box_login").style.transform = "rotateY(0deg)";
										document.getElementById("box_register").style.display = "none";
									}, 600);
									
				                }.bind(this),3000)
				                
			            }else{
			            	
			            	this.tishi4 = res.data.message
			                this.showTishi4 = true
			            }
			        })
			    }
			},
			check(register){
//				console.log('111',this.islogin());
				switch(register){
					case "logname":		
						this.button1=false
						if(!(/^1[34578]\d{9}$/.test(this.register.logname))){
							this.tishi1 = "手机号格式错误，请重新填写！"
			                this.showTishi1 = true			              
			            }else{
			            	this.islogin(this.register.logname);
			            }  
						break;
					case "logpass1":	
						this.button2=false
						if((!this.showTishi1) && (this.register.logname !== "")){
							if(this.register.logpass1 == ""){
								this.tishi2 = "请输入密码！"
				                this.showTishi2 = true	
							}else if(this.register.logpass1.length < 6 || this.register.logpass1.length > 12){
								this.tishi2 = "密码必须为6~12位！"
				                this.showTishi2 = true
				            }else{
				            	this.showTishi2 = false	
				            	this.button2=true
				            }
				        }
						break;
					case "logpass2":	
						this.button3=false
						if((!(this.showTishi1 || this.showTishi2))&&(this.register.logname !== "" && this.register.logpass1 !== "" )){
							if( this.register.logpass2 == ""){
								this.tishi3 = "请再次输入密码！"
				                this.showTishi3 = true
							}else if(!(this.register.logpass2 === this.register.logpass1)){
								this.tishi3 = "两次输入密码不一致！"
				                this.showTishi3 = true
							}else{
				            	this.showTishi3 = false
				            	this.button3=true
				            }
						}
						break;
				}
			},
			//验证手机号是否被注册过
			islogin(username){
				switch(username){
					case this.register.logname:
						let data = {'username':username};
					    var params = "data="+JSON.stringify(data);
					    this.$http.post(this.$http.defaults.url+'userinfo/register/islogin',params).then((res)=>{
					            console.log(res);					            
					           	if(res.data.result){
					           		this.tishi1 = "该手机号已被注册！"
					                this.showTishi1 = true	
					           	}else{
					           		this.showTishi1 = false
					           		this.button1=true
					           	}
  	
					      })
					    break;
					case this.forget.logname:
						let data1 = {'username':username};
					    var params = "data="+JSON.stringify(data1);
					    this.$http.post(this.$http.defaults.url+'userinfo/register/islogin',params).then((res)=>{
					            console.log(res);					            
					           	if(res.data.result){
					           		this.showTishi1 = false
					           		this.button1=true
					           	}else{
					           		this.tishi1 = "该账号不存在！"
					                this.showTishi1 = true	
					           	}
  	
					      })
					    break;
				}	    
			},
			//注册返回到登录
			rBackToLogin() {
				this.showTishi= false
				this.showTishi1= false
			    this.showTishi2= false
			    this.showTishi3= false
			    this.showTishi4= false
			    this.button1=false
				this.button2=false
				this.button3=false
				document.getElementById("logobox").style.transitionDuration = "2s";
				document.getElementById("logobox").style.transform = "rotateY(0deg)";
				this.register = {
								logname:'',
								logpass1:'',
								ogpass2:''
							};
				setTimeout(function() {
					document.getElementById("box_login").style.display = "block";
					document.getElementById("box_login").style.transform = "rotateY(0deg)";
					document.getElementById("box_register").style.display = "none";
				}, 600);
			},
			initHeader() {
				this.width = window.innerWidth;
				this.height = window.innerHeight;
				this.target = {
					x: this.width / 2,
					y: this.height / 2
				};
				this.largeHeader = document.getElementById('large-header');

				this.largeHeader.style.height = this.height + 'px';
				this.canvas = document.getElementById('demo-canvas');
				this.canvas.width = this.width;
				this.canvas.height = this.height;
				this.ctx = this.canvas.getContext('2d');

				this.points = [];
				for(var x = 0; x < this.width; x = x + this.width / 20) {
					for(var y = 0; y < this.height; y = y + this.height / 20) {
						var px = x + Math.random() * this.width / 20;
						var py = y + Math.random() * this.height / 20;
						var p = {
							x: px,
							originX: px,
							y: py,
							originY: py
						};
						this.points.push(p);
					}
				}

				//assign a circle to each point
								for(var i in this.points) {
									var c = new this.Circle(this.points[i], 2 + Math.random() * 2, 'rgba(255,255,255,0.3)');
									this.points[i].circle = c;

								}
			},
			initstar(){
					console.time("each point");
				// for each point find the 5 closest points
				for(var i = 0; i < this.points.length; i++) {
					var closest = [];
					var p1 = this.points[i];
					for(var j = 0; j < this.points.length; j++) {
						var p2 = this.points[j]
						if(!(p1 == p2)) {
							var placed = false;
							for(var k = 0; k < 5; k++) {
								if(!placed) {
									if(closest[k] == undefined) {
										closest[k] = p2;
										placed = true;
									}
								}
							}

							for(var k = 0; k < 5; k++) {
								if(!placed) {
									if(this.getDistance(p1, p2) < this.getDistance(p1, closest[k])) {
										closest[k] = p2;
										placed = true;
									}
								}
							}
						}
					}
					p1.closest = closest;
				}
				console.timeEnd("each point")


			},
			// Event handling
			addListeners() {
				if(!('ontouchstart' in window)) {
					window.addEventListener('mousemove', this.mouseMove);
				}
				window.addEventListener('scroll', this.scrollCheck);
				window.addEventListener('resize', this.resize);
			},

			mouseMove(e) {
				var posx = 0;
				var posy = 0;
				if(e.pageX || e.pageY) {
					posx = e.pageX;
					posy = e.pageY;
				} else if(e.clientX || e.clientY) {
					posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
					posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
				}
				this.target.x = posx;
				this.target.y = posy;
			},

			scrollCheck() {
				if(document.body.scrollTop > this.height) this.animateHeader = false;
				else this.animateHeader = true;
			},

			resize() {
				this.width = window.innerWidth;
				this.height = window.innerHeight;
				this.largeHeader.style.height = this.height + 'px';
				this.canvas.width = this.width;
				this.canvas.height = this.height;
			},

			// animation
			initAnimation() {
				this.animate();
				for(var i in this.points) {
					this.shiftPoint(this.points[i]);
				}
			},

			animate() {
				if(this.animateHeader) {
					this.ctx.clearRect(0, 0, this.width, this.height);
					for(var i in this.points) {
						// detect points in range
						if(Math.abs(this.getDistance(this.target, this.points[i])) < 4000) {
							this.points[i].active = 0.3;
							//this.points[i].circle.active = 0.6;
						} else if(Math.abs(this.getDistance(this.target, this.points[i])) < 20000) {
							this.points[i].active = 0.1;
							//this.points[i].circle.active = 0.3;
						} else if(Math.abs(this.getDistance(this.target, this.points[i])) < 40000) {
							this.points[i].active = 0.02;
							//this.points[i].circle.active = 0.1;
						} else {
							this.points[i].active = 0;
							//this.points[i].circle.active = 0;
						}

						this.drawLines(this.points[i]);
						//this.points[i].circle.draw();
					}
				}
				requestAnimationFrame(this.animate);
			},

			shiftPoint(p) {
				var _this = this;
				TweenLite.TweenLite.to(p, 1 + 1 * Math.random(), {
					x: p.originX - 50 + Math.random() * 100,
					y: p.originY - 50 + Math.random() * 100,
					ease: Circ.easeInOut,
					onComplete: function() {
						_this.shiftPoint(p);
					}
				});
			},

			// Canvas manipulation
			drawLines(p) {
				if(!p.active) return;
				for(var i in p.closest) {
					this.ctx.beginPath();
					this.ctx.moveTo(p.x, p.y);
					this.ctx.lineTo(p.closest[i].x, p.closest[i].y);
					this.ctx.strokeStyle = 'rgba(156,217,249,' + p.active + ')';
					this.ctx.stroke();
				}
			},

			Circle(pos, rad, color) {
				var _this = this;

				// constructor
				(function() {
					_this.pos = pos || null;
					_this.radius = rad || null;
					_this.color = color || null;
				})();

				var draw = function() {
					if(!_this.active) return;
					_this.ctx.beginPath();
					_this.ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
					_this.ctx.fillStyle = 'rgba(156,217,249,' + _this.active + ')';
					_this.ctx.fill();
				};
				//返回之后 有误mhf
				//return _this;
			},
			// Util
			getDistance(p1, p2) {
				return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
			}

		}
	}
</script>
