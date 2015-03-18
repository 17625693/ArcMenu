;
(function() {
	function arcMenu(opt) {
		// 点击的按钮
		if ((typeof opt.menu_btn) === "string") {
			this.menu_btn = document.getElementById(opt.menu_btn);
		} else if (typeof opt.menu_btn === "object") {
			this.menu_btn = opt.menu_btn;
		};

		if ((typeof opt.menu_box) === "string") {
			this.menu_box = document.getElementById(opt.menu_box);
		} else if (typeof opt.menu_box === "object") {
			this.menu_box = opt.menu_box;
		};
		// 菜单项的父元素
		// 起始角度,第一象限 逆时针计算
		this.start_angel = opt.start_angel;
		// 菜单的总角度 0到360
		this.total_angel = opt.total_angel;
		this.distance = opt.distance;
		this.active=false;
		var that = this;
		// 所有的菜单项
		this.menus = (function() {
			var nodes = that.menu_box.childNodes;
			var eleNodes = [];
			for (var i = 0; i < nodes.length; i++) {
				if (nodes[i].nodeType === NODE_TYPE_ELEMENT) {
					eleNodes.push(nodes[i]);
				}
			}
			return eleNodes;
		})();
		// 用于保存角度间隔
		this.angle = parseInt(this.total_angel) / (this.menus.length - 1);
		// 每个菜单的旋转角度
		this.menu_angle = [];
		// 每个菜单的left
		this.x = [];
		// 每个菜单的top
		this.y = [];
		// 初始化
		this.init();
	}

	arcMenu.prototype.init = function() {
		var that = this;

		// 计算旋转每个图标
		forEach(that.menus,function(ele,i) {
			that.menu_angle[i] = (parseInt(that.start_angel) + that.angle * (i)) * Math.PI / 180;
			that.x[i] = (that.distance * Math.sin(that.menu_angle[i]));
			that.y[i] = (that.distance * Math.cos(that.menu_angle[i]));
			ele.style.webkitTransform='rotate(' + (90 - that.menu_angle[i] * 180 / Math.PI) + 'deg)'
		});

		that.menu_btn.removeEventListener('click', clickHandler,false);
	
		var clickHandler = function(e) {
			if(that.active){
				that.setPos(0);
			}else{
				that.setPos(1);
			}
			that.active=!that.active;
		};

		that.menu_btn.addEventListener('click', clickHandler,false);
	};

	// 设置位置
	arcMenu.prototype.setPos = function(pos) {
		var menus = this.menus;
		var that=this;
		forEach(menus, function(item, i) {
			item.style.left = (pos === 0 ? 0 : that.y[i]) + "px";
			item.style.top = (pos === 0 ? 0 : -that.x[i]) + "px";
		})
	};
	window.arcMenu = arcMenu;

	// 借用angularjs部分源码
	var isArray = Array.isArray;

	function isFunction(value) {
		return typeof value === 'function';
	}

	function isString(value) {
		return typeof value === 'string';
	}

	function isArrayLike(obj) {
		if (obj == null) {
			return false;
		}

		var length = obj.length;

		if (obj.nodeType === NODE_TYPE_ELEMENT && length) {
			return true;
		}

		return isString(obj) || isArray(obj) || length === 0 ||
			typeof length === 'number' && length > 0 && (length - 1) in obj;
	}

	function forEach(obj, iterator, context) {
		var key, length;
		if (obj) {
			if (isFunction(obj)) {
				for (key in obj) {
					if (key != 'prototype' && key != 'length' && key != 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
						iterator.call(context, obj[key], key, obj);
					}
				}
			} else if (isArray(obj) || isArrayLike(obj)) {
				var isPrimitive = typeof obj !== 'object';
				for (key = 0, length = obj.length; key < length; key++) {
					if (isPrimitive || key in obj) {
						iterator.call(context, obj[key], key, obj);
					}
				}
			} else if (obj.forEach && obj.forEach !== forEach) {
				obj.forEach(iterator, context, obj);
			} else {
				for (key in obj) {
					if (obj.hasOwnProperty(key)) {
						iterator.call(context, obj[key], key, obj);
					}
				}
			}
		}
		return obj;
	}

	var NODE_TYPE_ELEMENT = 1;
	var NODE_TYPE_ATTRIBUTE = 2;
	var NODE_TYPE_TEXT = 3;
	var NODE_TYPE_COMMENT = 8;
	var NODE_TYPE_DOCUMENT = 9;
	var NODE_TYPE_DOCUMENT_FRAGMENT = 11;
})()