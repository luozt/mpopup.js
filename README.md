# mpopup.js

mpopup.js, for mobile popup modals!

这是一个针对移动端的弹窗插件，参考QQ空间的弹窗插件而开发，默认距离顶部60px，满足主流屏幕，在打开输入法的时候，弹窗仍然可见。

## 参数说明

```js
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
```

## usage

```js
var popApi = new Mpopup({
  modal: $(".popup"),
  btnClose: $(".popup .close"),
  className: "popupWrap",
  zIndex: 5000,
  maskClose: true,
  paddingTop: 80,
  onShown: function(){
    console.log("showned!");
  },
  onHidden: function(){
    console.log("hidden!");
  }
});

$(".popup").removeClass("hide");
```

* 弹窗直接用static或者relative直接写，插件会把它嵌入一个绝对定位的wrapper中
* 默认载入页面不希望看到弹窗，但在载入js之前，弹窗还是可见的，所以建议先给弹窗加一个.hide样式，在初始化弹窗后再删掉这个.hide样式
