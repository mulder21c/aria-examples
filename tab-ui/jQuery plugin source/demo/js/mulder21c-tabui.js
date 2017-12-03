/**
 * Tab UI Ver 1.0
 * @author mulder21c
 */
!(function(window, $){
  "use strict";
  /**
   * @class tabUI
   * @param {object} elem HTMLElement
   */
  var TabUI = function(elem){
    this.tabContent = elem;
  }
    /**
     * defaults options
     */
  var defaults = {
      tabListSelector : ".tablist",
      tabSelector : ".tab",
      tabPanelSelector : ".tabpanel",
      activeClass : "active-tab",
      startTab : 0,
      useAria : true
    },
    keymap = {
      TAB : 9,
      ENTER : 13,
      SHIFT : 16,
      SPACE : 32,
      LEFT_ARROW : 37,
      UP_ARROW : 38,
      RIGHT_ARROW : 39,
      DOWN_ARROW : 40
    },
    /**
     * functional Key Pressed State
     */
    shiftPressed = false;

  TabUI.prototype = {
    activateTab : function(event, target){
      var me = this;
      if(target !== undefined){
        me.currIdx = $(me.tabContent).find(me.opts.tabSelector).index(target);
      }
      me.tabs[me.currIdx].focus();
    },
    selectTab : function(event){
      event = event || window.event;
      if(event){
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        event.stopPropagation();
      }
      var me = this;
      for(var i = -1, control = null, cnt = me.tabs.length; ++i < cnt;){
        control = me.tabs[i].getAttribute("aria-controls") || me.tabs[i].getAttribute("data-controls") || me.tabs[i].getAttribute("href");
        control = control ? control.replace(/.*#/, "") : "";
        if(i === me.currIdx){
          $(me.tabs[i])
            .addClass(me.opts.activeClass)
            .attr(me.opts.useAria === true ? {
                "tabindex" : "0",
                "aria-selected" : "true"
              } : {
                "tabindex" : "0"
              });
          $('#' + control)
            .addClass(me.opts.activeClass)
            .attr(me.opts.useAria === true ? {
                "aria-hidden" : "false"
              } : {});
        }else{
          $(me.tabs[i])
            .removeClass(me.opts.activeClass)
            .attr(me.opts.useAria === true ? {
                "tabindex" : "-1",
                "aria-selected" : "false"
              } : {
                "tabindex" : "-1"
              });
          $('#' + control)
            .removeAttr("tabindex")
            .removeClass(me.opts.activeClass)
            .attr(me.opts.useAria === true ? {
                "aria-hidden" : "true"
              } : {});
        }
      }
    },
    accessTabPanel : function(event){
      var me = this,
        control = null;
      if(shiftPressed === false){
        event = event || window.event;
        if($(event.currentTarget).hasClass(me.opts.activeClass) === false){
          return;
        }
        control = event.currentTarget.getAttribute("aria-controls") || event.currentTarget.getAttribute("data-controls") || event.currentTarget.getAttribute("href");
        control = document.getElementById(control.replace(/.*#/, ""));
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        control.setAttribute("tabindex", "-1");
        control.focus();
      }
    },
    nextTabFocus : function(event){
      event = event || window.event;
      if(event){
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        event.stopPropagation();
      }
      var me = this;
      me.currIdx = ++me.currIdx > me.tabs.length - 1 ? 0 : me.currIdx;
      me.activateTab.apply(me);
    },
    prevTabFocus : function(event){
      event = event || window.event;
      if(event){
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        event.stopPropagation();
      }
      var me = this;
      me.currIdx = --me.currIdx < 0 ? me.tabs.length - 1 : me.currIdx;
      me.activateTab.apply(me);
    },
    keyRelease : function(event){
      event = event || window.event;
      var keycode = event.keyCode || event.which;
      switch(keycode){
        case keymap.SHIFT :
          event.preventDefault ? event.preventDefault() : event.returnValue = false;
          event.stopPropagation();
          if(event.type === "keyup"){
            shiftPressed = false;
          }else if(event.type === "keydown"){
            shiftPressed = true;
          }
          break;
      }
    },
    bindKeyEvents : function(event){
      event = event || window.event;
      var me = this,
        keycode = event.keyCode || event.which;
      switch(keycode){
        case keymap.UP_ARROW :
        case keymap.LEFT_ARROW :
          me.prevTabFocus.apply(me, arguments);
          break;
        case keymap.DOWN_ARROW :
        case keymap.RIGHT_ARROW :
          me.nextTabFocus.apply(me, arguments);
          break;
        case keymap.SPACE :
        case keymap.ENTER :
          me.selectTab.apply(me, arguments);
          break;
        case keymap.TAB :
          me.accessTabPanel.apply(me, arguments);
          break;
      }
    }
  };
  /**
   * initalizing Tab UI
   * @function initialize
   * @memberof TabUI.prototype
   * @param {object} settings the object literal to set option values
   * @param {string} [settings.tabListSelector=".tablist"] selector for the element intented tab-list (grouping tabs)
   * @param {string} [settings.tabSelector=".tab"] selector for the elements intented tab
   * @param {string} [settings.tabPanelSelector=".tabpnel"] selector for the elements intented tab-panel
   * @param {string} [settings.activeClass="active-tab"] the class name intended to indicate active elements
   * @param {number} [settings.startTab=0] starting tab index (zero-based)
   * @param {boolean} [settings.useAria=true] whether or not to use WAI-ARIA
   */
  TabUI.prototype.initialize = function(settings){
    var me = this,
      opts = me.opts = $.extend({}, defaults, settings);
    me.tablist = me.tabContent.querySelector(opts.tabListSelector);
    me.tabs = me.tabContent.querySelectorAll(opts.tabSelector);
    me.tabpanels = me.tabContent.querySelectorAll(opts.tabPanelSelector);
    opts.startTab = opts.startTab < 0 ? 0 : opts.startTab;
    opts.startTab = opts.startTab > me.tabs.length ? me.tabs.length - 1 : opts.startTab;
    me.currIdx = opts.startTab;

    // verifying tab - tabpanel relations
    for(var i = -1, control = "", cnt = me.tabs.length, anchr; ++i < cnt;){
      control = me.tabs[i].getAttribute("data-controls") || me.tabs[i].getAttribute("href");
      control = control ? control.replace(/.*#/, "") : "";
      if(control === "" || !document.getElementById(control)){
        try{
          throw new Error("no element with matching 'data-controls' or 'href' ");
        }catch(e){
          console.log("%cmulder21c-TabUI Error: ", "font-weight:bold", e.message);
          return;
        }
      }
      if(anchr = me.tabs[i].getElementsByTagName("a")[0]){
        anchr.setAttribute("role", "presentation");
        anchr.setAttribute("tabindex", "-1");
      }

      // initailly WAI-ARA Set
      if(opts.useAria === true){
        me.tablist.setAttribute("role", "tablist");
        me.tabs[i].setAttribute("role", "tab");
        me.tabs[i].setAttribute("aria-controls", control);
        me.tabs[i].removeAttribute("data-controls");
        me.tabpanels[i].setAttribute("role", "tabpanel");
      }
    }
    $(me.tabContent).on({
      "keydown.tabUI" : function(event){
        me.bindKeyEvents.apply(me, arguments);
      },
      "click.tabUI" : function(event){
        event = event || window.event;
        me.activateTab.call(me, arguments, event.currentTarget);
        me.selectTab.apply(me, arguments);
      }
    }, me.opts.tabSelector);

    $(document).on({
      "keyup.tabUI" : function(event){
        me.keyRelease.apply(me, arguments);
      },
      "keydown.tabUI" : function(event){
        me.keyRelease.apply(me, arguments);
      }
    });

    // initailly open
    me.selectTab.apply(me);
  };

  /**
   * @function external:"jQuery.fn".TabUI
   */
  $.fn.TabUI = function(settings){
    return this.each(function() {
      new TabUI(this).initialize(settings);
    });
  };
  window.TabUI = TabUI;
})(window, jQuery);