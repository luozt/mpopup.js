/**
 * 移动端弹窗插件
 * @Author LUOZHITAO
 */
(function (factory) {
  "use strict";

  if (typeof define === "function" && define.amd) {
    define(factory);
  }
  else if (typeof module != "undefined" && typeof module.exports != "undefined") {
    module.exports = factory();
  }
  else if (typeof Package !== "undefined") {
    Mpopup = factory();  // export for Meteor.js
  }
  else {
    /* jshint sub:true */
    window["Mpopup"] = factory();
  }
})(function(undefined){
  "use strict";

  var Mpopup = function(options){
    var self, defaultOpts, userOpts,
      calcPopup, hidePopup,
      $modalWrap, $modal, $btnClose,
      $body, $win, $mask, $docHtml,
      funcOptions, funcGlobals, funcSetupModalWrap, funcEvents;

    if(!options){
      return function(){
        throw new Error("Mpopup function arguments required!");
      }
    }

    // 检查插件是否已初始化
    if(!Mpopup._initialized){
      Mpopup.initialize();
    }

    self = this;

    // 格式化传入参数
    funcOptions = function(){
      defaultOpts = {
        modal: $({}),             // 弹窗Node节点
        btnClose: $({}),          // 关闭按钮
        className: "",            // 弹窗外层的className
        zIndex: 2500,             // 弹窗zIndex
        paddingTop: 60,           // 弹窗距离顶部
        maskClose: false,         // 点击蒙版是否关闭弹窗
        onShown: function(){},    // 当打开弹窗时执行
        onHidden: function(){}    // 当关闭弹窗时执行
      };

      userOpts = {};

      for(var key in defaultOpts){
        if(key in options){
          userOpts[key] = options[key];
        }else{
          userOpts[key] = defaultOpts[key];
        }
      }
    };

    // 获取全局变量
    funcGlobals = function(){
      $modalWrap = $("<div />");
      $modal = $(userOpts.modal);
      $btnClose = $(userOpts.btnClose);
      $body = Mpopup.globals.$body;
      $win = Mpopup.globals.$win;
      $docHtml = Mpopup.globals.$docHtml;
      $mask = Mpopup.globals.$mask;
    };

    // 初始化ModalWrap
    funcSetupModalWrap = function(){
      $modalWrap.prop("className", userOpts.className);
      $modalWrap.css({
        position: "absolute",
        left: 0,
        width: "100%",
        zIndex: userOpts.zIndex,
        display: "none"
      });

      $modal.get(0)._oriCss = {
        position: $modal.css("position"),
        left: $modal.css("left"),
        top: $modal.css("top"),
        right: $modal.css("right"),
        bottom: $modal.css("bottom")
      };

      $modal.css({
        position: "relative",
        left: "auto",
        top: "auto",
        right: "auto",
        bottom: "auto"
      });

      $body.append($modalWrap);
      $modalWrap.append($modal);
    };

    // 隐藏弹窗
    hidePopup = function(){
      self.hide();
    };

    // 重新计算弹窗位置
    calcPopup = function(){
      if(!$modalWrap.get(0)._visible){return;}

      var scrollTop;

      scrollTop = window.scrollY || document.scrollTop || 0;
      $modalWrap.css({
        top: scrollTop+userOpts.paddingTop+"px"
      });
    };

    // 绑定事件
    funcEvents = function(){
      $win.on("resize", calcPopup);
      $btnClose.on("click", hidePopup);

      if(userOpts.maskClose){
        $mask.on("click", hidePopup);
      }
    };

    // 顺序执行
    funcOptions();
    funcGlobals();
    funcSetupModalWrap();
    funcEvents();

    // 储存数据
    this.data = {
      userOpts: userOpts,
      calcPopup: calcPopup,
      hidePopup: hidePopup,
      $modalWrap: $modalWrap,
      $modal: $modal,
      $btnClose: $btnClose
    };
  };

  // 插件初始化动作
  Mpopup.initialize = function(){
    if(this._initialized){return;}

    var $body, $mask;

    // 公用变量
    this.globals = {
      $body: $("body"),
      $win: $(window),
      $mask: $("<div />"),
      $docHtml: $(document.body || document.documentElement)
    };

    // 标记
    this._initialized = false;
    this.currentShownCount = 0;

    $body = this.globals.$body;
    $mask = this.globals.$mask;

    // 初始化$mask样式
    $mask.css({
      position: "fixed",
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
      background: "rgba(0,0,0,.5)",
      display:"none",
      zIndex: 2000
    });

    $body.append($mask);

    this._initialized = true;
  };

  // 进行一些全局的设定
  Mpopup.setGlobals = function(cmd, data){
    if(this._initialized){return;}

    switch(cmd){
      //对蒙版的css进行调整
      case "mask":
        var $mask;
        $mask = this.globals.$mask;
        $mask.css(data);
        break;
    }
  };

  // 卸载插件功能
  Mpopup.teardown = function(){
    var $mask;

    $mask = Mpopup.globals.$mask;
    $mask.remove();
    Mpopup._initialized = false;
  };

  // 显示弹窗
  Mpopup.prototype.show = function(){
    var $mask;

    $mask = Mpopup.globals.$mask;
    $mask.show();
    this.data.$modalWrap.show().get(0)._visible = true;
    this.data.calcPopup();
    this.data.userOpts.onShown(this.data.$modal);
    Mpopup.currentShownCount++;
  };

  // 隐藏弹窗
  Mpopup.prototype.hide = function(){
    var $mask;

    Mpopup.currentShownCount--;
    $mask = Mpopup.globals.$mask;
    if(!Mpopup.currentShownCount){$mask.hide();}
    this.data.$modalWrap.hide().get(0)._visible = false;
    this.data.userOpts.onHidden(this.data.$modal);
  };

  // 获取内部变量
  Mpopup.prototype.getData = function(){
    return this.data;
  };

  // 卸载实例功能
  Mpopup.prototype.destroy = function(){
    var $win, $btnClose, $modalWrap, $modal, $mask,
      calcPopup, _oriCss, hidePopup;

    $win = Mpopup.globals.$win;
    $mask = Mpopup.globals.$mask;
    $btnClose = this.data.$btnClose;
    $modalWrap = this.data.$modalWrap;
    $modal = this.data.$modal;

    calcPopup = this.data.calcPopup;
    hidePopup = this.data.hidePopup;

    $win.off("resize", calcPopup);
    $btnClose.off("click", hidePopup);

    if(this.data.userOpts.maskClose){
      $mask.off("click", hidePopup);
    }

    $modal.insertAfter($modalWrap);
    $modalWrap.remove();

    _oriCss = $modal.get(0)._oriCss;
    $modal.css(_oriCss);

    this.destroy = this.show = this.hide = this.getData = null;
  };

  return Mpopup;
});
