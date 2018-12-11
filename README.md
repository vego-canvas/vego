# Vego Doc

```javascript
const app = new Vego({
    ... configs
});
app.$mount('canvas')
```

## 对象配置
```javascript
{
    // 名称
    name,
    // 父组件传递的属性，键值对形式
    props: {
        a: Number,
    },
    // 组件自身的状态 Function | Object
    data,
    // Function 必须返回一个数组包含
    // {
    //     comp, // 目标组件
    //     scope: // 组件props对应当前组件的对象
    // },
    children,
    // 事件监听注册
    handlers,

    // 钩子函数
    created
    mounted,

    // 渲染方法
    // 参数 g === $graphic
    render,

    // 方法对象
    methods,
}
```

## 对象内置属性
### $geometry
``` javascript
{
    // 相对于上一层坐标系的偏移
    x: 0,
    y: 0,
    // 相对于上一层坐标系的旋转
    rotation: 0,
    // 相对于上一层坐标系的缩放
    scaleX: 1,
    scaleY: 1,
    // 相对于上一层坐标系的形变
    skewX: 0,
    skewY: 0,
    // 相对于本坐标系的中心偏移
    regX: 0,
    regY: 0
}
```
### $graphic
内置的绘制对象
API参考 [graphic](https://createjs.com/docs/easeljs/classes/Graphics.html)
[drawText](https://createjs.com/docs/easeljs/classes/Text.html)

## 对象内置方法
### 生命周期钩子
created
mounted

### $mount
```javascript
	/**
	 * 注册响应函数
	 **/
	/**
	 * @property canvas
	 * @type String
     * @desc canvas的id
	 */
$mount(canvas){}
```
### $watch
```javascript
	/**
	 * 注册响应函数
	 **/
	/**
	 * @property target
	 * @type Function
     * @desc 返回目标的对象
	 */
	/**
	 * @property callback
	 * @type Function(value, oldValue)
     * @desc 回调函数，
	 */
$watch(target, callback){}
```
### $dispatch
```javascript
	/**
	 * 事件触发函数
	 **/
	/**
	 * @property type
	 * @type String
     * @desc 事件类型
	 */
	/**
	 * @property payload
	 * @type Object
     * @desc 事件带上的数据
	 */
$dispatch(type, payload){}
```
### $regist
```javascript
	/**
	 * 事件接收函数
	 **/
	/**
	 * @property type
	 * @type String
     * @desc 事件类型
	 */
	/**
	 * @property callback
	 * @type Function
     * @desc 接收到事件的回调函数，包含事件对象
	 */
$regist(type, callback){}
```
### $to
```javascript
	/**
	 * 渐变动画函数
	 **/
	/**
	 * @property target
	 * @type Object
     * @desc 从当前对象开始的下一个状态对象
	 */
	/**
	 * @property duration
	 * @type Number
     * @desc 持续时间（ms）
	 */
	/**
	 * @property easingFn
	 * @type Function
     * @desc 过渡函数
	 */
$to(target, duration, easingFn){}
```