/*
	jCode v2.5
	Created By Carter Ervin under the managment of Nerds@Work Unincorporated
	Created under the CreativeCommons license
	Credited to the Coding Composition subteam
	Free to use, but if modified, DO NOT CREDIT AS YOUR WORK! To modify, you can add it as a plugin or by forking it on GitHub
	Tutorials can be found on www.codingcomposition.com/jcode/tutorials
*/
(function(func){
	if(typeof window === "undefined") {
		func(false);
	} else {
		func(window);
	}
})(function(window){
	if(window === false) {
		console.log('jCode encountered a page error, returning false');
		return false;
	}
	
	var document = window.document;
	
	//Code suit will follow functional programming standards
	var jCode = function(selector, context){
		//Return a copy of the library
		return new jCode.mod.init(selector, context);
	}
	//Make a prototype shortcut
	jCode.mod = jCode.prototype = {
		//Make a constructor function
		constructor: jCode,
		//Make check functions
		isArray: function(value){return value instanceof Array || value instanceof HTMLCollection || value instanceof NodeList || value instanceof HTMLOptionsCollection;},
		isFunc: function(value){return typeof value === "function";},
		isObj: function(value){return typeof value === "object" && typeof value !== "function";},
		isElem: function(value){return value instanceof Element;},
		isString: function(value){return typeof value === "string";},
		isNum: function(value){return typeof value === "number";},
		isBool: function(value){return typeof value === "boolean";},
		isNull: function(value){return value === null},
		notDef: function(value){return typeof value === "undefined"},
		emptyArr: function(arr) {return arr.length < 1;},
		isEmpty: function(value) {return value === "";},
		//A loop function for elements (name deceiving?)
		loop: function(context, func) {
			var i;
			if(func == null) {
				console.error("jCode:\n\tFunction not supplied to be called!");
				return false;
			}
			for(i = 0; i < context.length; i++) {
				func.call(this, context[i]);
			}
			return this;
		},
		stringify: function(value){
			return jCode.stringify(value);
		}
	}
	//Build extension function
	jCode.mod.beefUp = function(obj,name) {
		var prop;
		if(this.notDef(name)) {
			for(prop in obj) {
				this[prop] = obj[prop];
			}
		} else {
			this[name] = obj;
		}
		return this;
	};
	//Build extension function for root
	jCode.beefUp = function(obj,name) {
		var prop;
		if(this.mod.notDef(name)) {
			for(prop in obj) {
				this[prop] = obj[prop];
			}
		} else {
			this[name] = obj;
		}
		return this;
	};
	function get(query) {
		if(document.querySelectorAll === null) {
			//Run IE support script (Only ID, Class, and Tag)
			if(query.indexOf("#") > -1) {
				query = query.replace("#","");
				return document.getElementById(query);
			} else if(query.indexOf(".") > -1) {
				query = query.replace(".","");
				return document.getElementsByClassName(query);
			} else {
				return document.getElementsByTagName(query);
			}
		} else {
			//Supports all CSS selectors
			return document.querySelectorAll(query);
		}
	}
	
	//Build INIT function
	var init = jCode.mod.init = function(selector, context) {
		//Check what the selector is
		//HANDLE: $(function(){})
		if(this.isFunc(selector)) {
			window.onload = selector;
			//Allow for after function (Maybe you want to use a function without a selector)
			return this;
			//HANDLE: $("SELECTOR")
		} else if(this.isString(selector)) {
			this[0] = get(selector);
			this.elem = get(selector);
			this.length = 1;
			//HANDLE: $(ARRAY);
		} else if(this.isArray(selector)) {
			this[0] = [];
			var i = 0;
			for(i;i < selector.length; i++) {
				this[0].push(selector[i]);
			}
			//HANDLE: $(ELEMENT)
	  	} else if(this.isElem(selector) && !this.isArray(selector)) {
			this[0] = selector;
			this.elem = selector;
			this.length = 1;
			//Set document if none apply
		} else if(window instanceof Document) {
			this[0] = document;
			this.length = 1;
		}
		//Check for context (selector will already be set)
		//Context will be an element selection expression or any other supported expression
		if(context === null) {
			if(this.isObj(selector)) {
				console.error('jCode:\n\tSelector is an object but no definition of what to do with it, bailing out!');
				return false;
			} else {
				return this;
			}
		} else {
			var elem = this[0];
			//See what the context is
			//HANDLE: $(selector, num);
			if(this.isNum(context)) {
				this[0] = elem[context-1];
				//HANDLE: $(selector, [array])
			} else if(this.isArray(context)) {
				/*
					else if(context.length === 2) {
					for(var i = context[0] - 1; i < context[1]; i++) {
						elemArr.push(elem[i]);
					}
					this[0] = elemArr;
				}
				*/
				//context is an array, return the elements from part A to part B
				if(context.length < 2) {
					this[0] = elem[context[0]];
				} else if(context.length >= 2) {
					//Apply only to the selected elements
					for(var i = 0; i < context.length; i++) {
						this[0].push(elem[context[i]]);
					}
				}
				//HANDLE: $(obj, expression)
			} else if(this.isString(context)) {
				//Check if the context matches any of the preset expressions (Cannot be used as chain/function)
				var contextArr = [];
				//Make copy of the selector
				var obj = selector;
				if(context === "keys") {
					for(var key in obj) {
						contextArr.push(key);
					}
					return contextArr;
				} else if(context === "values") {
					for(var key in obj) {
						contextArr.push(obj[key]);
					}
					return contextArr;
				} else if(context === "keyval") {
					var keys = [], vals = [];
					for(var key in obj) {
						keys.push(key);
						vals.push(obj[key]);
					}
					contextArr.push(keys, vals);
					return contextArr;
				} else if(context === "elem") {
					var elemArr = []
					for(var i = 0; i < elem.length; i++) {
						elemArr.push(elem[i]);
					}
					this[0] = elemArr;
					return elemArr;
				} else {
					if(this.notDef(this[context])) {
						//Check jCode for it
						if(this.notDef(jCode[context])) {
							//This library doesn't exist, throw error to console but return the library
							return this;
						} else {
							return jCode[context];
						}
					} else {
						return this[context];
					}
				}
			} else {
				//Guarunteed run because separate flow from element selection check
				return this;
			}
			//Check for argument 3 (Possible library selection)
			if(arguments[2] != null && (this.isNum(context) || this.isArray(context))) {
				var arg = arguments[2];
				if((this.isNum(context) || this.isArray(context)) && this.isString(arg)) {
					//Elements should already be set, so return the library with that title
					return this[arg];
				}
			}
		}
		//This is backup in case the if flow is skipped
		return this;
	}
	//Allow for backtracking of root functions
	init.prototype = jCode.mod;
	
	//Build library function
	//NOTE: When seeing if the parameter is null, use "==" and not "===" because it is not completely null type, just null as in empty
	/*
		Format for functions:
			var arr = [], elems = this[0];
			this.loop(elems, function(elem){
				
			});
			return !this.emptyArr(arr) ? arr : this;
	*/
	jCode.mod.beefUp({
		//Chainable if parameter supplied
		text: function(value) {
			value = this.stringify(value);
			var arr = [], elems = this[0];
			this.loop(elems, function(elem){
				if(this.notDef(value)) {
					arr.push(elem.textContent);
				} else {
					elem.textContent = value;
				}
			});
			//Check to see if the array is filled
			return !this.emptyArr(arr) ? arr : this;
		},
		html: function(value) {
			value = this.stringify(value);
			var arr = [], elems = this[0];
			this.loop(elems, function(elem){
				if(this.notDef(value)) {
					arr.push(elem.innerHTML);
				} else {
					elem.innerHTML = value;
				}
			});
			return !this.emptyArr(arr) ? arr : this;
		},
		css: function(property, value) {
			var arr = [], elems = this[0];
			this.loop(elems, function(elem){
				if(this.notDef(value)) {
					if(this.isObj(property)) {
						var keys = jCode(property,"keys");
						var vals = jCode(property,"values");
						for(var i = 0;i < keys.length; i++) {
							elem.style[keys[i]] = vals[i];
						}
					} else {
						arr.push(elem.style[property]);
					}
				} else {
					elem.style[property] = value;
				}
			});
			return !this.emptyArr(arr) ? arr : this;
		},
		attr: function(name, value) {
			var arr = [], elems = this[0];
			this.loop(elems, function(elem){
				if(this.notDef(value)) {
					arr.push(elem.getAttribute(name));
				} else {
					elem.setAttribute(name,value);
				}
			});
			return !this.emptyArr(arr) ? arr : this;
		},
		toggleAttr: function(name, value, optval) {
			var elems = this[0];
			this.loop(elems, function(elem){
				if(this.notDef(optval)) {
					if(elem.getAttribute(name) === value) {
						elem.setAttribute(name,optval);
					} else {
						elem.setAttribute(name,value);
					}
				} else {
					if(elem.getAttribute(name) === value) {
						elem.setAttribute(name,'');
					} else {
						elem.setAttribute(name,value);
					}
				}
			});
			return this;
		},
		on: function(type, func, func2, cap) {
			var elems = this[0];
			this.loop(elems, function(elem){
				//LT IE 8 Support for event listeners
				if (document.body.attachEvent) {
					//Run through and use the attachEvent property
					if (this.isFunc(func2)) {
						if (type === "click") {
							cap = true;
							elem.attachEvent('mousedown', func, cap);
							elem.attachEvent('mouseup', func2, cap);
						} else if (type === "hover") {
							cap = true;
							elem.attachEvent('mouseover', func, cap);
							elem.attachEvent('mouseout', func2, cap);
						} else {
							console.warn('jCode\n\nFunction 2 supplied but type cannot use it, returning null');
						}
					} else {
						cap = func2;
						elem.attachEvent(type, func, cap);
					}
				} else if (document.body.addEventListener) {
					if (this.isFunc(func2)) {
						if (type === "click") {
							cap = true;
							elem.addEventListener('mousedown', func, cap);
							elem.addEventListener('mouseup', func2, cap);
						} else if (type === "hover") {
							cap = true;
							elem.addEventListener('mouseover', func, cap);
							elem.addEventListener('mouseout', func2, cap);
						} else {
							console.warn('jCode\n\nFunction 2 supplied but type cannot use it, returning null');
						}
					} else {
						cap = func2;
						elem.addEventListener(type, func, cap);
					}
				}
			});
			return this;
		},
		bind: function(type, func, func2, cap) {
			//alias to $(selector).on();
			return this.on(type, func, func2, cap);
		},
		//Not chainable
		contains: function(type, opt) {
			var arr = [], elems = this[0];
			this.loop(elems, function(elem){
				if(this.notDef(opt)) {
					//Containment arrays
					var syms = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', ']', '\\', '{', '}', '|', ';', '\'', '\"', ':', ', ', '.', '\/', '<', '>', '?', '`', '~'],
						num = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
						alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
						caps = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
						alphaNum = [],
						numCap = [];
					alphaNum.push(alpha,num);
					numCap.push(caps, num);
					//Checking
					if(type === "symbols") {
						for(var j = 0; j < syms.length; j++) {
							if(elem.indexOf(syms[j]) > -1) {
								arr.push(true);
							} else {
								arr.push(false);
							}
						}
					} else if(type === "num") {
						for(var j = 0; j < num.length; j++) {
							if(elem.indexOf(num[j]) > -1) {
								arr.push(true);
							} else {
								arr.push(false);
							}
						}
					} else if(type === "alpha") {
						for(var j = 0; j < alpha.length; j++) {
							if(elem.indexOf(alpha[j]) > -1) {
								arr.push(true);
							} else {
								arr.push(false);
							}
						}
					} else if(type === "alphaCap") {
						for(var j = 0; j < caps.length; j++) {
							if(elem.indexOf(caps[j]) > -1) {
								arr.push(true);
							} else {
								arr.push(false);
							}
						}
					} else if(type === "alphaNum") {
						for(var j = 0; j < alphaNum.length; j++) {
							if(elem.indexOf(alphaNum[j]) > -1) {
								arr.push(true);
							} else {
								arr.push(false);
							}
						}
					} else if(type === "alphaCapNum") {
						for(var j = 0; j < numCap.length; j++) {
							if(elem.indexOf(numCap[j]) > -1) {
								arr.push(true);
							} else {
								arr.push(false);
							}
						}
					} else {
						console.log('No type defined, returning everything');
						this.contains("symbols");
						this.contains("num");
						this.contains("alpha");
						this.contains("alphaCap");
						this.contains("alphaNum");
						this.contains("alphaCapNum");
					}
				} else {
					for(var j = 0; j < opt.length; j++) {
						if(elem.indexOf(opt[j]) > -1) {
							arr.push(true);
						} else {
							arr.push(false);
						}
					}
				}
			});
			return arr;
		},
		//Chainable
		click: function(func, func2) {
			this.on("click",func,func2,false);
			return this;
		},
		toggleClass: function(name) {
			var elems = this[0];
			this.loop(elems, function(elem){
				if(name.indexOf(" ") >= 0) {
					name = name.split(" ");
				}
				if(this.isArray(name)) {
					for(var i = 0; i < name.length; i++) {
						if(elem.classList.contains(name[i])) {
							elem.classList.remove(name[i]);
						} else {
							elem.classList.add(name[i]);
						}
					}
				} else {
					if(elem.classList.contains(name[i])) {
						elem.classList.remove(name[i]);
					} else {
						elem.classList.add(name);
					}
				}
			});
			return this;
		},
		addClass: function(name){
			var elems = this[0];
			this.loop(elems, function(elem){
				if(name.indexOf(" ") >= 0) {
					name = name.split(" ");
				}
				if(this.isArray(name)) {
					for(var i = 0; i < name.length; i++) {
						elem.classList.add(name[i]);
					}
				} else {
					elem.classList.add(name);
				}
			});
			return this;
		},
		removeClass: function(name){
			var elems = this[0];
			this.loop(elems, function(elem){
				if(name.indexOf(" ") >= 0) {
					name = name.split(" ");
				}
				if(this.isArray(name)) {
					for(var i = 0; i < name.length; i++) {
						elem.classList.remove(name[i]);
					}
				} else {
					elem.classList.remove(name);
				}
			});
			return this;
		},
		//Not chainable
		find: function(find, rep) {
			var arr = [], elems = this[0];
			console.info("Function is getting redesigned to be better, won't be chainable after redesign.");
			this.loop(elems, function(elem){
				
			});
			return this;
		},
		val: function() {
			var arr = [], elems = this[0];
			this.loop(elems, function(elem){
				arr.push(elem.value);
			});
			return elems.length <= 1 ? elems[0].value : arr;
		},
		//Chainable
		append: function(text) {
			var elems = this[0];
			text = this.stringify(text);
			this.loop(elems, function(elem){
				//Put the text before the element
				//Create elements
				//var newTag;
				//Temporary, creates inline elements for organization, implementation for finding tags unknown
				//newTag = document.createElement("SPAN");
				//Append text
				//newTag.innerHTML = text;
				//elem.appendChild(newTag);
				
				//Append to existing innerHTML
				elem.innerHTML += text;
			});
			return this;
		},
		prepend: function(text) {
			var elems = this[0];
			text = this.stringify(text);
			this.loop(elems, function(elem){
				//Put the text before the element
				//Create elements
				//var newTag;
				//Use inline since implementation for finding beginning tags with nesting unknown
				//newTag = document.createElement("SPAN");
				//Append text
				//newTag.innerHTML = text;
				//elem.insertBefore(newTag, elem.childNodes[0]);
				
				//Save content from elements
				var content = elem.innerHTML;
				//Put in the prepended text
				elem.innerHTML = text + content;
			});
			return this;
		},
		after: function(text) {
			var elems = this[0];
			text = this.stringify(text);
			this.loop(elems, function(elem){
				//Put the text after the element in it's lineup
				//Create elements
				var newTag;
				//Scan text for the outer element to be for the element
				if(text.indexOf("<") < 0) {
					//The text has no HTML, put it inside of a <span>
					newTag = document.createElement("SPAN");
				} else if(text.indexOf("<") > -1) {
					var tagName = text.split("");
					for(var i = 0; i < tagName.length; i++) {
						if(tagName[i] === ">") {
							tagName.splice(i);
							tagName.splice(0,1);
							tagName = tagName.join("");
							newTag = document.createElement(tagName);
							break;
						}
					}
				}
				//Append text
				newTag.innerHTML = text;
				elem.parentNode.insertBefore(newTag, elem.nextSibling);
			});
			return this;
		},
		before: function(text) {
			var elems = this[0];
			text = this.stringify(text);
			this.loop(elems, function(elem){
				//Put the text before the element
				//Create elements
				var newTag;
				//Scan text for the outer element to be for the element
				if(text.indexOf("<") < 0) {
					//The text has no HTML, put it inside of a <span>
					newTag = document.createElement("SPAN");
				} else if(text.indexOf("<") > -1) {
					var tagName = text.split("");
					for(var i = 0; i < tagName.length; i++) {
						if(tagName[i] === ">") {
							tagName = tagName.splice(i);
							tagName = tagName.splice(0,1);
							tagName = tagName.join();
							newTag = document.createElement(tagName);
							break;
						}
					}
				}
				//Append text
				newTag.innerHTML = text;
				elem.parentNode.insertBefore(newTag, elem);
			});
			return this;
		}
	});
	
	//Set up drawing plugin
	jCode.beefUp({
		context: function(type) {
			var that = jCode.mod;
			var elems = that[0];
			if(type === null) {
				type = "2d";
			} else if(typeof type === "string") {
				type = "2d";
			}
			var ctxArr = [];
			that.loop(elems, function(elem){
				ctxArr.push(elem.getContext(type));
			});
			return ctxArr;
		},
		config: function(ctx, config) {
			//Build config keys and values
			var conf = jCode.obj.keyVal(config);
			var confKey = conf[0];
			var confVal = conf[1];
			//Find the settings and set their values for the drawing
			if(confKey.length !== confVal.length) {
				return false;
			}
			for(var i = 0; i < confKey.length; i++) {
				if(confKey[i] === "bgcolor") {
					ctx.fillStyle = confVal[i];
				} else if(confKey[i] === "color") {
					ctx.strokeStyle = confVal[i];
				} else if(confKey[i] === "shadowColor") {
					ctx.shadowColor = confVal[i];
				} else if(confKey[i] === "shadowBlur") {
					ctx.shadowBlur = confVal[i];
				} else if(confKey[i] === "shadowOffsetX") {
					ctx.shadowOffsetX = confVal[i];
				} else if(confKey[i] === "shadowOffsetY") {
					ctx.shadowOffsetY = confVal[i];
				} else if(confKey[i] === "lineCap") {
					ctx.lineCap = confVal[i];
				} else if(confKey[i] === "lineJoin") {
					ctx.lineJoin = confVal[i];
				} else if(confKey[i] === "lineWidth") {
					ctx.lineWidth = confVal[i];
				} else if(confKey[i] === "miterLimit") {
					ctx.miterLimit = confVal[i];
				} else if(confKey[i] === "font") {
					ctx.font = confVal[i];
				} else if(confKey[i] === "textAlign") {
					ctx.textAlign = confVal[i];
				} else if(confKey[i] === "textBaseline") {
					ctx.textBaseline = confVal[i];
				}
			}
			//Loop finished, returns true
			return true;
		},
		line: function(sx,sy,dx,dy,config){
			var that = jCode.mod;
			//Do the entire canvas context here
			var ctx = that.context("2d");
			var conf = that.config;
			//Start drawing the line based on parameters
			that.loop(ctx, function(ctx){
				ctx.moveTo(sx,sy);
				ctx.lineTo(dx,dy);
				conf(ctx,config);
				ctx.stroke();
			});
			//Return section of library
			return that;
		},
		rect: function(sx,sy,dx,dy,config){
			var that = jCode.mod;
			var ctx = that.context("2d");
			var conf = that.config;
			//Draw rectangle based on parameters. Run through config object
			that.loop(ctx, function(ctx){
				//Find the settings and set their values for the drawing
				ctx.rect(sx,sy,dx,dy);
				conf(ctx, config);
				ctx.fill();
				ctx.stroke();
			});
		},
		circle: function(sx,sy,radius,config) {
			var that = jCode.mod;
			var ctx = that.context("2d");
			var conf = that.config;
			that.loop(ctx, function(ctx){
				ctx.arc(sx,sy,radius,0,2*Math.PI);
				conf(ctx, config);
				ctx.fill();
				ctx.stroke();
			});
		},
		square: function(sx,sy,dx,dy,size,config) {
			var that = jCode.mod;
			var ctx = that.context("2d");
			var conf = that.config;
			//Draw a square
			that.loop(ctx, function(ctx){
				ctx.moveTo(dx,dy);
				conf(ctx, config);
				ctx.fillRect(sx,sy,size,size);
				ctx.strokeRect(sx,sy,size,size);
			});
			return that;
		},
		rightTriangle: function(sx,sy,leg1,leg2,hyp,config) {
			var that = jCode.mod;
			var ctx = that.context("2d");
			var conf = that.config;
			//Draw a right triangle
			that.loop(ctx, function(ctx){
				ctx.moveTo(sx,sy);
				conf(ctx, config);
				
			});
			return that;
		},
		triangle: function(sx,sy,s1,s2,s3,config) {
			var that = jCode.mod;
			var ctx = that.context("2d");
			var conf = that.config;
			//Draw a triangle
			that.loop(ctx, function(ctx){
				ctx.moveTo(sx,sy);
				conf(ctx, config);
				
			});
			return that;
		}
	},"draw");
	
	//Build functions that don't use selector(s)
	//Math functions
	jCode.math = {
		random : function (floor, ceil) {
			var randomNumber = Math.floor((Math.random() * ceil) + floor);
			return randomNumber;
		},
		//Missing sides must be deemed null when used
		triSides : function (right, a, b, c, A, B, C) {
			if (right) {
				if (a === null) {
					//Solve for a
					//Use sine
					return Math.asin(B / C);
				} else if (b === null) {
					//Solve for b
					//Use cosine
					return;
				} else if (c === null) {
					//Solve for c
					//Use tangent
					return;
				}
			} else {
				if (a === null) {
					return;
				} else if (b === null) {
					return;
				} else if (c === null) {
					return;
				}
			}
		},
		degToRad : function(num) {
			return num*Math.PI/180;
		},
		radToDeg : function(num) {
			return num/180*Math.PI;
		},
		cos : function(angle) {
			return Math.cos(angle/180*Math.PI);
		},
		sin : function(angle) {
			return Math.sin(angle/180*Math.PI);
		},
		tan : function(angle) {
			return Math.tan(angle/180*Math.PI);
		},
		factorial : function(num) {
			var n = num;
			for(n;n > 0;n--) {
				if(n === num) {
					continue;
				} else {
					num = num * n;
				}
			}
			return num;
		}
	};
	//Check console to see userAgent details
	jCode.detectOS = function() {
		var agent = navigator.userAgent,
			os = null,
			cos = ["Android", "iOS", "iOS", "iOS", "Mac OS X", "Mac OS", "Linux", "Linux", "Windows 10", "Windows 10", "Windows 8.1", "Windows 8.1", "Windows 8", "Windows 8", "Windows 7", "Windows 7", "Windows Vista", "Windows Vista", "Windows XP", "Windows XP","BlackBerryOS","BlackBerryOS"],
			rel = ["Android", "iPhone","iPad","iPod", "Mac OS X", "Macintosh", "Linux", "X11", "åWindows NT 10.0", "Windows 10", "Windows NT 6.3", "Windows 8.1", "Windows 8", "Windows 8", "Windows 7", "Windows 7", "Windows NT 6.0", "Windows Vista", "Windows NT 5.1", "Windows XP","BB10","PlayBook"],
			id = 0;
		console.log(agent);
		for (id; id < cos.length; id++) {
			if (agent.search(rel[id]) > -1) {
				os = cos[id];
				break;
			}
		}
		console.log(os);
		return os;
	};
	jCode.concat = function() {
		var args = arguments, argArr = [], concat = "";
		for(var i = 0; i < args.length; i++) {
			argArr.push(String(args[i]));
		}
		//Now that array is built, loop through the already parsed strings and concatenate them
		for(var i = 0; i < argArr.length; i++) {
			concat = concat + argArr[i];
		}
		return concat;
	};
	jCode.ajax = {
		reqObj : function() {
			var xobj;
			if (window.XMLHttpRequest) {
				xobj = new XMLHttpRequest();
			} else {
				xobj = new ActiveXObject("Microsoft.XMLHTTP");
			}
			return xobj;
		},
		get : function(file, asynch, callback){
			//Handle LT IE 6
			var xobj;
			if (window.XMLHttpRequest) {
				xobj = new XMLHttpRequest();
			} else {
				xobj = new ActiveXObject("Microsoft.XMLHTTP");
			}
			//Move on when xobj is set
			xobj.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					if(jCode.checkCallback(callback)) {
						callback();
					} else {
						console.log('jCode\n\nCallback not a function, not calling');
					}
					return this.responseText;
				} else if(status == 404) {
					console.warn('jCode\n\nPage was not found');
					return;
				} else if(status == 403) {
					console.warn('jCode\n\nPage is forbidden');
					return;
				}
			};
			xobj.open("GET", file, asynch);
			xobj.send();
		},
		post : function(file, asynch, filter, callback){
			//Handle LT IE 6
			var xobj;
			if (window.XMLHttpRequest) {
				xobj = new XMLHttpRequest();
			} else {
				xobj = new ActiveXObject("Microsoft.XMLHTTP");
			}
			//Move on when xobj is set
			xobj.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					if(jCode.checkCallback(callback)) {
						callback();
					} else {
						console.log('jCode\n\nCallback not a function, not calling');
					}
					return this.responseText;
				} else if(status == 404) {
					console.warn('jCode\n\nPage was not found');
					return;
				} else if(status == 403) {
					console.warn('jCode\n\nPage is forbidden');
					return;
				}
			};
			xobj.open("POST", file, asynch);
			xobj.send(filter);
		}
	};
	jCode.wait = function(func,time) {
		if(typeof func !== "function") {
			console.log('Supplied parameter isn\'t a function!');
			return;
		} else {
			if(time === null) {
				time = 1000;
			}
			return setTimeout(func,time);
		}
	};
	jCode.loopWait = function(func,time) {
		if(typeof func !== "function") {
			if(typeof func === "string" && time === null && func === "clear") {
				return clearInterval(jCode.looping);
			}
			console.log('Supplied parameter isn\'t a function!');
			return;
		} else {
			console.log('Looping Timed Function Stored under jCode.looping, using clearInterval($.looping) or $.loopWait(\'clear\') to clear!');
			if(time === null) {
				time = 1000;
			}
			jCode.looping = setInterval(func,time);
			return this;
		}
	};
	jCode.timing = {
		setFunc : function(func,time) {
			this.func = func;
			this.time = time;
		},
		clearFunc : function() {
			delete this.func;
			delete this.time;
		},
		exec : function(type) {
			if(type === null) {
				type = true;
			}
			if(type) {
				//Single waited execute
				setTimeout(this.func,this.time);
			} else {
				//Looping waited execute
				jCode.looping = setInterval(this.func,this.time);
			}
		},
		clearLoop : function() {
			clearInterval(jCode.looping);
		}
	};
	jCode.objStore = {};
	jCode.obj = {
		objCreator: {
			create: function(obj,name) {
				if(obj === null || typeof obj !== "object") {
					console.error('jCode\n\nObject Parameter is either not found or isn\'t an object!');
					return null;
				}
				if(name === null || typeof name !== "string") {
					console.error('jCode\n\nName Parameter is either not found or isn\'t an object!');
					return null;
				}
				//Store in jCode.objStore
				jCode.objStore[name] = obj;
				return true;
			},
			delete: function(name) {
				if(name === null || typeof name !== "string") {
					console.error('jCode\n\nName Parameter is either not found or isn\'t an object!');
					return null;
				}
				//Might be used later, don't delete
				jCode.objStore[name] = null;
			},
			addTo: function(obj, name) {
				if(obj === null || typeof obj !== "object") {
					console.error('jCode\n\nObject Parameter is either not found or isn\'t an object!');
					return null;
				}
				if(name === null || typeof name !== "string") {
					console.error('jCode\n\nName Parameter is either not found or isn\'t an object!');
					return null;
				}
				//Add as prototype
				jCode.objStore[name].prototype = obj;
				return true;
			}
		},
		keys: function(obj) {
			var objArr = [];
			for(var key in obj) {
				objArr.push(key);
			}
			return objArr;
		},
		values: function(obj) {
			var objArr = [];
			for(var key in obj) {
				objArr.push(obj[key]);
			}
			return objArr;
		},
		/*
			Used to get both keys and values of an object. 
			Returns an array containing the keys and values, looks like this:
			arr[0] = keys[num];
			arr[1] = values[num];
		*/
		keyVal: function(obj) {
			var keyArr = [], valArr = [];
			for(var key in obj) {
				keyArr.push(key);
				valArr.push(obj[key]);
			}
			var assocArr = [keyArr, valArr];
			return assocArr;
		}
	};
	jCode.include = function(type) {
		//use arguments passed through to include scripts
		var args = arguments || {}, include = [];
		if(type === null) {
			console.log('Please define a type as defaulting will cause bugs');
			return false;
		}
		if(type === "js") {
			if(args === {} || args === null) {
				console.log("No names input, returning false");
				return false;
			} else {
				for(var i = 1; i < args.length; i++) {
					//Start building array of scripts to include in page
					include.push(args[i]);
				}
				//Run through include array and apply them to a script tag
				(function appendScript() {
					if(document.body) {
						for(var i = 0; i < include.length; i++) {
							var script = document.createElement('script');
							console.log("Successfully Imported \"" + include[i] + "\"!");
							script.setAttribute('src',include[i]);
							document.body.appendChild(script);
						}
					} else {
						window.requestAnimationFrame(appendScript);
					}
				})();
			}
		} else if(type === "css") {
			if(args === {} || args === null) {
				console.log("No names input, returning false");
				return false;
			} else {
				var media;
				if(typeof args[1] !== "number") {
					media = 'screen';
					for(var i = 1; i < args.length; i++) {
						include.push(args[i]);
					}
				} else {
					media = args[1];
					for(var i = 2; i < args.length; i++) {
						include.push(args[i]);
					}
				}
				
				for(var i = 0; i < include.length; i++) {
					var link = document.createElement('link');
					link.setAttribute('media',media);
					link.setAttribute('rel','stylesheet');
					link.setAttribute('href',include[i]);
					document.getElementsByTagName('head')[0].appendChild(link);
				}
			}
		} else if(type === "other") {
			//Run document includes, returns the text pulled down
			if(args === {} || args === null) {
				console.log('No document paths specified, returning false!');
				return false;
			} else {
				for(var i = 1; i < args.length; i++) {
					include.push(args[i]);
				}
				for(var i = 0; i < include.length; i++) {
					var link = document.createElement('link');
					function supportsImports(){
						return 'import' in link;
					}
					//Check if imports are supported here
					if(supportsImports()) {
						link.setAttribute('rel','import');
						link.setAttribute('href',include[i]);
						document.getElementsByTagName('head')[0].appendChild(link);
						return document.querySelector('link[rel="import"]').import;
					} else {
						//Use AJAX calling
						var doc;
						var xhttp = new XMLHttpRequest();
						xhttp.onreadystatechange = function() {
							if (this.readyState == 4 && this.status == 200) {
								doc = this.responseText;
							}
						}      
						xhttp.open("GET", include[i], true);
						xhttp.send();
						return;
					}
				}
			}
		} else {
			console.log('Type doesn\'t exist: ' + type);
			return false;
		}
		
	};
	jCode.enum = function(name,enumObj) {
		//name will be the place where the stuff is stored, can be left out, but must assign this to a variable to save the enum
		if(typeof enumObj === "undefined" && typeof name === "object") {
			var Enum = Object.keys(name);
			var eVal = Object.values(name);
			var obj = {};
		} else if(typeof enumObj === "object" && typeof name === "string") {
			var Enum = Object.keys(enumObj);
			var eVal = Object.values(enumObj);
			var obj = {};
		}
		console.log(Enum);
		//Return the object instead of assigning, but assign backup just in case
		for(var i = 0; i < Enum.length; i++) {
			obj[Enum[i]] = eVal[i];
		}
		if(typeof name !== "string") {
		} else {
			jCode[name] = obj;
		}
		return obj;
	};
	jCode.stringify = function(value) {
		//Run the type check
		var that = this.mod;
		if(that.isElem(value)) {
			//Turn into a string based on tags
			var elemString = value.outerHTML;
			return elemString;
		} else if(that.isArray(value)) {
			//Check for second arg to find set
			if(that.isNum(arguments[1])) {

			} else {
				value = value.join();
				value = value.replace(",","|");
				//value will have commas replaced with "|" for regular expression parsing outside of the function (ID)
				return value;
			}
		} else {
			//This is a string
			return value;
		}
		//Backup in case the array one jumps out
		return value;
	};
	jCode.gradeScale = function(grade) {
		var that = this.mod;
		if(!that.isNum(grade)) {
			//Grade input isn't number
			return "Not a number";
		} else {
			if(grade >= 100) {
				return "A+... How the hell?";
			}
			if(grade >= 93) {
				return "A";
			} else if(grade <= 93 && grade >= 90) {
				return "A-";
			} else if(grade <= 90 && grade >= 87) {
				return "B+";
			} else if(grade <= 87 && grade >= 83) {
				return "B";
			} else if(grade <= 83 && grade >= 80) {
				return "B-";
			} else if(grade <= 80 && grade >= 77) {
				return "C+";
			} else if(grade <= 77 && grade >= 73) {
				return "C";
			} else if(grade <= 73 && grade >= 70) {
				return "C-";
			} else if(grade <= 70 && grade >= 67) {
				return "D+";
			} else if(grade <= 67 && grade >= 63) {
				return "D";
			} else if(grade <= 63 && grade >= 60) {
				return "D-";
			} else if(grade <= 60) {
				return "F";
			}
			 else {
				 return "Grade input value not valid";
			 }
		}
	};
	
	//Set jCode to shortcut
	window.$ = jCode;
	//Make jCode visible
	window.jCode = jCode
	
	//Set up noConflict function to make jCode relieve the $ variable.
	var _$ = window.$, _jCode = window.jCode;
	jCode.noConflict = function(){
		if (window.$ === jCode) {
			window.$ = _$;
		}
		return jCode;
	}
	//Return the library to set to window (Deprecated as it doesn't work)
	return jCode;
});