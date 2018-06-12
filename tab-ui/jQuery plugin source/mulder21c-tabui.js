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
    tabListSelector: ".tablist",
    tabSelector: ".tab",
    tabPanelSelector: ".tabpanel",
    activeClass: "active-tab",
    startTab: 0
  };

  var keymap = {
    TAB: 9,
    ENTER: 13,
    SHIFT: 16,
    SPACE: 32,
    LEFT_ARROW: 37,
    RIGHT_ARROW: 39
  }

  TabUI.prototype = {
    /**
     * Activate Certain Tab By IndexNumber
     * @function activateTab
     * @memberof TabUI.prototype
     * @param {number} The index number of the tab to activate (zero-based)
     */
    activateTab: function(idx){
      var me = this;
      $(me.tabs)
        .attr({
          "tabindex": "-1",
          "aria-selected": "false"
        });
      $(me.tabs[idx])
        .attr({
          "tabindex": "0",
          "aria-selected": "true"
        })
        .addClass(me.opts.activeClass);
      $("#" + me.tabs[idx].getAttribute("aria-controls"))
        .addClass(me.opts.activeClass);
    },
    /**
     * moves focus to the previous tab. 
     * If focus is on the first tab, moves focus to the last tab.
     * @function prevTabFocus
     * @memberof TabUI.prototype
     * @param {event}
     */
    prevTabFocus: function(event){
      event = event || window.event;
      event.preventDefault ? event.preventDefault() : event.returnValue = false;
      var me = this;
      var $prevElem = $(event.target).prev(".tab");
      if($prevElem.length < 1){
        $prevElem = $(me.tabs[me.tabs.length - 1]);
      }
      $(me.tabs)
         .attr("tabindex", "-1");
      $prevElem
        .attr("tabindex", "0")
        .focus();
    },
    /**
     * moves focus to the next tab. 
     * If focus is on the last tab, moves focus to the first tab.
     * @function nextTabFocus
     * @memberof TabUI.prototype
     * @param {event}
     */
    nextTabFocus: function(event){
      event = event || window.event;
      event.preventDefault ? event.preventDefault() : event.returnValue = false;
      var me = this;
      var $nextElem = $(event.target).next(".tab");
      if($nextElem.length < 1){
        $nextElem = $(me.tabs[0]);
      }
      $(me.tabs)
         .attr("tabindex", "-1");
      $nextElem
        .attr("tabindex", "0")
        .focus();
    },
    /**
     * Activates the tab
     * @function selectTab
     * @memberof TabUI.prototype
     * @param {event}
     */
    selectTab: function(event){
      event = event || window.event;
      event.preventDefault ? event.preventDefault() : event.returnValue = false;
      event.stopPropagation();
      var me = this;
      var $relPanel = $("#" + event.currentTarget.getAttribute("aria-controls"));
      $(me.tabs)
        .attr("aria-selected", "false")
        .removeClass(me.opts.activeClass);
      $(event.currentTarget)
        .attr("aria-selected", "true")
        .addClass(me.opts.activeClass);
      $(me.tabpanels)
        .removeClass(me.opts.activeClass);
      $relPanel
        .addClass(me.opts.activeClass);
    },
    accessTabPanel: function(event){
      if(event.shiftKey) return;
      event.preventDefault ? event.preventDefault() : event.returnValue = false;
      var $relPanel = $("#" + event.currentTarget.getAttribute("aria-controls"));
      var me = this;

      $(me.tabpanels)
        .attr({
          "tabindex": "-1",
          "aria-hidden": "true"
        })
      $relPanel
        .attr({
          "tabindex": "0",
          "aria-hidden": "false"
        })
        .focus();
    },
    /**
     * Processor mapping by key
     * @function keyEventHandler
     * @memberof TabUI.prototype
     * @param {event}
     */
    keyEventHandler: function(event){
      event = event || window.event;
      var me = this;
      var keycode = event.keyCode || event.which;

      switch(keycode){
        case keymap.LEFT_ARROW:
          me.prevTabFocus.call(me, event);
          break;
        case keymap.RIGHT_ARROW: 
          me.nextTabFocus.call(me, event);
          break;
        case keymap.SPACE: 
        case keymap.ENTER:
          me.selectTab.call(me, event);
          break;
        case keymap.TAB:
          me.accessTabPanel.call(me, event);
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
   */
  TabUI.prototype.initialize = function(settings){
    var me = this;
    me.opts = $.extend({}, defaults, settings);
    me.tablist = me.tabContent.querySelector(me.opts.tabListSelector);
    me.tabs = me.tabContent.querySelectorAll(me.opts.tabSelector);
    me.tabpanels = me.tabContent.querySelectorAll(me.opts.tabPanelSelector);
    me.opts.startTab = me.opts.startTab < 0 ? 0 : me.opts.startTab;
    me.opts.startTab = me.opts.startTab > me.tabs.length ? me.tabs.length - 1 : me.opts.startTab;

    for(var i = -1, control = "", tabid = "", cnt = me.tabs.length, anchr; ++i < cnt;){
      control = me.tabs[i].getAttribute("data-controls") || me.tabs[i].getAttribute("href");
      control = control ? control.replace(/.*#/, "") : "";

      // verifying tab - tabpanel relations
      if(control === "" || !document.getElementById(control)){
        try{
          throw new Error("no element with matching 'data-controls' or 'href' ");
        }catch(e){
          console.log("%cmulder21c-TabUI Error: ", "font-weight:bold", e.message);
          return;
        }
      }
      
      if(!(tabid = me.tabs[i].getAttribute("id"))){
        tabid = "mulder21c-tabui" + i + new Date().getTime();
        me.tabs[i].setAttribute("id", tabid);
      }

      // setting WAI-ARA Roles, Properties
      if(anchr = me.tabs[i].querySelector("a")){
        $(anchr).attr({
          "role": "presentation",
          "tabindex": "-1"
        });
      }
      $(me.tabs[i]).attr({
        "role": "tab",
        "aria-controls": control
      });
      $("#" + control).attr({
        "role": "tabpanel",
        "aria-labelledby": tabid
      });
    }
    me.tablist.setAttribute("role", "tablist");
    
    $(me.tabContent).on({
      "keydown.tabUI": function(event){
        event = event || window.event;
        me.keyEventHandler.call(me, event);
      },
      "click.tabUI": function(event){
        event = event || window.event;
        me.activateTab($(me.tabs).index(this));
        me.selectTab.call(me, event);
      }
    }, me.opts.tabSelector);

    me.activateTab(me.opts.startTab);
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