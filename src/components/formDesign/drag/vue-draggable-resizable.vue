<template>
	<div class="vdr" :class="{ draggable: draggable, resizable: resizable, active: active }"
		@mousedown.stop.prevent="elmDown" :style="style" @click.stop="stop" >
		<!--	@dblclick="fillParent" -->
		<slot></slot>
		<div class="handle"
			v-if="resizable"
			v-for="handle in handles"
			:class="'handle-' + handle"
			:style="{ display: active ? 'block' : 'none'}"
			@mousedown.stop.prevent="handleDown(handle, $event)">
		</div>
		<span v-if="active" class="delete-box tool-icon deactivated" @mousedown.stop.prevent="deleteBox">Ｘ</span>
	</div>
</template>

<script>
	export default {
		replace: true,
		name: 'vue-draggable-resizable',
		props: {
			draggable: {
				type: Boolean,
				default: true
			},
			resizable: {
				type: Boolean,
				default: true
			},
			w: {
				type: Number,
				default: 200,
				validator: function(val) {
					return val > 0
				}
			},
			h: {
				type: Number,
				default: 200,
				validator: function(val) {
					return val > 0
				}
			},
			minw: {
				type: Number,
				default: 50,
				validator: function(val) {
					return val > 0
				}
			},
			minh: {
				type: Number,
				default: 20,
				validator: function(val) {
					return val > 0
				}
			},
			x: {
				type: Number,
				default: 0,
				validator: function(val) {
					return val >= 0
				}
			},
			y: {
				type: Number,
				default: 0,
				validator: function(val) {
					return val >= 0
				}
			},
			oid: {
				type: Number,
				default: 0,
				validator: function(val) {
					return val >= 0
				}
			},

			handles: {
				type: Array,
				default: function() {
					return ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml']
				}
			},
			axis: {
				type: String,
				default: 'both',
				validator: function(val) {
					return ['x', 'y', 'both'].indexOf(val) !== -1
				}
			},
			grid: {
				type: Array,
				default: function() {
					return [1, 1]
				}
			},
			parent: {
				type: Boolean,
				default: true
			},
			maximize: {
				type: Boolean,
				default: true
			}
		},
		created: function() {
			this.parentX = 0
			this.parentW = 9999
			this.parentY = 0
			this.parentH = 9999

			this.mouseX = 0
			this.mouseY = 0

			this.lastMouseX = 0
			this.lastMouseY = 0

			this.mouseOffX = 0
			this.mouseOffY = 0

			this.elmX = 0
			this.elmY = 0

			this.elmW = 0
			this.elmH = 0
		},
		mounted: function() {
			document.documentElement.addEventListener('mousemove', this.handleMove, true)
			document.documentElement.addEventListener('mousedown', this.deselect, true)
			document.documentElement.addEventListener('mouseup', this.handleUp, true)

			if(this.minw > this.w) this.width = this.minw

			if(this.minh > this.h) this.height = this.minh

			if(this.parent) {
				const style = window.getComputedStyle(this.$el.parentNode, null)

				const parentW = parseInt(style.getPropertyValue('width'), 10)
				const parentH = parseInt(style.getPropertyValue('height'), 10)

				this.parentW = parentW
				this.parentH = parentH

				if(this.w > this.parentW) this.width = parentW

				if(this.h > this.parentH) this.height = parentH

				if((this.x + this.w) > this.parentW) this.width = parentW - this.x

				if((this.y + this.h) > this.parentH) this.height = parentH - this.y
			}

			this.$emit('resizing', this.left, this.top, this.width, this.height)
		},
		beforeDestroy: function() {
			document.documentElement.removeEventListener('mousemove', this.handleMove, true)
			document.documentElement.removeEventListener('mousedown', this.deselect, true)
			document.documentElement.removeEventListener('mouseup', this.handleUp, true)
		},
		data: function() {
			return {
				top: this.y,
				left: this.x,
				width: this.w,
				height: this.h,
				resizing: false,
				dragging: false,
				active: false,
				opacity: 1,
				handle: null,
				zIndex: 1,
				currentzIndex:0,

			}
		},
		methods: {
      stop(){

      },
			deleteBox(){
				this.$emit('removeBox',this.oid);
			},
			elmDown: function(e) { //
				const tag = e.target.tagName.toLowerCase()

				if(tag !== 'textarea' && tag !== 'input') {
					if(!this.active) {

						this.active = true
						this.currentzIndex = this.zIndex;
						this.zIndex = 999;

						this.$emit('activated', this);

					}

					this.elmX = parseInt(this.$el.style.left)
					this.elmY = parseInt(this.$el.style.top)
					this.elmW = this.$el.offsetWidth || this.$el.clientWidth
					this.elmH = this.$el.offsetHeight || this.$el.clientHeight

					if(this.draggable) {
						this.opacity = 0.6
						this.dragging = true
					}
				}
			},
			deselect: function(e) {
				let target = e.target || e.srcElement;

//				console.log(target);
/* 原版 在点击除了控件之外的地方都取消选中状态
				let regex = new RegExp('handle-([trmbl]{2})', '');

				if(target !== this.$el && !regex.test(target.className)) {
					if(this.active) {
						this.active = false

						this.$emit('deactivated', this)
					}
				}
*/
				// 只能是在点击了其他的控件或者点击了画布时（含有deactivated这个类的元素都会触发），选中状态才消失
				let regex = new RegExp('deactivated');
				if(target !== this.$el && regex.test(target.className)) {
					if(this.active) {
						this.active = false
						this.zIndex = this.currentzIndex + 1;
						this.currentzIndex = 0;
						this.$emit('deactivated', this)
					}
				}

			},
			handleDown: function(handle, e) {

				this.handle = handle

				if(e.stopPropagation) e.stopPropagation()
				if(e.preventDefault) e.preventDefault()

				this.resizing = true
			},
			fillParent: function(e) { // 双击铺满父类
				if(!this.parent || !this.resizable || !this.maximize) return

				let done = false

				const animate = () => {
					if(!done) {
						window.requestAnimationFrame(animate)
					}

					if(this.axis === 'x') {
						if(
							this.width === this.parentW && this.left === this.parentX
						) done = true
					} else if(this.axis === 'y') {
						if(
							this.height === this.parentH && this.top === this.parentY
						) done = true
					} else if(this.axis === 'both') {
						if(
							this.width === this.parentW &&
							this.height === this.parentH &&
							this.top === this.parentY &&
							this.left === this.parentX
						) done = true
					}

					if(this.axis === 'x' || this.axis === 'both') {
						if(this.width < this.parentW) {
							this.width++
								this.elmW++
						}

						if(this.left > this.parentX) {
							this.left--
								this.elmX--
						}
					}

					if(this.axis === 'y' || this.axis === 'both') {
						if(this.height < this.parentH) {
							this.height++
								this.elmH++
						}

						if(this.top > this.parentY) {
							this.top--
								this.elmY--
						}
					}

					this.$emit('resizing', this.left, this.top, this.width, this.height)

				}

				window.requestAnimationFrame(animate)
			},
			handleMove: function(e) {
				this.mouseX = e.pageX || e.clientX + document.documentElement.scrollLeft
				this.mouseY = e.pageY || e.clientY + document.documentElement.scrollTop

				let diffX = this.mouseX - this.lastMouseX + this.mouseOffX
				let diffY = this.mouseY - this.lastMouseY + this.mouseOffY

				this.mouseOffX = this.mouseOffY = 0

				this.lastMouseX = this.mouseX
				this.lastMouseY = this.mouseY

				let dX = diffX
				let dY = diffY

				if(this.resizing) {
					if(this.handle.indexOf('t') >= 0) {
						if(this.elmH - dY < this.minh) this.mouseOffY = (dY - (diffY = this.elmH - this.minh))
						else if(this.elmY + dY < this.parentY) this.mouseOffY = (dY - (diffY = this.parentY - this.elmY))
						this.elmY += diffY
						this.elmH -= diffY
					}

					if(this.handle.indexOf('b') >= 0) {
						if(this.elmH + dY < this.minh) this.mouseOffY = (dY - (diffY = this.minh - this.elmH))
						else if(this.elmY + this.elmH + dY > this.parentH) this.mouseOffY = (dY - (diffY = this.parentH - this.elmY - this.elmH))
						this.elmH += diffY
					}

					if(this.handle.indexOf('l') >= 0) {
						if(this.elmW - dX < this.minw) this.mouseOffX = (dX - (diffX = this.elmW - this.minw))
						else if(this.elmX + dX < this.parentX) this.mouseOffX = (dX - (diffX = this.parentX - this.elmX))
						this.elmX += diffX
						this.elmW -= diffX
					}

					if(this.handle.indexOf('r') >= 0) {
						if(this.elmW + dX < this.minw) this.mouseOffX = (dX - (diffX = this.minw - this.elmW))
						else if(this.elmX + this.elmW + dX > this.parentW) this.mouseOffX = (dX - (diffX = this.parentW - this.elmX - this.elmW))
						this.elmW += diffX
					}
				/***
				 * 网格布局设置 grid为数组 [w,h] 分别是单元格的宽和高
				 *
				 */
					this.left = (Math.round(this.elmX / this.grid[0]) * this.grid[0])
					this.top = (Math.round(this.elmY / this.grid[1]) * this.grid[1])

					this.width = (Math.round(this.elmW / this.grid[0]) * this.grid[0])
					this.height = (Math.round(this.elmH / this.grid[1]) * this.grid[1])

					this.$emit('resizing', this.left, this.top, this.width, this.height)
				} else if(this.dragging) {
					if(this.elmX + dX < this.parentX) this.mouseOffX = (dX - (diffX = this.parentX - this.elmX))
					else if(this.elmX + this.elmW + dX > this.parentW) this.mouseOffX = (dX - (diffX = this.parentW - this.elmX - this.elmW))

					if(this.elmY + dY < this.parentY) this.mouseOffY = (dY - (diffY = this.parentY - this.elmY))
					else if(this.elmY + this.elmH + dY > this.parentH) this.mouseOffY = (dY - (diffY = this.parentH - this.elmY - this.elmH))

					this.elmX += diffX
					this.elmY += diffY

					if(this.axis === 'x' || this.axis === 'both') {
						this.left = (Math.round(this.elmX / this.grid[0]) * this.grid[0])
					}
					if(this.axis === 'y' || this.axis === 'both') {
						this.top = (Math.round(this.elmY / this.grid[1]) * this.grid[1])
					}

					this.$emit('dragging', this.left, this.top)
				}
			},
			handleUp: function(e) {
				this.handle = null
				if(this.resizing) {
					this.resizing = false
					this.$emit('resizestop', this.left, this.top, this.width, this.height)
				}
				if(this.dragging) {
					this.dragging = false
					this.$emit('dragstop', this.left, this.top, this.width, this.height)
				}
				this.opacity = 1

				this.elmX = this.left
				this.elmY = this.top
			}
		},
		computed: {
			style: function() {
				return {
					top: this.top + 'px',
					left: this.left + 'px',
					width: this.width + 'px',
					height: this.height + 'px',
					zIndex: this.zIndex,
					opacity: this.opacity
				}
			}
		}
	}
</script>

<style scoped>
	.vdr {
		position: absolute;
		box-sizing: border-box;
	}

	.draggable:hover {
		cursor: move;
	}

	.handle {
		box-sizing: border-box;
		display: none;
		position: absolute;
		width: 10px;
		height: 10px;
		font-size: 1px;
		background: #FFF;
		border: 1px solid #28B779;
    border-radius: 50%;
	}

	.handle-tl {
		top: -5px;
		left: -5px;
		cursor: nw-resize;
	}

	.handle-tm {
		top: -5px;
		left: 50%;
		margin-left: -5px;
		cursor: n-resize;
	}

	.handle-tr {
		top: -5px;
		right: -5px;
		cursor: ne-resize;
	}

	.handle-ml {
		top: 50%;
		margin-top: -5px;
		left: -5px;
		cursor: w-resize;
	}

	.handle-mr {
		top: 50%;
		margin-top: -5px;
		right: -5px;
		cursor: e-resize;
	}

	.handle-bl {
		bottom: -5px;
		left: -5px;
		cursor: sw-resize;
	}

	.handle-bm {
		bottom: -5px;
		left: 50%;
		margin-left: -5px;
		cursor: s-resize;
	}

	.handle-br {
		bottom: -5px;
		right: -5px;
		cursor: se-resize;
	}

	.tool-icon{
		display: inline-block;
		width: 14px;
		height: 14px;
		line-height: 14px;
		font-size: 12px;
		text-align: center;
		position: absolute;
		top: 0;
		right: -17px;
		box-sizing: border-box;
		cursor: pointer;
		color: #FFF;
    background-color: #009688;
	}

</style>
