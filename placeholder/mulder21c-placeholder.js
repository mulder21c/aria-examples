/**
 * Placeholder UI for user agents that do not support placeholder feature
 * https://github.com/mulder21c/aria-examples/tree/master/placeholder
 * @author mulder21c <publisher@publisher.name>
 * @version 1.0.0
 * @copyright 2017 Seongbong Ji (@mulder21c)
 * Licensed MIT (/blob/master/LICENSE.txt)
 */
(function(win){
	"use strict";

	win = win || window;
	
	// polyfill for Element.classList
	;(function(){
		// helpers
		var regExp = function(name){
			return new RegExp("(^| )"+ name +"( |$)");
		};
		var forEach = function(list, fn, scope){
			for (var i = 0; i < list.length; i++){
				fn.call(scope, list[i]);
			}
		};

		// class list object with basic methods
		function ClassList(element){
			this.element = element;
		}

		ClassList.prototype = {
			add: function(){
				forEach(arguments, function(name){
					if (!this.contains(name)){
						this.element.className += this.element.className.length > 0 ? " " + name : name;
					}
				}, this);
			},
			remove: function(){
				forEach(arguments, function(name){
					this.element.className =
						this.element.className.replace(name, "").replace(/\s+/g, " ").replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
				}, this);
			},
			contains: function(name) {
				return regExp(name).test(this.element.className);
			}
		};

		// IE8/9, Safari
		if (!("classList" in Element.prototype)){
			Object.defineProperty(Element.prototype, "classList", {
				get: function(){
					return new ClassList(this);
				}
			});
		}
	}());
	
	// polyfill for Function.prototype.bind
	;(function(){
		if(!Function.prototype.bind){
			Function.prototype.bind = function(oThis){
				if (typeof this !== "function"){
					// closest thing possible to the ECMAScript 5 internal IsCallable function
					throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
				}
				var aArgs = Array.prototype.slice.call(arguments, 1),
					fToBind = this,
					fNOP = function (){},
					fBound = function (){
						return fToBind.apply(this instanceof fNOP && oThis? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
					};
				fNOP.prototype = this.prototype;
				fBound.prototype = new fNOP();
				return fBound;
			};
		}
	}());

	/**
	 * merge the two objects &mdash; defaults, options
	 *
	 * @function extend
	 * @param {object} defaults
	 * @param {object} options
	 * @return {object}
	 */
	function extend(defaults, options){
		var extended = {};
		for(key in arguments){
			var argument = arguments[key];
			for(prop in argument){
				if (Object.prototype.hasOwnProperty.call(argument, prop)){
					extended[prop] = argument[prop];
				}
			}
		}
		return extended;
	}

	/**
	 * @class Placeholder
	 * @mixes methods
	 * @param {object} settings the set of options 
	 * @param {object} node the element that used to applied Placeholder
	 */
	var Placeholder = function(settings, node){
		this.initialize(settings, node)
	}

	/**
	 * This provides methods used for handling.
	 * @mixin
	 */
	var methods = {
		passEvent : function(event){
			event = event || window.event;
			var evtTarget = typeof event.target !== "undefined" ? event.target : event.srcElement;
			evtTarget.previousSibling.focus();
		},
		/**
		 * toggle to apply placeholder feature
		 * @param {object} node the HTML ELEMENT OBJECT 
		 * @param {string} cn the class name 
		 * @param {event} event event object
		 */
		togglePlaceholder : function(node, cn, event){
			if(node.value === ""){
				this.classList.remove(cn + "-hidden");
				if(!node.getAttribute("aria-describeby")){
					node.setAttribute("aria-describedby", node.nextSibling.getAttribute("id"));
				}
			}else{
				this.classList.add(cn + "-hidden");
				node.removeAttribute("aria-describedby");
			}
		}
	};

	Placeholder.prototype = {
		/**
		 * initialize placeholder
		 * @param {object} settings the set of options 
		 * @param {node} node the HTML ELEMENT OBJECT that used to applied Placeholder
		 */
		initialize : function(settings, node){
			var docFrag = document.createDocumentFragment(),
				altPlaceholder = document.createElement("span"),
				placeholderTxt = node.getAttribute("placeholder"),
				left = node.clientWidth - 10,
				_width = 0,
				id = settings["prefix"] + "-" + node.getAttribute("id").replace(/[\-\_]+/g, "") + new Date().getTime();

			settings["classname"] = settings["classname"] || (settings["prefix"] + "-" + "placeholder");

			// alternative placeholder element create
			altPlaceholder.innerText = placeholderTxt;
			altPlaceholder.setAttribute("id", id);
			altPlaceholder.setAttribute("class", settings["classname"] );
			node.setAttribute("aria-describedby", id);
			if(node.value !== ""){
				altPlaceholder.classList.add(settings["classname"] + "-hidden");
				node.removeAttribute("aria-describedby");
			}

			if(altPlaceholder.addEventListener){
				altPlaceholder.addEventListener("click", methods.passEvent, false);
				node.addEventListener("blur", methods.togglePlaceholder.bind(altPlaceholder, node, settings["classname"]), false);
			}else{			
				altPlaceholder.attachEvent("onclick", methods.passEvent);
				node.attachEvent("onblur", methods.togglePlaceholder.bind(altPlaceholder, node, settings["classname"]) );
			}
			docFrag.appendChild(altPlaceholder);
			node.parentNode.insertBefore(docFrag, node.nextSibling);
			
			// adjust position of alternative placeholder 
			_width = altPlaceholder.scrollWidth;
			altPlaceholder.style.marginLeft = -1 * _width + "px";
			altPlaceholder.style.left = -1 * (left - _width) + "px";
		}
	};

	function placeholder(settings){
		// if user agent support placeholder, then abort.
		var test = document.createElement("input");
		if(("placeholder" in test)) return;

		// default options
		var defaults = {
			selector : "input[placeholder]",
			prefix : "mulder21c"
		};

		// merge default option with user-customized option
		settings = extend(defaults, settings);
		// delay invoke, because querySelectorAll is not live
		setTimeout(function(){
			for(var i = -1, item = null, nodeList = document.querySelectorAll(settings['selector']); item = nodeList[++i];){
				new Placeholder(settings, item);
			}
		}, 250);
	};

	win.Placeholder = placeholder;
})(window);