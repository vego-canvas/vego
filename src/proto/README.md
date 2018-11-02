# Vego Proto

The proto includes some fundamental Vue mixins which provide diffrent functions. The provided mixins will be mixined into *canvas components* when they created. The vego proto contains *drawStack*, *eventDispatcher*, *tweenMixin* and a global *ticker*.

The *ticker*, like engine, it invokes *drawStack* in every loop.

The *eventDispatcher* is designed as W3C UI event system. It has a three phases - capture, target, bubble. The event bubble phase can be stoped by customed `StopPropagation` function. Beyound traditional mouse events ( click, mousedown, mousemove, mouseup, mouseenter, mouseleave ) , I designed pressmove event  which holds the initial mousedown pos in *event object*.

The *tweenMixin* apply tweening functions when properties in component changed and will emit tweenend event.