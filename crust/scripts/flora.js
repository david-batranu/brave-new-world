(($, window, document) => {
  const book = {}
  book.isFirefoxOrIE = typeof InstallTrigger !== 'undefined' || !!document.documentMode
  book.version = '0.1.3'
  book.PI = Math.PI
  book.A90 = Math.PI / 2
  book.rad = degrees => degrees / 180 * PI
  book.deg = radians => 180 * (radians / PI)
  book.isTouch = false
  book.corners = {
    backward: ['bl', 'tl', 'l'],
    forward: ['br', 'tr', 'r'],
    all: ['tl', 'bl', 'tr', 'br', 'l', 'r']
  }
  book.DISPLAY_SINGLE = 1
  book.DISPLAY_DOUBLE = 2
  book.DIRECTION_LTR = 1
  book.DIRECTION_RTL = 2
  book.EVENT_PREVENTED = 1
  book.EVENT_STOPPED = 2
  book.getPrefix = () => {
    const vendorPrefixes = ['Moz', 'Webkit', 'Khtml', 'O', 'ms']
    let len = vendorPrefixes.length
    let vendor = ''
    for (;len--;) {
      if (`${vendorPrefixes[len]}Transform` in document.body.style) {
        vendor = `-${vendorPrefixes[len].toLowerCase()}-`
      }
    }
    return vendor
  }
  book.addCssWithPrefix = function (opt_attributes) {
    let m
    const input = this.vendor || this.getPrefix()
    const lines = {}
    for (m in opt_attributes) {
      if (this.has(m, opt_attributes)) {
        lines[m.replace('@', input)] = opt_attributes[m].replace('@', input)
      }
    }
    return lines
  }
  book.bezier = function (data, t, message) {
    const mum1 = 1 - t
    const mum13 = mum1 * mum1 * mum1
    const t3 = t * t * t
    return this.peelingPoint(message, Math.round(mum13 * data[0].x + 3 * t * mum1 * mum1 * data[1].x + 3 * t * t * mum1 * data[2].x + t3 * data[3].x), Math.round(mum13 * data[0].y + 3 * t * mum1 * mum1 * data[1].y + 3 * t * t * mum1 * data[2].y + t3 * data[3].y))
  }
  book.layerCSS = (recurring, mayParseLabeledStatementInstead, lab, overf) => ({
    css: {
      position: 'absolute',
      top: recurring,
      left: mayParseLabeledStatementInstead,
      overflow: overf || 'hidden',
      'z-index': lab || 'auto'
    }
  })
  book.peelingPoint = (childrenVarArgs, funcToCall, millis) => ({
    corner: childrenVarArgs,
    x: funcToCall,
    y: millis
  })
  book.transformUnit = (line, g) => {
    let m
    return typeof line === 'string' && (m = /^(\d+)(px|%)$/.exec(line)) ? m[2] === 'px' ? parseInt(m[1], 10) : m[2] === '%' ? parseInt(m[1], 10) / 100 * g : void 0 : line
  }
  book.point2D = (recurring, mayParseLabeledStatementInstead) => ({
    x: recurring,
    y: mayParseLabeledStatementInstead
  })
  book.translate = function (tx, recurring, aX) {
    return this.has3d && aX ? ` translate3d(${tx}px,${recurring}px, 0px) ` : ` translate(${tx}px, ${recurring}px) `
  }
  book.scale = function (I, dataAndEvents, sx) {
    return this.has3d && sx ? ` scale3d(${I},${dataAndEvents}, 1) ` : ` scale(${I}, ${dataAndEvents}) `
  }
  book.rotate = angle => ` rotate(${angle}deg) `
  book.has = (property, target) => Object.prototype.hasOwnProperty.call(target, property)
  book.rotationAvailable = () => {
    let components
    if (components === /AppleWebkit\/([0-9\.]+)/i.exec(navigator.userAgent)) {
      const version = parseFloat(components[1])
      return version > 534.3
    }
    return true
  }
  book.css3dAvailable = () => 'WebKitCSSMatrix' in window || 'MozPerspective' in document.body.style
  book.getTransitionEnd = ($elem, oldValMethod) => {
    let t
    let event
    const el = document.createElement('fakeelement')
    const transitions = {
      transition: 'transitionend',
      OTransition: 'oTransitionEnd',
      MSTransition: 'transitionend',
      MozTransition: 'transitionend',
      WebkitTransition: 'webkitTransitionEnd'
    }
    for (t in transitions) {
      if (void 0 !== el.style[t]) {
        event = transitions[t]
        break
      }
    }
    return $elem && (event ? $elem.bind(event, () => {
      $elem.unbind(event)
      oldValMethod.call($elem)
    }) : setTimeout(() => {
      oldValMethod.call($elem)
    }, Math.ceil(1E3 * parseFloat($elem.css(`${getPrefix()}transition-duration`))))), event
  }
  book.makeGradient = function (recurring) {
    let vendor
    return this.vendor === '-webkit-' ? recurring ? (vendor = '-webkit-gradient(linear, left top, right top,', vendor += 'color-stop(0, rgba(0,0,0,0)),', vendor += 'color-stop(0.3, rgba(0,0,0, 0.3)),', vendor += 'color-stop(0.5, rgba(0,0,0, 0.8))', vendor += ')') : (vendor = '-webkit-gradient(linear, left top, right top,', vendor += 'color-stop(0, rgba(0,0,0,0)),', vendor += 'color-stop(0.2, rgba(0,0,0,0.5)),', vendor += 'color-stop(0.2, rgba(0,0,0,0.6)),', vendor += 'color-stop(0.4, rgba(0,0,0,0.2)),',
      vendor += 'color-stop(1, rgba(0,0,0,0))', vendor += ')') : (vendor = `${this.vendor}linear-gradient(left, `, recurring ? (vendor += 'rgba(0,0,0,0) 0%,', vendor += 'rgba(0,0,0,0.3) 30%,', vendor += 'rgba(0,0,0,0.8) 50%') : (vendor += 'rgba(0,0,0,0) 0%,', vendor += 'rgba(0,0,0,0.2) 20%,', vendor += 'rgba(0,0,0,0.6) 20%,', vendor += 'rgba(0,0,0,0.2) 40%,', vendor += 'rgba(0,0,0,0) 100%'), vendor += ')'), vendor
  }
  book.gradient = function (el, pos, p1, g, a) {
    let b
    const tagNameArr = []
    if (this.vendor == '-webkit-') {
      b = 0
      for (;a > b; b++) {
        tagNameArr.push(`color-stop(${g[b][0]}, ${g[b][1]})`)
      }
      el.css({
        'background-image': `-webkit-gradient(linear, ${pos.x}% ${pos.y}%,${p1.x}% ${p1.y}%, ${tagNameArr.join(',')} )`
      })
    }
  }
  book.trigger = (type, events, data) => {
    const event = $.Event(type)
    return events.trigger(event, data), event.isDefaultPrevented() ? book.EVENT_PREVENTED : event.isPropagationStopped() ? book.EVENT_STOPPED : ''
  }
  book.error = msg => {
    function AssertionError (message) {
      this.name = 'TurnError'
      this.message = message
    }
    return TurnJsError.prototype = new Error(), TurnJsError.prototype.constructor = AssertionError, new AssertionError(msg)
  }
  book.getListeners = (obj, type, dataAndEvents) => {
    const events = $._data(obj[0]).events
    const assigns = []
    if (events) {
      const list = events[type]
      if (list) {
        $.each(list, (dataAndEvents, vvar) => {
          assigns.push(vvar)
        })
        if (dataAndEvents) {
          obj.unbind(type)
        }
      }
    }
    return assigns
  }
  book.setListeners = (cy, event, codeSegments) => {
    if (codeSegments) {
      let i = 0
      for (;i < codeSegments.length; i++) {
        cy.on(event, codeSegments[i].selector, codeSegments[i].handler)
      }
    }
  }

  book.UIComponent = cssText => {
    const Tabs = function (element, opt_renderer) {
      this._data = {}
      this._hashKey = opt_renderer
      this.$el = $(element)
    }
    return Tabs.prototype = {
      _init: cssText,
      _bind (fn) {
        return Tabs.prototype[fn].apply(this, Array.prototype.slice.call(arguments, 1))
      },
      _trigger (type) {
        return book.trigger(type, this.$el, Array.prototype.slice.call(arguments, 1))
      },
      _destroy () {
        const _hashKey = this.$el.data()
        delete _hashKey[this._hashKey]
      }
    }, Tabs
  }
  book.widgetInterface = function (model, options, checkSet) {
    let data = $.data(this, options)
    return data ? data._bind(...checkSet) : (book.oneTimeInit(), data = new model(this, options), $.data(this, options, data), data._init(...checkSet))
  }
  book.widgetFactory = (name, fn) => {
    const fqn = `turn.${name}`
    $.fn[name] = function () {
      if (this.length == 1) {
        return book.widgetInterface.call(this[0], fn, fqn, arguments)
      }
      let i = 0
      for (;i < this.length; i++) {
        book.widgetInterface.call(this[i], fn, fqn, arguments)
      }
      return this
    }
  }
  book.oneTimeInit = function () {
    if (!this.vendor) {
      this.has3d = this.css3dAvailable()
      this.hasRotation = this.rotationAvailable()
      this.vendor = this.getPrefix()
    }
  }
  book.calculateBounds = params => {
    const img = {
      width: params.width,
      height: params.height
    }
    if (img.width > params.boundWidth || img.height > params.boundHeight) {
      const delta = img.width / img.height
      if (params.boundWidth / delta > params.boundHeight && params.boundHeight * delta <= params.boundWidth) {
        img.width = Math.round(params.boundHeight * delta)
        img.height = params.boundHeight
      } else {
        img.width = params.boundWidth
        img.height = Math.round(params.boundWidth / delta)
      }
    }
    return img
  }
  book.animate = (options, animation) => {
    if (!animation) {
      return void (options.animation && options.animation.stop())
    }
    if (options.animation) {
      options.animation._time = (new Date()).getTime()
      let j = 0
      for (;j < options.animation._elements; j++) {
        options.animation.from[j] = options.animation.current[j]
        options.animation.to[j] = animation.to[j] - options.animation.from[j]
      }
    } else {
      if (!animation.to.length) {
        animation.to = [animation.to]
      }
      if (!animation.from.length) {
        animation.from = [animation.from]
      }
      let r = true
      options.animation = $.extend({
        current: [],
        _elements: animation.to.length,
        _time: (new Date()).getTime(),
        stop () {
          r = false
          options.animation = null
        },
        easing (t, x, easing, d) {
          return -easing * ((t = t / d - 1) * t * t * t - 1) + x
        },
        _frame () {
          const t = Math.min(this.duration, (new Date()).getTime() - this._time)
          let i = 0
          for (;i < this._elements; i++) {
            this.current[i] = this.easing(t, this.from[i], this.to[i], this.duration)
          }
          r = true
          this.frame(this.current)
          if (t >= this.duration) {
            this.stop()
            if (this.completed) {
              this.completed()
            }
          } else {
            window.requestAnimationFrame(() => {
              if (r) {
                options.animation._frame()
              }
            })
          }
        }
      }, animation)
      let i = 0
      for (;i < options.animation._elements; i++) {
        options.animation.to[i] -= options.animation.from[i]
      }
      options.animation._frame()
    }
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = window.webkitRequestAnimationFrame || (window.mozRequestAnimationFrame || (window.oRequestAnimationFrame || (window.msRequestAnimationFrame || (after => {
      window.setTimeout(after, 1E3 / 60)
    }))))
  }

  $.fn.transform = function (value, key) {
    const properties = {}
    return key && (properties[`${book.vendor}transform-origin`] = key), properties[`${book.vendor}transform`] = value, this.css(properties)
  }
  window.Turn = book
  const compassResult = $.isTouch || 'ontouchstart' in window
  book.eventPrefix = ''
  book.isTouchDevice = compassResult
  book.isInside = (point, container) => {
    if (container) {
      if (container == document.body || container == window) {
        return true
      }
      const rect = $(container).offset()
      return rect && (point.x >= rect.left && (point.y >= rect.top && (point.x <= rect.left + container.offsetWidth && point.y <= rect.top + container.offsetHeight)))
    }
  }
  book.eventPoint = e => {
    const orig = e.originalEvent
    const hasBody = orig.touches && orig.touches[0]
    const data = hasBody ? book.point2D(orig.touches[0].pageX, orig.touches[0].pageY) : book.point2D(e.pageX, e.pageY)
    return data.time = e.timeStamp, data.target = e.target, data
  }
  book.Event = function (name, opt_attributes) {
    name = this.eventPrefix + name
    let lastTime = false
    const init = function (el, selector) {
      this.el = el
      this.$el = $(el)
      this.eventName = name
      this._selector = selector
      this._data = {}
      this._init()
    }
    return opt_attributes._triggerVirtualEvent = function (e) {
      if (lastTime !== e.timeStamp) {
        lastTime = e.timeStamp
        this.$el.trigger(e)
      }
    }, opt_attributes._trigger = function (eventName) {
      const touch = book.eventPoint(eventName)
      const removed = this.Event(eventName, {
        pageX: touch.x,
        pageY: touch.y
      })
      this._triggerVirtualEvent(removed)
    }, opt_attributes.Event = function (event, e = {}) {
      e.type = this.eventName
      e.target = event.target
      e.toElement = event.toElement
      e.currentTarget = event.currentTarget
      e.delegateTarget = event.delegateTarget
      e.pageX = e.pageX || event.pageX
      e.pageY = e.pageY || event.pageY
      const info = $.Event(event, e)
      return info.type = this.eventName, info
    }, init.eventName = name, init.prototype = opt_attributes, init
  }
  book._registerEvent = (Resource, evtName) => {
    $.event.special[evtName] = {
      add (handleObj) {
        const name = handleObj.selector || ''
        const fullname = `e.${evtName}${name}`
        const that = $(this)
        const node = that.data(fullname) || {
          listeners: 0
        }
        if (!node.instance) {
          node.instance = new Resource(this, name)
        }
        node.listeners++
        that.data(fullname, node)
      },
      remove (handleObj) {
        const endpoint = handleObj.selector || ''
        const full = `e.${evtName}${endpoint}`
        const d = $(this)
        const view = d.data(full)
        if (view) {
          if (view.listeners > 0) {
            view.listeners--
            if (view.listeners === 0) {
              view.instance._remove()
              delete view.instance
            }
          }
        }
      }
    }
  }
  book._registerEvents = function (codeSegments) {
    let i = 0
    for (;i < codeSegments.length; i++) {
      this._registerEvent(codeSegments[i], codeSegments[i].eventName)
    }
  }
  const tap = book.Event('tap', {
    _init () {
      if (compassResult) {
        this.$el.on('touchstart', this._selector, $.proxy(this, '_touchstart'))
        this.$el.on('touchmove', this._selector, $.proxy(this, '_touchmove'))
        this.$el.on('touchend', this._selector, $.proxy(this, '_touchend'))
      } else {
        this.$el.on('click', this._selector, $.proxy(this, '_trigger'))
      }
    },
    _remove () {
      if (compassResult) {
        this.$el.off('touchstart', this._selector, this._touchstart)
        this.$el.off('touchmove', this._selector, this._touchmove)
        this.$el.off('touchend', this._selector, this._touchend)
      } else {
        this.$el.off('click', this._selector, this._trigger)
      }
    },
    _touchstart (value) {
      this._data.startEvent = value
      this._data.initScrollTop = $(window).scrollTop()
      this._data.initScrollLeft = $(window).scrollLeft()
    },
    _touchmove (value) {
      this._data.startEvent = value
    },
    _touchend () {
      if (this._data.startEvent) {
        const x = book.eventPoint(this._data.startEvent)
        const todayMonth = $(window).scrollTop()
        const todayYear = $(window).scrollLeft()
        if (book.isInside(x, this._data.startEvent.currentTarget || this.el) && (this._data.initScrollTop == todayMonth && this._data.initScrollLeft == todayYear)) {
          const $this = this
          const type = this._data.startEvent
          setTimeout(() => {
            $this._trigger(type)
          }, 0)
        }
        this._data.startEvent = null
      }
    }
  })
  const e = book.Event('doubletap', {
    _init () {
      this._data.queue = [0, 0]
      this.$el.on('tap', this._selector, $.proxy(this, '_tap'))
    },
    _remove () {
      this.$el.off('tap', this._selector, this._tap)
    },
    _tap (obj) {
      const vertices = this._data.queue
      if (vertices.shift(), vertices.push(obj.timeStamp), vertices[1] - vertices[0] < 300) {
        const e = obj.originalEvent
        const pointer = book.eventPoint(e)
        this._triggerVirtualEvent(this.Event(e, {
          pageX: pointer.x,
          pageY: pointer.y
        }))
      }
    }
  })
  const vmouseover = book.Event('vmouseover', {
    _init () {
      if (compassResult) {
        this.$el.on('touchstart', this._selector, $.proxy(this, '_trigger'))
      } else {
        this.$el.on('mouseover', this._selector, $.proxy(this, '_trigger'))
      }
    },
    _remove () {
      if (compassResult) {
        this.$el.off('touchstart', this._selector, this._trigger)
      } else {
        this.$el.off('mouseover', this._selector, this._trigger)
      }
    }
  })
  const vmouseout = book.Event('vmouseout', {
    _init () {
      if (compassResult) {
        this.$el.on('touchend', this._selector, $.proxy(this, '_trigger'))
      } else {
        this.$el.on('mouseout', this._selector, $.proxy(this, '_trigger'))
      }
    },
    _remove () {
      if (compassResult) {
        this.$el.off('touchend', this._selector, this._trigger)
      } else {
        this.$el.off('mouseout', this._selector, this._trigger)
      }
    }
  })
  const vmousedown = book.Event('vmousedown', {
    _init () {
      if (compassResult) {
        this.$el.on('touchstart', this._selector, $.proxy(this, '_trigger'))
      } else {
        this.$el.on('mousedown', this._selector, $.proxy(this, '_trigger'))
      }
    },
    _remove () {
      if (compassResult) {
        this.$el.off('touchstart', this._selector, this._trigger)
      } else {
        this.$el.off('mousedown', this._selector, this._trigger)
      }
    }
  })
  const vmouseup = book.Event('vmouseup', {
    _init () {
      if (compassResult) {
        this.$el.on('touchend', this._selector, $.proxy(this, '_trigger'))
      } else {
        this.$el.on('mouseup', this._selector, $.proxy(this, '_trigger'))
      }
    },
    _remove () {
      if (compassResult) {
        this.$el.off('touchend', this._selector, this._trigger)
      } else {
        this.$el.off('mouseup', this._selector, this._trigger)
      }
    }
  })
  const vmousemove = book.Event('vmousemove', {
    _init () {
      if (compassResult) {
        this.$el.on('touchmove', this._selector, $.proxy(this, '_trigger'))
      } else {
        this.$el.on('mousemove', this._selector, $.proxy(this, '_trigger'))
      }
    },
    _remove () {
      if (compassResult) {
        this.$el.off('touchmove', this._selector, this._trigger)
      } else {
        this.$el.off('mousemove', this._selector, this._trigger)
      }
    }
  })
  const message = book.Event('swipe', {
    _init () {
      this.$el.on('vmousedown', this._selector, $.proxy(this, '_vmousedown'))
    },
    _remove () {
      this.$el.off('vmousedown', this._selector, this._vmousedown)
    },
    _vmousedown (elm) {
      const data = this._data
      data.firstEvent = book.eventPoint(elm)
      data.currentEvent = data.firstEvent
      data.prevEvent = data.firstEvent
      $(document).on('vmousemove', $.proxy(this, '_vmousemove'))
      $(document).on('vmouseup', $.proxy(this, '_vmouseup'))
    },
    _vmousemove (elm) {
      const data = this._data
      const type = data.currentEvent
      data.currentEvent = book.eventPoint(elm)
      data.prevEvent = type
    },
    _vmouseup () {
      const d = this._data
      const movingSpace = d.prevEvent.x - d.currentEvent.x
      const deltaTime = d.prevEvent.time - d.currentEvent.time
      const speed = movingSpace / deltaTime
      if (speed < -0.2 || speed > 0.2) {
        const t = {}
        t.pageX = d.currentEvent.x
        t.pageY = d.currentEvent.y
        t.speed = speed
        this._triggerVirtualEvent(this.Event(d.firstEvent, t))
      }
      $(document).off('vmousemove', this._vmousemove)
      $(document).off('vmouseup', this._vmouseup)
    }
  })
  const error = book.Event('pinch', {
    _init () {
      this.$el.on('touchstart', this._selector, $.proxy(this, '_touchstart'))
    },
    _remove () {
      this.$el.off('touchstart', this._selector, this._touchstart)
    },
    _touchstart (elm) {
      const data = this._data
      data.firstEvent = book.eventPoint(elm)
      data.pinch = null
      $(document).on('touchmove', $.proxy(this, '_touchmove'))
      $(document).on('touchend', $.proxy(this, '_touchend'))
    },
    _touchmove (e) {
      const touches = e.originalEvent.touches
      const data = this._data
      if (touches.length == 2) {
        const evt = {}
        const z0 = touches[1].pageX - touches[0].pageX
        const z1 = touches[1].pageY - touches[0].pageY
        const ev = book.point2D(touches[1].pageX / 2 + touches[0].pageX / 2, touches[1].pageY / 2 + touches[0].pageY / 2)
        const x = Math.sqrt(z0 * z0 + z1 * z1)
        if (!data.pinch) {
          data.pinch = {
            initDistance: x,
            prevDistance: x,
            prevMidpoint: ev
          }
        }
        evt.pageX = ev.x
        evt.pageY = ev.y
        evt.dx = ev.x - data.pinch.prevMidpoint.x
        evt.dy = ev.y - data.pinch.prevMidpoint.y
        evt.factor = x / data.pinch.initDistance
        evt.dfactor = x / data.pinch.prevDistance
        data.pinch.prevDistance = x
        data.pinch.prevMidpoint = ev
        this._triggerVirtualEvent(this.Event(data.firstEvent, evt))
      }
    },
    _touchend () {
      $(document).off('touchmove', this._touchmove)
      $(document).off('touchend', this._touchend)
    }
  })
  book._registerEvents([tap, e, message, error, vmouseover, vmouseout, vmousedown, vmousemove, vmouseup])
  const defaults = {
    acceleration: true,
    animatedAutoCenter: false,
    autoCenter: true,
    autoScroll: true,
    autoScaleContent: false,
    hoverAreaSize: 50,
    cornerPosition: '50px 20px',
    margin: '0px 0px',
    display: 'double',
    duration: 500,
    easing (t, b, c, d) {
      const ts = (t /= d) * t
      const tc = ts * t
      return b + c * (-1.95 * tc * ts + 7.8 * ts * ts + -10.7 * tc + 4.8 * ts + 1.05 * t)
    },
    elevation: '100%',
    hover: true,
    ignoreElements: '[ignore=1]',
    page: 1,
    pageMargin: '0px 0px',
    smartFlip: false,
    swipe: true,
    responsive: false,
    gradients: true,
    turnCorners: 'l,r',
    events: null,
    showDoublePage: false
  }
  const that = book.UIComponent(function (options) {
    const data = this._data
    const codeSegments = this.$el.children()
    let entered = 0
    options = $.extend({
      width: options.pageWidth ? 2 * options.pageWidth : this.$el.width(),
      height: options.pageHeight ? options.pageHeight : this.$el.height(),
      direction: this.$el.attr('dir') || (this.$el.css('direction') || 'ltr'),
      viewer: this.$el.parent(),
      cacheSize: options && options.blocks ? 8 : 6
    }, defaults, options)
    const octalLiteral = options.cornerPosition.split(' ')
    if (options.cornerPosition = book.point2D(parseInt(octalLiteral[0], 10), parseInt(octalLiteral[1], 10)), data.options = options, data.dynamicMode = false, data.turningPage = false, data.watchSizeChange = true, data.pageObjs = {}, data.pageBlocks = {}, data.pages = {}, data.pageWrap = {}, data.blocks = {}, data.pageMv = [], data.front = [], data.scroll = {
      left: 0,
      top: 0
    }, data.margin = [0, 0, 0, 0], data.pageMargin = [0, 0, 0, 0], data.zoom = 1, data.totalPages = options.pages || 0, options.when && (options.delegate = options.when), options.delegate) {
      let eventName
      for (eventName in options.delegate) {
        if (book.has(eventName, options.delegate)) {
          if (eventName == 'tap' || eventName == 'doubletap') {
            this.$el.on(eventName, '.page', options.delegate[eventName])
          } else {
            this.$el.on(eventName, options.delegate[eventName])
          }
        }
      }
    }
    this.$el.css({
      position: 'relative',
      width: options.width,
      height: options.height
    })
    if (compassResult) {
      this.$el.addClass('touch-device')
    } else {
      this.$el.addClass('no-touch-device')
    }
    this.display(options.display)
    if (options.direction !== '') {
      this.direction(options.direction)
    }
    let i = 0
    for (;i < codeSegments.length; i++) {
      if (!$(codeSegments[i]).is(options.ignoreElements)) {
        this.addPage(codeSegments[i], ++entered)
      }
    }
    return options.pages = data.totalPages, data.dynamicMode = entered === 0, options.swipe && this.$el.on('swipe', $.proxy(this, '_eventSwipe')), this.$el.parent().on('start', $.proxy(this, '_eventStart')), this.$el.on('vmousedown', $.proxy(this, '_eventPress')).on('vmouseover', $.proxy(this, '_eventHover')).on('vmouseout', $.proxy(this, '_eventNoHover')), this._resizeObserver(), typeof options.page !== 'number' || (isNaN(options.page) || (options.page < 1 || options.page > data.totalPages)) ? this.page(1)
      : this.page(options.page), options.animatedAutoCenter && this.$el.css(book.addCssWithPrefix({
      '@transition': `margin-left ${options.duration}ms`
    })), data.done = true, this.$el
  })
  book.directions
  const lastAngle = book.A90
  var PI = book.PI
  const results = book.UIComponent(function (book, session) {
    return book = book || {}, book.disabled = false, book.hover = false, book.turn = session, book.turnData = session._data, book.effect = this.$el.hasClass('hard') || this.$el.hasClass('cover') ? 'hard' : 'sheet', this.$el.data('f', book), this._addPageWrapper(), book.turnData.disabled && this.disable(), this.$el
  })
  results.prototype._cornerAllowed = function () {
    const result = this.$el.data('f')
    const id = result.page
    const data = result.turnData
    const leftBottom = id % 2
    switch (result.effect) {
      case 'hard':
        const s = data.direction == book.DIRECTION_LTR
        return s ? [leftBottom ? 'r' : 'l'] : [leftBottom ? 'l' : 'r']
      case 'sheet':
        if (data.display == book.DISPLAY_SINGLE) {
          return id == 1 ? book.corners.forward : id == data.totalPages ? book.corners.backward : result.status == 'tapping' ? book.corners.all : book.corners.forward
        }
        if (data.display == book.DISPLAY_DOUBLE) {
          return data.options.showDoublePage ? book.corners[leftBottom ? 'backward' : 'forward'] : book.corners[leftBottom ? 'forward' : 'backward']
        }
    }
  }
  results.prototype._cornerActivated = function (e) {
    const x = this.$el.width()
    const y = this.$el.height()
    const me = book.peelingPoint('', e.x, e.y)
    if (me.x <= 0 || (me.y <= 0 || (me.x >= x || me.y >= y))) {
      return false
    }
    const result = this.$el.data('f')
    const msg = result.turnData
    if (result.dpoint) {
      let max = msg.options.cornerPosition
      const field = this._startPoint(result.dpoint.corner, $.extend({}, me))
      if (max = Math.max(max.x, max.y), field.x <= max && field.y <= max) {
        return me.corner = result.dpoint.corner, me
      }
    }
    const delta = msg.options.hoverAreaSize
    const elems = this._cornerAllowed()
    switch (result.effect) {
      case 'hard':
        if (me.x > x - delta) {
          me.corner = 'r'
        } else {
          if (!(me.x < delta)) {
            return false
          }
          me.corner = 'l'
        }
        break
      case 'sheet':
        if (me.y < delta) {
          me.corner += 't'
        } else {
          if (me.y >= y - delta) {
            me.corner += 'b'
          }
        }
        if (me.x <= delta) {
          me.corner += 'l'
        } else {
          if (me.x >= x - delta) {
            me.corner += 'r'
          }
        }
    }
    return me.corner && $.inArray(me.corner, elems) != -1 ? me : false
  }
  results.prototype._isIArea = function (n) {
    const size = book.eventPoint(n)
    const g = this.$el.data('f')
    const padding = (g.clip || g.ipage).parent().offset()
    return this._cornerActivated(book.point2D(size.x - padding.left, size.y - padding.top))
  }
  results.prototype._startPoint = function (corner, rp) {
    let o
    switch (rp = rp || book.point2D(0, 0), corner) {
      case 'tr':
        rp.x = this.$el.width() - rp.x
        break
      case 'bl':
        rp.y = this.$el.height() - rp.y
        break
      case 'br':
        rp.x = this.$el.width() - rp.x
        rp.y = this.$el.height() - rp.y
        break
      case 'l':
        o = this.$el.data('f')
        if (o.startPoint) {
          rp.y = o.startPoint.y
        }
        break
      case 'r':
        rp.x = this.$el.width() - rp.x
        o = this.$el.data('f')
        if (o.startPoint) {
          rp.y = o.startPoint.y
        }
    }
    return rp
  }
  results.prototype._endPoint = function (dataAndEvents, rp) {
    let o
    switch (rp = rp || book.point2D(0, 0), dataAndEvents) {
      case 'tl':
        rp.x = 2 * this.$el.width() - rp.x
        break
      case 'tr':
        rp.x = -this.$el.width() + rp.x
        break
      case 'bl':
        rp.x = 2 * this.$el.width() - rp.x
        rp.y = this.$el.height() - rp.y
        break
      case 'br':
        rp.x = -this.$el.width() + rp.x
        rp.y = this.$el.height() - rp.y
        break
      case 'l':
        rp.x = 2 * this.$el.width() - rp.x
        o = this.$el.data('f')
        if (o.startPoint) {
          rp.y = o.startPoint.y
        }
        break
      case 'r':
        rp.x = -this.$el.width() - rp.x
        o = this.$el.data('f')
        if (o.startPoint) {
          rp.y = o.startPoint.y
        }
        ;
    }
    return rp
  }
  results.prototype._foldingPage = function (off) {
    const s = this.$el.data('f')
    if (s) {
      const data = s.turnData
      return off = off || 'pageObjs', data.display == book.DISPLAY_SINGLE ? data[off][0] : s.over ? data[off][s.over] : data[off][s.next]
    }
    return false
  }
  results.prototype.resize = function (x, y) {
    const s = this.$el.data('f')
    switch (x = x || this.$el.width(), y = y || this.$el.height(), s.effect) {
      case 'hard':
        s.ipage.css({
          width: x,
          height: y
        })
        s.igradient.css({
          width: x,
          height: y
        })
        s.ogradient.css({
          width: x,
          height: y
        })
        break
      case 'sheet':
        const side = Math.round(Math.sqrt(x * x + y * y))
        s.clip.css({
          width: side,
          height: side
        })
        s.ipage.css({
          width: x,
          height: y
        })
        s.igradient.css({
          width: 100,
          height: 2 * y,
          top: -y / 2
        })
        s.ogradient.css({
          width: 100,
          height: 2 * y,
          top: -y / 2
        })
    }
    return this.$el
  }
  results.prototype._addPageWrapper = function () {
    const options = this.$el.data('f')
    options.turnData
    let css
    const parent = this.$el.parent()
    const html = $('<div />', {
      'class': 'inner-page'
    })
    const modal = $('<div />', {
      'class': 'inner-gradient'
    })
    const div = $('<div />', {
      'class': 'outer-gradient'
    })
    switch (options.effect) {
      case 'hard':
        css = book.layerCSS(0, 0, 2).css
        css[`${book.vendor}transform-style`] = 'preserve-3d'
        css[`${book.vendor}backface-visibility`] = 'hidden'
        html.css(css).appendTo(parent).prepend(this.$el)
        modal.css(book.layerCSS(0, 0, 0).css).appendTo(html)
        div.css(book.layerCSS(0, 0, 0))
        options.ipage = html
        options.igradient = modal
        options.ogradient = div
        break
      case 'sheet':
        const container = $('<div />', {
          'class': 'clip'
        })
        css = book.layerCSS(0, 0, 0).css
        container.css(css)
        html.css($.extend({
          cursor: 'default'
        }, css))
        css.zIndex = 1
        modal.css({
          background: book.makeGradient(true),
          display: book.isFirefoxOrIE ? '' : 'none',
          visibility: 'hidden',
          position: 'absolute',
          'z-index': 2
        })
        div.css({
          background: book.makeGradient(false),
          visibility: 'hidden',
          position: 'absolute',
          'z-index': 2
        })
        modal.appendTo(html)
        html.appendTo(container).prepend(this.$el)
        div.appendTo(parent)
        container.appendTo(parent)
        options.clip = container
        options.ipage = html
        options.igradient = modal
        options.ogradient = div
    }
    this.resize()
  }
  results.prototype._fold = function (pos) {
    const e = this.$el.data('f')
    if (e.dpoint && (e.dpoint.corner == pos.corner && (e.dpoint.x == pos.x && e.dpoint.y == pos.y))) {
      return false
    }
    switch (e.effect) {
      case 'hard':
        this._hard(pos)
        break
      case 'sheet':
        this._pageCURL(pos)
    }
    return e.dpoint = book.peelingPoint(pos.corner, pos.x, pos.y), true
  }
  results.prototype._bringClipToFront = function (recurring) {
    const s = this.$el.data('f')
    if (s) {
      const data = s.turnData
      const key = data.display == book.DISPLAY_SINGLE
      if (recurring) {
        const id = key ? 0 : s.next
        if (s.over && (s.over != id && this._bringClipToFront(false)), s.effect == 'hard') {
          s.igradient.show()
        } else {
          if (s.effect == 'sheet') {
            const container = data.pageWrap[id]
            const result = data.pages[id].data('f')
            const w = container.width()
            const dialogHeight = container.height()
            if (container.css({
              overflow: 'visible',
              'pointer-events': 'none',
              zIndex: 3 + data.front.length
            }), result.ipage.css({
                overflow: 'hidden',
                position: 'absolute',
                width: w,
                height: dialogHeight
              }), result.igradient.show().css({
                visibility: 'visible'
              }), s.ipage.css({
                'z-index': 1
              }), s.ogradient.show().css({
                zIndex: 2,
                visibility: 'visible'
              }), key && result.tPage != s.page) {
              data.pageObjs[0].find('*').remove()
              const clone = data.pageObjs[s.page].clone(false).css({
                opacity: '0.2',
                overflow: 'hidden'
              }).transform('rotateY(180deg)', '50% 50%')
              clone.appendTo(data.pageObjs[0])
              result.tPage = s.page
            }
          }
        }
        s.over = id
      } else {
        if (s.over) {
          const modal = data.pageWrap[s.over]
          if (modal) {
            modal.css({
              overflow: 'hidden',
              display: book.isFirefoxOrIE ? '' : 'none',
              visibility: book.isFirefoxOrIE ? 'hidden' : '',
              'pointer-events': '',
              zIndex: 0
            })
          }
          this._restoreClip(true)
          delete s.over
        }
      }
    }
  }
  results.prototype._restoreClip = function (cell, dataAndEvents) {
    let c
    const i = this.$el.data('f')
    const that = i.turnData
    const text = cell ? book.translate(0, 0, that.options.acceleration) : ''
    if (dataAndEvents) {
      c = i
    } else {
      if (that.pages[i.over]) {
        c = that.pages[i.over].data('f')
      }
    }
    if (c) {
      if (c.clip) {
        c.clip.transform(text)
      }
      c.ipage.transform(text).css({
        top: 0,
        left: 0,
        right: 'auto',
        bottom: 'auto'
      })
      c.igradient.hide()
    }
  }
  results.prototype._setFoldedPagePosition = function (position, dataAndEvents) {
    const entry = this.$el.data()
    const p = entry.f
    const o = p.turnData
    if (dataAndEvents) {
      let offsetCoordinate
      const object = this
      const corner = position.corner
      offsetCoordinate = p.point && p.point.corner == corner ? p.point : this._startPoint(corner, book.point2D(1, 1))
      this._animate({
        from: [offsetCoordinate.x, offsetCoordinate.y],
        to: [position.x, position.y],
        duration: 500,
        easing: o.options.easing,
        frame (args) {
          position.x = Math.round(args[0])
          position.y = Math.round(args[1])
          position.corner = corner
          object._fold(position)
        }
      })
    } else {
      this._fold(position)
      if (this.animation) {
        if (!this.animation.turning) {
          this._animate(false)
        }
      }
    }
  }
  results.prototype._showFoldedPage = function (c, dataAndEvents) {
    const data = this.$el.data('f')
    const svg = this._foldingPage()
    if (data && svg) {
      const v = data.visible
      const corner = c.corner
      const holder = data.turn
      const opts = data.turnData
      if (!v || (!data.point || data.point.corner != c.corner)) {
        if (opts.corner = corner, this._trigger('start', data.page, opts.tpage ? null : c.corner) == book.EVENT_PREVENTED) {
          return false
        }
        if (opts.pages[data.next] && data.effect != opts.pages[data.next].data('f').effect) {
          return false
        }
        if (data.effect == 'hard' && opts.status == 'turning') {
          let i = 0
          for (;i < opts.front.length; i++) {
            if (!opts.pages[opts.front[i]].hasClass('hard')) {
              that.prototype.stop.call(holder)
              break
            }
          }
        }
        if (!v) {
          opts.front.push(opts.display == book.DISPLAY_SINGLE ? 0 : data.next)
          opts.pageMv.push(data.page)
        }
        data.startPoint = data.startPoint || book.point2D(c.x, c.y)
        data.visible = true
        this._bringClipToFront(true)
        that.prototype.update.call(holder)
      }
      return this._setFoldedPagePosition(c, dataAndEvents), true
    }
    return false
  }
  results.prototype.hide = function () {
    const data = this.$el.data('f')
    const config = data.turnData
    const udataCur = book.translate(0, 0, config.options.acceleration)
    switch (data.effect) {
      case 'hard':
        const out = config.pages[data.over]
        data.ogradient.remove()
        data.igradient.remove()
        data.ipage.transform(udataCur)
        if (out) {
          out.data('f').ipage.transform(udataCur)
        }
        break
      case 'sheet':
        const $control = config.pageWrap[data.over]
        if ($control) {
          $control.css({
            overflow: 'hidden',
            'pointer-events': ''
          })
        }
        data.ipage.css({
          left: 0,
          top: 0,
          right: 'auto',
          bottom: 'auto'
        }).transform(udataCur)
        data.clip.transform(udataCur)
        data.ogradient.css({
          visibility: 'hidden'
        })
    }
    return data.visible && (config.front.length === 0 && that.prototype._removeFromDOM.call(data.turn)), data.status = '', data.visible = false, delete data.point, delete data.dpoint, delete data.startPoint, this.$el
  }
  results.prototype.hideFoldedPage = function (dataAndEvents) {
    const d = this.$el.data('f')
    if (d.dpoint) {
      const $scope = this
      const type = d.status
      const w = d.turnData
      const alpha = d.peel && d.peel.corner == d.dpoint.corner
      const hide = () => {
        if (dataAndEvents && (type == 'move' && alpha)) {
          d.status = 'peel'
        } else {
          $scope._animationCompleted(d.page, false)
        }
      }
      if (dataAndEvents) {
        const data = [d.dpoint, 0, 0, 0]
        data[3] = alpha ? this._startPoint(data[0].corner, book.point2D(d.peel.x, d.peel.y)) : this._startPoint(data[0].corner, book.point2D(0, 1))
        let dy = data[0].y - data[3].y
        dy = data[0].corner == 'tr' || data[0].corner == 'tl' ? Math.min(0, dy) / 2 : Math.max(0, dy) / 2
        data[1] = book.point2D(data[0].x, data[0].y + dy)
        data[2] = book.point2D(data[3].x, data[3].y - dy)
        this._animate(false)
        this._animate({
          from: 0,
          to: 1,
          frame (action) {
            $scope._fold(book.bezier(data, action, data[0].corner))
          },
          complete: hide,
          easing: w.options.easing,
          duration: 800,
          hiding: true
        })
      } else {
        this._animate(false)
        hide()
      }
    }
  }
  results.prototype.turnPage = function (key) {
    let position
    let path
    let elem = this.$el
    const data = elem.data('f')
    const config = data.turnData
    const styles = [0, 0, 0, 0]
    if (has3d = book.css3dAvailable(), config.display == book.DISPLAY_SINGLE && $.inArray(key, book.corners.forward) == -1) {
      const html = config.pages[data.next]
      const e = html.data('f')
      const pos = e.peel
      const _zIndex = parseInt(config.pageWrap[data.page].css('z-index'), 10) || 0
      path = e.dpoint ? e.dpoint.corner : key
      position = book.peelingPoint(config.direction == book.DIRECTION_LTR ? path.replace('l', 'r') : path.replace('r', 'l'))
      elem = html
      config.pageWrap[data.page - 1].show().css({
        zIndex: _zIndex + 1
      })
      styles[0] = e.dpoint ? book.point2D(e.dpoint.x, e.dpoint.y) : this._endPoint(position.corner)
      styles[1] = styles[0]
      styles[2] = this._startPoint(position.corner, book.point2D(0, 20))
      styles[3] = pos ? this._startPoint(position.corner, book.point2D(pos.x, pos.y)) : this._startPoint(position.corner)
    } else {
      const def = key == 'r' || key == 'l' ? 0 : config.options.elevation
      let errors = book.transformUnit(def, this.$el.height())
      path = data.dpoint ? data.dpoint.corner : key
      position = book.peelingPoint(path || this._cornerAllowed()[0])
      styles[0] = data.dpoint || this._startPoint(position.corner)
      styles[1] = data.dpoint ? styles[0] : this._startPoint(position.corner, book.point2D(0, errors))
      if (styles[0].x < 0 || styles[0].x > this.$el.width()) {
        errors = 0
      }
      styles[2] = this._endPoint(position.corner, book.point2D(0, errors))
      styles[3] = this._endPoint(position.corner)
    }
    elem.flip('_animate', false)
    if (elem.flip('_showFoldedPage', styles[0])) {
      if (data.turnData.options.autoCenter) {
        that.prototype.center.call(data.turn, data.next)
      }
      elem.flip('_animate', {
        from: 0,
        to: 1,
        easing: config.options.easing,
        frame (action) {
          elem.flip('_fold', book.bezier(styles, action, position.corner))
        },
        complete () {
          elem.flip('_animationCompleted', data.page, true)
        },
        duration: config.options.duration,
        turning: true
      })
    } else {
      elem.flip('_animationCompleted', data.page, true)
    }
    data.corner = null
  }
  results.prototype.isTurning = function () {
    return this.animation && this.animation.turning
  }
  results.prototype._showWhenHolding = function () {
    let message
    const e = this.$el
    const result = e.data('f')
    const node = result.turn
    const data = result.turnData
    if (result.holdingPoint) {
      const l = data.display == book.DISPLAY_SINGLE
      const elems = this._cornerAllowed()
      if (message = data.direction == book.DIRECTION_LTR ? l ? result.holdingPoint.x > e.width() / 2 ? 'r' : 'l' : data.options.showDoublePage ? result.page % 2 === 0 ? 'r' : 'l' : result.page % 2 === 0 ? 'l' : 'r' : l ? result.holdingPoint.x > e.width() / 2 ? 'l' : 'r' : data.options.showDoublePage ? result.page % 2 === 0 ? 'l' : 'r' : result.page % 2 === 0 ? 'r' : 'l', that.prototype.stop.call(node), this._animate(false), result.status = 'holding', ~$.inArray(message, elems)) {
        if (!data.tmpListeners) {
          data.tmpListeners = {}
          data.tmpListeners.tap = book.getListeners(node.$el, 'tap', true)
          data.tmpListeners.doubleTap = book.getListeners(node.$el, 'doubleTap', true)
        }
        const ast = book.peelingPoint(message, result.holdingPoint.x, result.holdingPoint.y)
        if (l) {
          if (this._detectSinglePage(ast, ast, true)) {
            result.corner = book.peelingPoint(message, result.holdingPoint.x, result.holdingPoint.y)
          }
        } else {
          if (this._showFoldedPage(ast, true)) {
            result.corner = book.peelingPoint(message, result.holdingPoint.x, result.holdingPoint.y)
          }
        }
      }
    }
  }
  results.prototype._pagePress = function (i) {
    const data = this.$el.data('f')
    const elem = data.turn
    if (!data.corner && (!data.disabled && !this.isTurning())) {
      const response = data.turnData
      response.status = 'tapping'
      data.status = 'tapping'
      const c = this._isIArea(i)
      if (!(response.options.hover || data.peel && data.peel.corner == c.corner)) {
        return response.status = '', void (data.status = '')
      }
      if (response.display == book.DISPLAY_SINGLE && (response.pages[data.next] && (data.effect != response.pages[data.next].data('f').effect && (response.pageObjs[data.next].hasClass('cover') && ~$.inArray(c.corner, book.corners.forward))))) {
        return response.status = '', void (data.status = '')
      }
      if (data.corner = c, data.startPoint = null, has3d = book.css3dAvailable(), data.corner && this._foldingPage()) {
        return that.prototype.update.call(elem), true
      }
      data.corner = null
      const offset = book.eventPoint(i)
      const parent = response.pageWrap[data.page].offset()
      offset.x -= parent.left
      offset.y -= parent.top
      if (response.options.smartFlip) {
        if (~$.inArray(data.page, that.prototype.view.call(elem))) {
          if (offset.x > 0) {
            if (offset.y > 0) {
              if (offset.x < this.$el.width()) {
                if (offset.y < this.$el.height()) {
                  data.holdingPoint = offset
                  data.startPoint = offset
                  data.holding = setTimeout($.proxy(this._showWhenHolding, this), 100)
                }
              }
            }
          }
        }
      }
    }
  }
  results.prototype._pageMove = function (e) {
    let position
    let offset
    let image
    let data
    const options = this.$el.data('f')
    if (!options.disabled) {
      if (e.preventDefault(), options.corner) {
        return image = options.turn, data = options.turnData, offset = data.pageWrap[options.page].offset(), options.status = 'move', position = book.eventPoint(e), position.x -= offset.left, position.y -= offset.top, position.corner = options.corner.corner, data.display == book.DISPLAY_SINGLE ? this._detectSinglePage(position, options.corner) : this._showFoldedPage(position), options.holdingPoint /* && book.cleanSelection() */, true
      }
      if (!this.animation) {
        if (position = this._isIArea(e)) {
          if (options.hover) {
            if (options.effect == 'sheet' && position.corner.length != 2) {
              return false
            }
            if (options.status != 'peel' || (!options.peel || options.peel.corner != position.corner)) {
              if (data = options.turnData, data.display == book.DISPLAY_SINGLE && data.page == data.totalPages) {
                return false
              }
              const pos = data.options.cornerPosition
              const initialOffset = this._startPoint(position.corner, book.point2D(pos.x, pos.y))
              options.status = 'peel'
              position.x = initialOffset.x
              position.y = initialOffset.y
              this._showFoldedPage(position, true)
            }
          }
        } else {
          if (options.status == 'peel') {
            if (!(options.peel && options.peel.corner == options.dpoint.corner)) {
              options.status = ''
              this.hideFoldedPage(true)
            }
          }
        }
      }
      return false
    }
  }
  results.prototype._pageUnpress = function () {
    const opts = this.$el.data('f')
    const corner = opts.corner
    const turn = opts.turn
    const response = opts.turnData
    if (!opts.disabled && (corner && (response.status != 'turning' && response.status != 'swiped'))) {
      let data = opts.point || corner
      const page = opts.page
      const width = this.$el.width()
      if (response.display == book.DISPLAY_SINGLE) {
        if (page == 1) {
          if (opts.status == 'tapping' || data.x < width / 2) {
            that.prototype._turnPage.call(turn, opts.next, data.corner)
          } else {
            this.hideFoldedPage(true)
          }
        } else {
          if (~$.inArray(data.corner, book.corners.forward)) {
            if (opts.status == 'tapping' || data.x < width / 2) {
              that.prototype._turnPage.call(turn, opts.next, data.corner)
            } else {
              this.hideFoldedPage(true)
            }
          } else {
            const d = response.pages[opts.page - 1]
            data = d.data('f').point
            if (opts.status == 'tapping' || data.x > 0.1 * width) {
              that.prototype._turnPage.call(turn, opts.page - 1, data ? data.corner : null)
              response.status = 'turning'
            } else {
              d.flip('turnPage', data.corner)
            }
          }
        }
      } else {
        if (response.display == book.DISPLAY_DOUBLE) {
          if (opts.status == 'tapping' || (data.x < 0 || data.x > width)) {
            that.prototype._turnPage.call(turn, opts.next, data.corner)
          } else {
            this.hideFoldedPage(true)
          }
        }
      }
    }
    if (opts.holdingPoint) {
      clearInterval(opts.holding)
      delete opts.holdingPoint
      delete opts.holding
    }
    opts.status = ''
    opts.corner = null
  }
  results.prototype._detectSinglePage = function (c, node, dataAndEvents) {
    const e = this.$el.data('f')
    const button = e.turn
    const data = e.turnData
    if (data.pageWrap[e.page].offset(), $.inArray(node.corner, book.corners.forward) == -1) {
      let b
      const d = data.pages[e.page - 1]
      const t = d.data('f')
      if (c.corner = data.direction == book.DIRECTION_LTR ? c.corner.replace('l', 'r') : c.corner.replace('r', 'l'), t.visible) {
        return b = d.flip('_showFoldedPage', c, false), data.corner = node.corner, b
      }
      const pos = d.flip('_endPoint', c.corner)
      return t.point = book.peelingPoint(c.corner, pos.x, pos.y), that.prototype.stop.call(button), b = d.flip('_showFoldedPage', c, true), data.corner = node.corner, b
    }
    return this._showFoldedPage(c, dataAndEvents)
  }
  results.prototype.disable = function (state) {
    return this.$el.data('f').disabled = state, this.$el
  }
  results.prototype.hover = function (hover) {
    return this.$el.data('f').hover = hover, this.$el
  }
  results.prototype.peel = function (e, dataAndEvents) {
    const p = this.$el.data('f')
    if (e.corner) {
      if ($.inArray(e.corner, book.corners.all) == -1) {
        throw book.turnError(`Corner ${e.corner} is not permitted`)
      }
      if (~$.inArray(e.corner, this._cornerAllowed())) {
        const exp = p.turnData
        const center = exp.options.cornerPosition
        e.x = e.x || center.x
        e.y = e.y || center.y
        const pos = this._startPoint(e.corner, book.point2D(e.x, e.y))
        p.peel = e
        p.status = 'peel'
        this._showFoldedPage(book.peelingPoint(e.corner, pos.x, pos.y), dataAndEvents)
      }
    } else {
      p.status = ''
      this.hideFoldedPage(dataAndEvents)
    }
    return this.$el
  }
  results.prototype._animationCompleted = function (name, code) {
    const options = this.$el.data('f')
    const async = options.turn
    const data = options.turnData
    if ((code || (!options.peel || options.peel.corner != options.dpoint.corner)) && (data.front.splice(data.front.indexOf(parseInt(options.next, 10)), 1), data.pageMv.splice(data.pageMv.indexOf(parseInt(options.page, 10)), 1), this.$el.css({
      visibility: 'hidden'
    }), this.hide(), data.front.length === 0 && (data.corner = null)), code) {
      const port = data.tpage || data.page
      if (port == options.next || port == options.page) {
        delete data.tpage
        that.prototype._fitPage.call(async, port || options.next)
      } else {
        data.pageWrap[options.page].hide()
      }
    } else {
      if (data.display == book.DISPLAY_SINGLE && name == data.tpage) {
        delete data.tpage
        that.prototype._fitPage.call(async, name)
      } else {
        that.prototype.update.call(async)
        that.prototype._updateShadow.call(async)
      }
    }
    this.$el.css({
      visibility: ''
    })
    this.$el.trigger('end', [name, code])
  }
  results.prototype._animate = function (animation) {
    if (!animation) {
      return void (this.animation && this.animation.stop())
    }
    if (this._animation) {
      this.animation._time = (new Date()).getTime()
      let i = 0
      for (;i < this.animation._elements; i++) {
        this.animation.from[i] = this._animation.current[i]
        this.animation.to[i] = animation.to[i] - this._animation.from[i]
      }
    } else {
      if (!animation.to.length) {
        animation.to = [animation.to]
      }
      if (!animation.from.length) {
        animation.from = [animation.from]
      }
      const options = this
      let r = true
      this.animation = $.extend({
        current: [],
        _elements: animation.to.length,
        _time: (new Date()).getTime(),
        stop () {
          r = false
          options.animation = null
        },
        _frame () {
          const t = Math.min(this.duration, (new Date()).getTime() - this._time)
          let i = 0
          for (;i < this._elements; i++) {
            this.current[i] = this.easing(t, this.from[i], this.to[i], this.duration)
          }
          r = true
          this.frame(this._elements == 1 ? this.current[0] : this.current)
          if (t >= this.duration) {
            this.stop()
            if (this.complete) {
              this.complete()
            }
          } else {
            window.requestAnimationFrame(() => {
              if (r) {
                options.animation._frame()
              }
            })
          }
        }
      }, animation)
      let j = 0
      for (;j < this.animation._elements; j++) {
        this.animation.to[j] -= this.animation.from[j]
      }
      this.animation._frame()
    }
  }
  results.prototype.destroy = function () {
    const g = this.$el.data('f')
    if (g.clip) {
      this._animate(false)
      g.clip.detach()
      delete g.clip
      delete g.igradient
      delete g.ogradient
      delete g.ipage
      delete g.turnData
      delete g.turn
    }
    this._destroy()
  }
  that.prototype.addPage = function (element, page, func) {
    const data = this._data
    if (data.destroying) {
      return null
    }
    let octalLiteral
    let activeClassName = ''
    let p = false
    const lastPage = data.totalPages + 1
    if (func = func || {}, (octalLiteral = /\bpage\-([0-9]+|last|next\-to\-last)\b/.exec($(element).attr('class'))) && (page = octalLiteral[1] == 'last' ? data.totalPages : octalLiteral[1] == 'next-to-last' ? data.totalPages - 1 : parseInt(octalLiteral[1], 10)), page) {
      if (lastPage >= page) {
        p = true
      } else {
        if (page > lastPage) {
          throw book.error(`Page "${page}" cannot be inserted`)
        }
      }
    } else {
      page = lastPage
      p = true
    }
    return page >= 1 && (lastPage >= page && (page in data.pageObjs && this._movePages(page, 1), p && (data.totalPages = lastPage), data.pageObjs[page] = $(element), data.pageObjs[page].hasClass('cover') || (activeClassName += 'page '), activeClassName += `page-${page} `, activeClassName += data.display == book.DISPLAY_DOUBLE ? page % 2 ? 'page-odd' : 'page-even' : 'page-odd', data.pageObjs[page].css({
      'float': 'left'
    }).addClass(activeClassName), data.pageObjs[page].data({
        f: func
      }), this._addPage(page), data.done && this._removeFromDOM())), this.$el
  }
  that.prototype._addPage = function (page) {
    const data = this._data
    const element = data.pageObjs[page]
    if (element) {
      if (this._pageNeeded(page)) {
        if (!data.pageWrap[page]) {
          data.pageWrap[page] = $('<div/>', {
            'class': 'page-wrapper',
            page,
            css: {
              position: 'absolute',
              overflow: 'hidden'
            }
          })
          this.$el.append(data.pageWrap[page])
          data.pageObjs[page].appendTo(data.pageWrap[page])
          const tmp = this._pageSize(page, true)
          element.css({
            width: tmp.width,
            height: tmp.height
          })
          data.pageWrap[page].css(tmp)
        }
        this._makeFlip(page)
      } else {
        data.pageObjs[page].remove()
      }
    }
  }
  that.prototype.hasPage = function (page) {
    return book.has(page, this._data.pageObjs)
  }
  that.prototype._pageSize = function (page) {
    const data = this._data
    const s = {}
    const w = this.$el.width()
    const value = this.$el.height()
    const element = data.pageObjs[page]
    if (data.display == book.DISPLAY_SINGLE) {
      s.width = w
      s.height = value
      s.top = 0
      s.left = 0
      s.right = 'auto'
      if (element.hasClass('page')) {
        s.top = data.pageMargin[0]
        s.width -= data.pageMargin[1]
        s.height -= data.pageMargin[0] + data.pageMargin[2]
      } else {
        if (page == 2) {
          if (element.hasClass('cover')) {
            s.left = -w
          }
        }
      }
    } else {
      if (data.display == book.DISPLAY_DOUBLE) {
        const width = Math.floor(w / 2)
        const val = value
        const l = page % 2
        s.top = 0
        if (element.hasClass('own-size')) {
          s.width = data.pageObjs[page].width()
          s.height = data.pageObjs[page].height()
        } else {
          s.width = width
          s.height = val
        }
        if (element.hasClass('page')) {
          s.top = data.pageMargin[0]
          s.width -= l ? data.pageMargin[1] : data.pageMargin[3]
          s.height -= data.pageMargin[0] + data.pageMargin[2]
        }
        if (data.direction != book.DIRECTION_LTR || data.options.showDoublePage) {
          s[l ? 'left' : 'right'] = width - s.width
          s[l ? 'right' : 'left'] = 'auto'
        } else {
          s[l ? 'right' : 'left'] = width - s.width
          s[l ? 'left' : 'right'] = 'auto'
        }
      }
    }
    return s
  }
  that.prototype._makeFlip = function (page) {
    const data = this._data
    if (!data.pages[page]) {
      let state
      const frameMasked = data.display == book.DISPLAY_SINGLE
      const even = page % 2
      state = frameMasked ? page + 1 : data.options.showDoublePage && !frameMasked ? even ? page - 1 : page + 1 : even ? page + 1 : page - 1
      if (data.options.blocks > 0) {
        if (!data.pageBlocks[page]) {
          data.pageBlocks[page] = {
            first: 0,
            last: 0
          }
        }
      }
      const tmp = this._pageSize(page)
      data.pages[page] = data.pageObjs[page].css({
        width: tmp.width,
        height: tmp.height
      }).flip({
        page,
        next: state
      }, this)
      if (data.z) {
        data.pageWrap[page].css({
          display: book.isFirefoxOrIE ? '' : data.z.pageV[page] ? 'none' : '',
          visibility: book.isFirefoxOrIE && data.z.pageV[page] ? 'hidden' : '',
          zIndex: data.z.pageZ[page] || 0
        })
      }
    }
    return data.pages[page]
  }
  that.prototype._makeRange = function () {
    let page
    const data = this._data
    if (data.totalPages > 0) {
      data.range = this.range()
      page = data.range[0]
      for (;page <= data.range[1]; page++) {
        if (data.pageObjs[page]) {
          if (!data.pageWrap[page]) {
            this._addPage(page)
          }
        }
      }
    }
  }
  that.prototype.range = function (page) {
    let numStyles
    let index
    let length
    let parts
    const data = this._data
    let max = data.totalPages
    if (data.options.blocks > 0) {
      let ms = this.getBlockPage(data.options.blocks)
      if (data.display == book.DISPLAY_DOUBLE) {
        if (data.options.showDoublePage) {
          ms += 1
        }
      }
      if (ms > max) {
        max = ms
        data.totalPages = max
      }
    }
    return page = page || (data.tpage || (data.page || 1)), parts = this._view(page), parts[1] = parts[1] || parts[0], parts[0] >= 1 && parts[1] <= max ? (numStyles = Math.floor((data.options.cacheSize - 2) / 2), max - parts[1] > parts[0] ? (index = Math.min(parts[0] - 1, numStyles), length = 2 * numStyles - index) : (length = Math.min(max - parts[1], numStyles), index = 2 * numStyles - length)) : (index = data.options.cacheSize - 1, length = data.options.cacheSize - 1), [Math.max(1, parts[0] - index),
      Math.min(max, parts[1] + length)]
  }
  that.prototype._pageNeeded = function (page) {
    if (page === 0) {
      return true
    }
    const data = this._data
    const range = data.range || this.range()
    return data.pageObjs[page].hasClass('cover') || (~data.pageMv.indexOf(page) || (~data.front.indexOf(page) || page >= range[0] && page <= range[1]))
  }
  that.prototype._removeFromDOM = function () {
    if (!this.isAnimating()) {
      let page
      const data = this._data
      for (page in data.pageWrap) {
        if (book.has(page, data.pageWrap)) {
          page = parseInt(page, 10)
          if (!this._pageNeeded(page)) {
            this._removePageFromDOM(page)
          }
        }
      }
    }
  }
  that.prototype.pageData = function (page, dataName) {
    const data = this._data
    return void 0 === dataName ? data.pageObjs[page].data('f') : void data.pageObjs[page].data('f', dataName)
  }
  that.prototype._removePageFromDOM = function (page, dataAndEvents) {
    const data = this._data
    this.view(page)
    let options
    const aliases = data.pageObjs
    const pages = data.pages
    if (page && this._trigger('removePage', page, aliases[page]) == book.EVENT_PREVENTED) {
      return false
    }
    if (data.pages[page] && (data.pages[page].flip('_bringClipToFront', false), data.pages[page].flip('destroy'), data.pages[page].detach(), delete data.pages[page]), aliases[page] && aliases[page].detach(), data.pageWrap[page] && (data.pageWrap[page].detach(), delete data.pageWrap[page]), data.dynamicMode || dataAndEvents) {
      if (options = data.pageBlocks[page]) {
        const n = options.last || options.first
        let i = options.first
        for (;n >= i; i++) {
          if (data.blocks[i]) {
            if (data.blocks[i].start) {
              if (!pages[data.blocks[i].start]) {
                if (!pages[data.blocks[i].end]) {
                  delete data.blocks[i]
                }
              }
            } else {
              delete data.blocks[i]
            }
          }
        }
        delete data.pageBlocks[page]
      }
      if (aliases[page]) {
        aliases[page].removeData()
        delete aliases[page]
      }
    }
    return true
  }
  that.prototype.removePage = function (page) {
    const data = this._data
    if (page == '*') {
      const param = this.range()
      let value = param[0]
      for (;value <= param[1]; value++) {
        this._removePageFromDOM(value, true)
      }
      data.options.blocks = 0
      data.totalPages = 0
    } else {
      if (page < 1 || page > data.totalPages) {
        throw book.turnError(`The page ${page} doesn't exist`)
      }
      if (data.pageObjs[page] && (this.stop(), !this._removePageFromDOM(page, true))) {
        return false
      }
      this._movePages(page, -1)
      data.totalPages = data.totalPages - 1
      if (data.page > data.totalPages) {
        data.page = null
        this._fitPage(data.totalPages)
      } else {
        this._makeRange()
        this.update()
      }
    }
    return this
  }
  that.prototype._movePages = function (newPage, recurring) {
    let page
    const that = this
    const data = this._data
    const d = data.display == book.DISPLAY_SINGLE
    const move = page => {
      const i = page + recurring
      const prev = i % 2
      const idx = prev ? ' page-odd ' : ' page-even '
      if (data.pageObjs[page]) {
        data.pageObjs[i] = data.pageObjs[page].removeClass(`page-${page} page-odd page-even`).addClass(`page-${i}${idx}`)
      }
      if (data.pageWrap[page]) {
        data.pageWrap[i] = data.pageObjs[i].hasClass('fixed') ? data.pageWrap[page].attr('page', i) : data.pageWrap[page].css(that._pageSize(i, true)).attr('page', i)
        if (data.pages[page]) {
          data.pages[i] = data.pages[page]
          data.pages[i].data('f').page = i
          data.pages[i].data('f').next = d ? i + 1 : data.options.showDoublePage ? prev ? i - 1 : i + 1 : prev ? i + 1 : i - 1
        }
        if (recurring) {
          delete data.pages[page]
          delete data.pageObjs[page]
          delete data.pageWrap[page]
        }
      }
    }
    if (recurring > 0) {
      page = data.totalPages
      for (;page >= newPage; page--) {
        move(page)
      }
    } else {
      page = newPage
      for (;page <= data.totalPages; page++) {
        move(page)
      }
    }
  }
  that.prototype._view = function (page) {
    const data = this._data
    return page = page || data.page, data.display == book.DISPLAY_DOUBLE ? data.options.showDoublePage ? page % 2 ? [page, page + 1] : [page - 1, page] : page % 2 ? [page - 1, page] : [page, page + 1] : page % 2 === 0 && (data.pages[page] && data.pages[page].hasClass('cover')) ? [page, page + 1] : [page]
  }
  that.prototype.view = function (page, dataAndEvents) {
    const data = this._data
    const els = this._view(page)
    const arr = []
    return dataAndEvents ? (els[0] > 0 && arr.push(els[0]), els[1] <= data.totalPages && arr.push(els[1])) : (els[0] > 0 ? arr.push(els[0]) : arr.push(0), els[1] && (els[1] <= data.totalPages ? arr.push(els[1]) : arr.push(0))), arr
  }
  that.prototype.pages = function (pages) {
    const data = this._data
    if (pages) {
      if (pages < data.totalPages) {
        let page = data.totalPages
        for (;page > pages; page--) {
          this.removePage(page)
        }
      }
      return data.totalPages = pages, this._fitPage(data.page), this.$el
    }
    return data.totalPages
  }
  that.prototype._missing = function (page) {
    const data = this._data
    if (data.totalPages < 1) {
      return void (data.options.blocks > 0 && this.$el.trigger('missing', [1]))
    }
    const args = data.range || this.range(page)
    const ret = []
    let next = args[0]
    for (;next <= args[1]; next++) {
      if (!data.pageObjs[next]) {
        ret.push(next)
      }
    }
    if (ret.length > 0) {
      this.$el.trigger('missing', [ret])
    }
  }
  that.prototype.pageElement = function (i) {
    return this._data.pageObjs[i]
  }
  that.prototype.next = function () {
    return this.page(this._view(this._data.page).pop() + 1)
  }
  that.prototype.previous = function () {
    return this.page(this._view(this._data.page).shift() - 1)
  }
  that.prototype._backPage = function (recurring) {
    const data = this._data
    if (recurring) {
      if (!data.pageObjs[0]) {
        const curr = $('<div />')
        data.pageObjs[0] = $(curr).css({
          'float': 'left'
        }).addClass('page page-0')
        this._addPage(0)
      }
    } else {
      if (data.pageObjs[0]) {
        this._removePageFromDOM(0, true)
      }
    }
  }
  that.prototype._isCoverPageVisible = function (page) {
    const data = this._data
    const totalPages = data.tpage || data.page
    return data.pageObjs[page].hasClass('cover') && (totalPages >= page && page % 2 === 0 || page >= totalPages && page % 2 === 1)
  }
  that.prototype.getBlockPage = function (st) {
    const data = this._data
    if (st < 1 || st > data.options.blocks) {
      return 0
    }
    if (st == 1) {
      return data.options.pages + 1
    }
    const pages = data.options.pages
    const endPage = pages % 2 === 0 ? pages : Math.min(0, pages - 1)
    return data.display == book.DISPLAY_DOUBLE ? data.options.showDoublePage ? 2 * st - 1 + endPage : 2 * st - 2 + endPage : st + data.options.pages
  }
  that.prototype.getPageBlock = function (i, dataAndEvents) {
    const data = this._data
    if (data.options.blocks) {
      if (dataAndEvents && (i && (data.pageBlocks[i] && data.pageBlocks[i].first))) {
        return data.pageBlocks[i].first
      }
      if (i == data.options.pages + 1) {
        return 1
      }
      if (i > data.options.pages) {
        if (dataAndEvents) {
          var diff
          const range = this.range()
          const breaks = this.view(data.page, true)
          let curr = 0
          let label_ = 0
          let fun = 0
          let last = 0
          let next = 0
          let t = range[0]
          for (;t <= range[1]; t++) {
            if (data.pageBlocks[t]) {
              if (!curr) {
                curr = data.pageBlocks[t].first
                fun = t
              }
              if (data.pageBlocks[t].last) {
                label_ = data.pageBlocks[t].last
                last = t
              }
              if (data.pageBlocks[t].first) {
                next = t
              }
            }
          }
          if (label_ === 0) {
            if (next) {
              label_ = data.pageBlocks[next].first
              last = next
            }
          }
          if (data.display == book.DISPLAY_DOUBLE) {
            if (data.options.showDoublePage) {
              if (i % 2 === 1) {
                if (i > breaks[breaks.length - 1]) {
                  if (last % 2 === 0) {
                    last -= 1
                  }
                  diff = label_ + (i - last) / 2
                } else {
                  if (i < breaks[0]) {
                    if (fun % 2 === 0) {
                      fun -= 1
                    }
                    diff = curr - (fun - i) / 2
                  } else {
                    diff = (i + 1) / 2
                  }
                }
              }
            } else {
              if (i % 2 === 0) {
                if (i > range[1]) {
                  if (last % 2 == 1) {
                    last -= 1
                  }
                  diff = label_ + (i - last + 2) / 2
                } else {
                  if (i < range[0]) {
                    if (fun % 2 == 1) {
                      fun -= 1
                    }
                    diff = curr - (fun - i + 2) / 2
                  } else {
                    diff = (i + 2) / 2
                  }
                }
              }
            }
          } else {
            diff = i > range[1] ? data.pageBlocks[range[1]].last + (i - range[1]) : i < range[0] ? data.pageBlocks[range[0]].first - (range[0] - i) : i - data.options.pages
          }
        } else {
          if (data.display == book.DISPLAY_DOUBLE) {
            if (data.options.showDoublePage) {
              if (i % 2 == 1) {
                diff = Math.ceil((i - data.options.pages + 1) / 2)
              }
            } else {
              if (i % 2 === 0) {
                diff = Math.ceil((i - data.options.pages + 2) / 2)
              }
            }
          } else {
            diff = i - data.options.pages
          }
        }
        return diff ? Math.max(2, diff) : 0
      }
    }
    return 0
  }
  that.prototype.getEndingBlockPage = function (id) {
    const data = this._data
    return id && data.pageObjs[id] ? data.pageObjs[id].data('f').endingBlock || -1 : -1
  }
  that.prototype.getBlockData = function (spec) {
    return spec = this._data.blocks[spec], spec ? spec.html : null
  }
  that.prototype.block = function (state) {
    const data = this._data
    if (void 0 === state) {
      const codeSegments = this.view(null, true)
      let type = codeSegments[0] > data.options.pages ? codeSegments[0] : 0
      const fx = codeSegments[codeSegments.length - 1] > data.options.pages ? codeSegments[codeSegments.length - 1] : 0
      if (type = type || fx) {
        const common = data.pageBlocks[type].first
        const ret = data.pageBlocks[fx].last || common
        return [common, ret]
      }
      return null
    }
    if (!(state >= 1 && state <= data.options.blocks)) {
      throw turnError(`Block "${state}" cannot be loaded`)
    }
    const className = this.getBlockPage(state)
    const _cleanPages = this.range()
    return this._cleanPages(_cleanPages[0], _cleanPages[1]), data.pageBlocks[className] = {
      first: state,
      last: 0
    }, this._fitPage(className), this.$el
  }
  that.prototype.replaceView = function (length, i) {
    const data = this._data
    const param = this.range()
    if (length != i && (length >= param[0] && length <= param[1])) {
      let charCode
      let $scope
      let even
      data.display == book.DISPLAY_SINGLE
      let page
      let id = i
      const classes = data.front.slice()
      const body = data.pageMv.slice()
      const start = i - length
      const CommandProxyMap = {}
      const done = {}
      const replace = {}
      const pages = {}
      const files = {}
      const checked = {}
      const viewItems = {}
      for (page in data.pageObjs) {
        if (book.has(page, data.pageObjs)) {
          if (page = parseInt(page, 10), length > page) {
            this._removePageFromDOM(page)
          } else {
            if (id = page + start, $scope = data.pageObjs[page].data('f'), even = id % 2, data.pageObjs[page].removeClass(`even odd p${page}`).addClass(`${even ? 'odd' : 'even'} p${id}`), data.pageWrap[page].attr('page', id), $scope = data.pageObjs[page].data('f'), $scope.page = id, ~(charCode = classes.indexOf(page)) && (data.front[charCode] = id), ~(charCode = body.indexOf(page)) && (data.pageMv[charCode] = id), data.z.pageV[page] && (CommandProxyMap[id] = true), data.z.pageZ[page] && (done[id] =
            data.z.pageZ[page]), $scope.next += start, $scope.over && ($scope.over += start), data.pageBlocks[page]) {
              let index = data.pageBlocks[page].first
              for (;index <= data.pageBlocks[page].last; index++) {
                if (data.blocks[index] && !viewItems[index]) {
                  data.blocks[index].start += start
                  data.blocks[index].end += start
                  var j = 0
                  for (;j < data.blocks[index].queue.length; j++) {
                    data.blocks[index].queue[j] += start
                  }
                  viewItems[index] = true
                }
              }
              if ((index = data.pageBlocks[page].waiting) && data.blocks[index]) {
                j = 0
                for (;j < data.blocks[index].queue.length; j++) {
                  data.blocks[index].queue[j] += start
                }
                viewItems[index] = true
              }
              checked[id] = data.pageBlocks[page]
            }
            replace[id] = data.pageObjs[page]
            pages[id] = data.pages[page]
            files[id] = data.pageWrap[page]
            files[id].css(this._pageSize(id, true))
          }
        }
      }
      data.pageObjs = replace
      data.pages = pages
      data.pageWrap = files
      data.pageBlocks = checked
      data.pageWrap = files
      data.z.pageV = CommandProxyMap
      data.z.pageZ = done
      data.range = this.range(i)
      data.page = data.page - length + i
      if (data.tpage) {
        data.tpage = data.tpage - length + i
        data.page = data.tpage
      }
      this._missing(i)
      this.update()
      if (data.options.autoCenter) {
        this.center()
      }
      console.log('replaced ', length, ' now:', data.page, data.tpage)
    }
    return this.$el
  }
  that.prototype.flow = function () {
    const data = this._data
    if (data.options.blocks && this.$el.is(':visible')) {
      let page
      const view = this.view(data.page, true)
      if (view[0] > data.options.pages) {
        page = view[0]
      } else {
        if (view[1] <= data.options.pages) {
          return
        }
        page = view[1]
      }
      const tree = (this.range(), data.pageObjs[page])
      const oAuthProvider = data.pageBlocks[page]
      const env = tree.data('f')
      const i = (env.flowTo ? tree.find(env.flowTo) : tree, oAuthProvider.last || oAuthProvider.first)
      data.blocks[i]
      return this.$el
    }
  }
  that.prototype._fitPage = function (i) {
    const data = this._data
    const state = this.view(i)
    if (data.display == book.DISPLAY_SINGLE) {
      if (data.pages[i]) {
        if (data.pages[i].hasClass('cover')) {
          if ($.inArray(i + 1, state) != -1) {
            i += 1
          }
        }
      }
    }
    data.range = this.range(i)
    this._missing()
    if (data.pageObjs[i]) {
      if ($.inArray(1, state) != -1) {
        this.$el.addClass('first-page')
      } else {
        this.$el.removeClass('first-page')
      }
      if (~$.inArray(data.totalPages, state)) {
        this.$el.addClass('last-page')
      } else {
        this.$el.removeClass('last-page')
      }
      data.status = ''
      data.peel = null
      data.page = i
      if (data.display != book.DISPLAY_SINGLE) {
        this.stop()
      }
      this._removeFromDOM()
      this._makeRange()
      this._updateShadow()
      this._cloneView(false)
      this.$el.trigger('turned', [i, state])
      this.update()
      if (data.options.autoCenter) {
        this.center()
      }
    }
  }
  that.prototype._turnPage = function (page, dir) {
    let current
    let prevMsgId
    let next
    const data = this._data
    const view = this.view()
    const values = this.view(page)
    const l = data.display == book.DISPLAY_SINGLE
    if (l) {
      current = view[0]
      next = values[0]
    } else {
      if (view[1] && page > view[1]) {
        current = view[1]
        next = values[0]
      } else {
        if (!(view[0] && page < view[0])) {
          return false
        }
        current = view[0]
        next = values[1]
      }
    }
    const coords = data.options.turnCorners.split(',')
    const e = data.pages[current].data('f')
    const change = e.dpoint
    if (e.next, dir || (dir = e.effect == 'hard' ? data.direction == book.DIRECTION_LTR ? page > current ? 'r' : 'l' : page > current ? 'l' : 'r' : data.direction == book.DIRECTION_LTR ? $.trim(coords[page > current ? 1 : 0]) : $.trim(coords[page > current ? 0 : 1])), l ? next > current && !data.pageMv.includes(current) ? this.stop() : current > next && (!data.pageMv.includes(next) && this.stop()) : data.display == book.DISPLAY_DOUBLE && (Math.abs((data.tpage || data.page) - page) > 2 &&
    this.stop()), data.page != page) {
      if (prevMsgId = data.page, this._trigger('turning', page, values, dir) == book.EVENT_PREVENTED) {
        return ~$.inArray(current, data.pageMv) && data.pages[current].flip('hideFoldedPage', true), false
      }
      if (~$.inArray(1, values)) {
        this.$el.addClass('first-page')
        this.$el.trigger('first')
      } else {
        this.$el.removeClass('first-page')
      }
      if (~$.inArray(data.totalPages, values)) {
        this.$el.addClass('last-page')
        this.$el.trigger('last')
      } else {
        this.$el.removeClass('last-page')
      }
    }
    return data.status = 'turning', data.range = this.range(page), this._missing(page), data.pageObjs[page] && (this._cloneView(false), data.tpage = next, this._makeRange(), e.dpoint = e.next != next ? null : change, e.next = next, prevMsgId = data.page, !data.pageMv.includes(next) ? data.pages[current].flip('turnPage', dir) : (data.options.autoCenter && this.center(next), data.status = '', data.pages[next].flip('hideFoldedPage', true)), prevMsgId == data.page && (data.page = page), this.update()),
    true
  }
  that.prototype.page = function (page) {
    const data = this._data
    if (void 0 === page) {
      return data.page
    }
    if (page = parseInt(page, 10), !(data.options.blocks > 0 && page == data.totalPages + 1)) {
      if (page > 0 && page <= data.totalPages) {
        if (page != data.page) {
          if (!data.done || ~$.inArray(page, this.view())) {
            this._fitPage(page)
          } else {
            if (!this._turnPage(page)) {
              return false
            }
          }
        }
        return this.$el
      }
      return false
    }
    this._fitPage(page)
  }
  that.prototype.center = function (out) {
    const data = this._data
    const size = this.size()
    let ml = 0
    if (!data.noCenter) {
      if (data.display == book.DISPLAY_DOUBLE) {
        const view = this.view(out || (data.tpage || data.page))
        if (data.direction == book.DIRECTION_LTR) {
          if (view[0]) {
            if (!view[1]) {
              ml += size.width / 4
            }
          } else {
            ml -= size.width / 4
          }
        } else {
          if (view[0]) {
            if (!view[1]) {
              ml -= size.width / 4
            }
          } else {
            ml += size.width / 4
          }
        }
      }
      this.$el.css({
        marginLeft: ml
      })
    }
    return this.$el
  }
  that.prototype.destroy = function () {
    const that = this._data
    return this._trigger('destroy') != book.EVENT_PREVENTED && (that.watchSizeChange = false, that.destroying = true, this.$el.undelegate(), this.$el.parent().off('start', this._eventPress), that.options.viewer.off('vmousemove', this._eventMove), $(document).off('vmouseup', this._eventRelease), this.removePage('*'), that.zoomer && that.zoomer.remove(), that.shadow && that.shadow.remove(), this._destroy()), this.$el
  }
  that.prototype.is = () => true
  that.prototype._getDisplayStr = i => i == book.DISPLAY_SINGLE ? 'single' : i == book.DISPLAY_DOUBLE ? 'double' : void 0
  that.prototype._getDisplayConst = idx => idx == book.DISPLAY_SINGLE ? idx : idx == book.DISPLAY_DOUBLE ? idx : idx == 'single' ? book.DISPLAY_SINGLE : idx == 'double' ? book.DISPLAY_DOUBLE : void 0
  that.prototype.display = function (options, display) {
    const data = this._data
    const el = this._getDisplayStr(data.display)
    if (void 0 === options) {
      return el
    }
    if (data.zoom == 1) {
      const type = this._getDisplayConst(options)
      if (!type) {
        throw book.turnError(`"${options}" is not a value for display`)
      }
      if (type != data.display) {
        const e = this._trigger('changeDisplay', options, el)
        if (!data.done || e != book.EVENT_PREVENTED) {
          switch (type) {
            case book.DISPLAY_SINGLE:
              this._backPage(true)
              this.$el.removeClass('display-double').addClass('display-single')
              break
            case book.DISPLAY_DOUBLE:
              this._backPage(false)
              this.$el.removeClass('display-single').addClass('display-double')
          }
          if (data.display = type, el) {
            if (void 0 === display || display) {
              const size = this.size()
              this.size(size.width, size.height)
              this.update()
            }
            this._movePages(1, 0)
            this.$el.removeClass(el)
          }
        }
        this.$el.addClass(this._getDisplayStr())
        this._cloneView(false)
        this._makeRange()
      }
    }
    return this.$el
  }
  that.prototype.isAnimating = function () {
    const data = this._data
    return data.pageMv.length > 0 || data.status == 'turning'
  }
  that.prototype.isFlipping = function () {
    const data = this._data
    return data.status == 'turning'
  }
  that.prototype.corner = function () {
    return this._data.corner || null
  }
  that.prototype.data = function () {
    return this._data
  }
  that.prototype.disable = function (id) {
    let i
    const data = this._data
    const elems = this.view()
    data.disabled = void 0 === id || id === true
    for (i in data.pages) {
      if (book.has(i, data.pages)) {
        data.pages[i].flip('disable', data.disabled ? true : $.inArray(parseInt(i, 10), elems) == -1)
      }
    }
    return this.$el
  }
  that.prototype._size = function (ratio, animate) {
    const canvas = this._defaultSize()
    return canvas.width = canvas.width * ratio, canvas.height = canvas.height * ratio, animate && (this._halfWidth() && (canvas.width = Math.floor(canvas.width / 2))), canvas
  }
  that.prototype.peel = function (message, funcToCall, millis, base) {
    const data = this._data
    if (message) {
      if (this.zoom() == 1) {
        if (base = void 0 !== base ? base : true, data.display == book.DISPLAY_SINGLE) {
          data.peel = book.peelingPoint(message, funcToCall, millis)
          data.pages[data.page].flip('peel', book.peelingPoint(message, funcToCall, millis), base)
        } else {
          const view = this.view()
          const page = ~$.inArray(message, corners.backward) ? view[0] : view[1]
          if (data.pages[page]) {
            data.peel = book.peelingPoint(message, funcToCall, millis)
            data.pages[page].flip('peel', data.peel, base)
          }
        }
      }
    } else {
      data.peel = null
      this.stop(true)
    }
    return this.$el
  }
  that.prototype._resizeObserver = function () {
    const data = this._data
    if (data && data.watchSizeChange) {
      const $cont = data.options.viewer
      const d = 10
      if (data.viewerWidth != $cont.width() || data.viewerHeight != $cont.height()) {
        data.viewerWidth = $cont.width()
        data.viewerHeight = $cont.height()
        this._resize()
      }
      data.monitorTimer = setTimeout($.proxy(this._resizeObserver, this), d)
    }
  }
  that.prototype.watchForSizeChanges = function (userid) {
    const data = this._data
    if (data.watchSizeChange != userid) {
      data.watchSizeChange = userid
      clearInterval(data.monitorTimer)
      this._resizeObserver()
    }
  }
  that.prototype._defaultSize = function (slash) {
    const data = this._data
    const width = data.viewerWidth - data.margin[1] - data.margin[3]
    const g = data.viewerHeight - data.margin[0] - data.margin[2]
    const s = typeof data.options.width === 'string' && ~data.options.width.indexOf('%')
    const w = book.transformUnit(data.options.width, width)
    const r2 = book.transformUnit(data.options.height, g)
    const rect = book.calculateBounds({
      width: w,
      height: r2,
      boundWidth: Math.min(data.options.width, width),
      boundHeight: Math.min(data.options.height, g)
    })
    if (data.options.responsive) {
      if (s) {
        if (g > width) {
          return {
            width: book.transformUnit(data.options.width, width),
            height: r2,
            display: book.DISPLAY_SINGLE
          }
        }
      } else {
        const img = book.calculateBounds({
          width: w / 2,
          height: r2,
          boundWidth: Math.min(data.options.width / 2, width),
          boundHeight: Math.min(data.options.height, g)
        })
        const len = data.viewerWidth * data.viewerHeight
        const count = len - rect.width * rect.height
        const max = len - img.width * img.height
        if (count > max && !slash || slash == book.DISPLAY_SINGLE) {
          return {
            width: img.width,
            height: img.height,
            display: book.DISPLAY_SINGLE
          }
        }
        if (rect.width % 2 !== 0) {
          rect.width -= 1
        }
      }
    }
    return {
      width: rect.width,
      height: rect.height,
      display: book.DISPLAY_DOUBLE
    }
  }
  that.prototype._calculateMargin = function () {
    let selector
    let matched
    const data = this._data
    const rquickExpr = /^(\d+(?:px|%))(?:\s+(\d+(?:px|%))(?:\s+(\d+(?:px|%))\s+(\d+(?:px|%)))?)$/
    if (selector = data.options.margin) {
      if (matched = rquickExpr.exec(selector)) {
        data.margin[0] = book.transformUnit(matched[1], data.viewerHeight)
        data.margin[1] = matched[2] ? book.transformUnit(matched[2], data.viewerWidth) : data.margin[0]
        data.margin[2] = matched[3] ? book.transformUnit(matched[3], data.viewerHeight) : data.margin[0]
        data.margin[3] = matched[4] ? book.transformUnit(matched[4], data.viewerWidth) : data.margin[1]
      }
    } else {
      data.margin = [0, 0, 0, 0]
    }
    if (selector = data.options.pageMargin) {
      if (matched = rquickExpr.exec(selector)) {
        data.pageMargin[0] = book.transformUnit(matched[1], data.viewerHeight)
        data.pageMargin[1] = matched[2] ? book.transformUnit(matched[2], data.viewerWidth) : data.pageMargin[0]
        data.pageMargin[2] = matched[3] ? book.transformUnit(matched[3], data.viewerHeight) : data.pageMargin[0]
        data.pageMargin[3] = matched[4] ? book.transformUnit(matched[4], data.viewerWidth) : data.pageMargin[1]
      }
    } else {
      data.pageMargin = [0, 0, 0, 0]
    }
  }
  that.prototype._resize = function () {
    let i
    let codeSegments
    let options
    const book = this._data
    if (book.options.responsive) {
      const data = this.view()
      book.options.viewer
      book.viewerWidth
      book.viewerHeight
      const obj = book.slider
      if (this._calculateMargin(), book.slider = null, options = this._defaultSize(), this.display(options.display, false), book.slider = obj, options.display != book.display && (options = this._defaultSize(book.display)), this.size(options.width * book.zoom, options.height * book.zoom), this.update(), book.zoomer) {
        options = this._defaultSize(book.display)
        i = 0
        for (;i < codeSegments.length; i++) {
          $(codeSegments[i]).css({
            width: options.width / data.length,
            height: options.height
          })
        }
      }
    }
  }
  that.prototype.calcVisiblePages = function () {
    const value = this
    const data = this._data
    if (!data.tpage) {
      data.page
    }
    let i
    let conditionIndex
    let codeSegments
    const pos = {
      pageZ: {},
      pageV: {}
    }
    if (this.isAnimating() && data.pageMv[0] !== 0) {
      const len = data.pageMv.length
      const l = data.front.length
      const end = data.display
      if (end == book.DISPLAY_SINGLE) {
        i = 0
        for (;len > i; i++) {
          nextPage = data.pages[data.pageMv[i]].data('f').next
          pos.pageV[data.pageMv[i]] = true
          pos.pageZ[data.pageMv[i]] = 3 + len - i
          pos.pageV[nextPage] = true
          if (data.pageObjs[data.pageMv[i]].hasClass('cover')) {
            pos.pageV[nextPage + 1] = true
          } else {
            pos.pageV[0] = true
            pos.pageZ[0] = 3 + len + 1
          }
        }
      } else {
        if (data.display == book.DISPLAY_DOUBLE) {
          i = 0
          for (;len > i; i++) {
            codeSegments = value.view(data.pageMv[i])
            conditionIndex = 0
            for (;conditionIndex < codeSegments.length; conditionIndex++) {
              pos.pageV[codeSegments[conditionIndex]] = true
            }
            pos.pageZ[data.pageMv[i]] = 3 + len - i
          }
          i = 0
          for (;l > i; i++) {
            codeSegments = value.view(data.front[i])
            pos.pageZ[data.front[i]] = 5 + len + i
            conditionIndex = 0
            for (;conditionIndex < codeSegments.length; conditionIndex++) {
              pos.pageV[codeSegments[conditionIndex]] = true
            }
          }
        }
      }
    } else {
      codeSegments = this.view(false, true)
      i = 0
      for (;i < codeSegments.length; i++) {
        pos.pageV[codeSegments[i]] = true
        pos.pageZ[codeSegments[i]] = 2
      }
      if (data.display == book.DISPLAY_SINGLE) {
        if (codeSegments[0] < data.totalPages) {
          if (data.pages[codeSegments[0]].hasClass('cover')) {
            if (data.pages[codeSegments[0] + 1]) {
              if (!data.pages[codeSegments[0] + 1].hasClass('cover')) {
                pos.pageV[codeSegments[0] + 1] = true
                pos.pageZ[codeSegments[0] + 1] = 2
              }
            }
          } else {
            pos.pageV[codeSegments[0] + 1] = true
            pos.pageZ[codeSegments[0] + 1] = 1
          }
        }
      } else {
        if (data.display == book.DISPLAY_DOUBLE) {
          if (codeSegments[0] > 2) {
            pos.pageV[codeSegments[0] - 2] = true
            pos.pageZ[codeSegments[0] - 2] = 1
          }
          if (codeSegments[1] < data.totalPages - 1) {
            pos.pageV[codeSegments[1] + 2] = true
            pos.pageZ[codeSegments[1] + 2] = 1
          }
        }
      }
    }
    let page
    for (page in data.pageWrap) {
      if (book.has(page, data.pageWrap)) {
        if (void 0 === pos.pageV[page]) {
          if (this._isCoverPageVisible(page)) {
            pos.pageV[page] = true
            pos.pageZ[page] = -1
          }
        }
      }
    }
    return pos
  }
  that.prototype.update = function () {
    let page
    let hover
    const data = this._data
    const pos = this.calcVisiblePages()
    if (this.isAnimating() && data.pageMv[0] !== 0) {
      const view = this.view()
      const n = this.view(data.tpage)
      hover = data.status === '' ? data.options.hover : false
      for (page in data.pageWrap) {
        if (book.has(page, data.pageWrap)) {
          data.pageWrap[page].css({
            display: book.isFirefoxOrIE ? '' : pos.pageV[page] ? '' : 'none',
            visibility: book.isFirefoxOrIE ? pos.pageV[page] ? '' : 'hidden' : '',
            zIndex: pos.pageZ[page] || 0
          })
          if (data.tpage) {
            data.pages[page].flip('hover', false).flip('disable', $.inArray(parseInt(page, 10), data.pageMv) == -1 && (page != n[0] && page != n[1]))
          } else {
            data.pages[page].flip('hover', hover).flip('disable', page != view[0] && page != view[1])
          }
        }
      }
    } else {
      hover = data.options.hover
      for (page in data.pageWrap) {
        if (book.has(page, data.pageWrap)) {
          data.pageWrap[page].css({
            display: book.isFirefoxOrIE ? '' : pos.pageV[page] ? '' : 'none',
            visibility: book.isFirefoxOrIE ? pos.pageV[page] ? '' : 'hidden' : '',
            zIndex: pos.pageZ[page] || 0
          })
          if (data.pages[page]) {
            data.pages[page].flip('disable', data.disabled || pos.pageZ[page] != 2).flip('hover', hover)
            if (!pos.pageV[page]) {
              data.pages[page].data('f').visible = false
            }
          }
        }
      }
    }
    return data.z = pos, this.$el
  }
  that.prototype._updateShadow = () => {
  }
  that.prototype.options = function (options) {
    if (void 0 === options) {
      return this._data.options
    }
    const data = this._data
    const swipe = data.options.swipe
    if ($.extend(data.options, options), options.pages && this.pages(options.pages), options.page && this.page(options.page), (options.margin || options.pageMargin) && (this._calculateMargin(), this._resize()), options.display && this.display(options.display), options.direction && this.direction(options.direction), options.width && (options.height && this.size(options.width, options.height)), options.swipe === true && swipe ? this.$el.on('swipe', $.proxy(this, '_eventSwipe')) : options.swipe ===
    false && this.$el.off('swipe', this._eventSwipe), options.cornerPosition) {
      const octalLiteral = options.cornerPosition.split(' ')
      data.options.cornerPosition = book.point2D(parseInt(octalLiteral[0], 10), parseInt(octalLiteral[1], 10))
    }
    if (options.margin && this._resize.call(this), options.animatedAutoCenter === true ? this.$el.css(book.addCssWithPrefix({
      '@transition': `margin-left ${options.duration}ms`
    })) : options.animatedAutoCenter === false && this.$el.css(book.addCssWithPrefix({
      '@transition': ''
    })), options.delegate) {
      let eventName
      for (eventName in options.delegate) {
        if (book.has(eventName, options.delegate)) {
          if (eventName == 'tap' || eventName == 'doubletap') {
            this.$el.off(eventName, '.page')
            this.$el.on(eventName, '.page', options.delegate[eventName])
          } else {
            this.$el.off(eventName).on(eventName, options.delegate[eventName])
          }
        }
      }
    }
    return this.$el
  }
  that.prototype.version = () => version
  that.prototype._getDirectionStr = i => i == book.DIRECTION_LTR ? 'ltr' : i == book.DIRECTION_RTL ? 'rtl' : void 0
  that.prototype._getDirectionConst = fragment => fragment == 'ltr' ? book.DIRECTION_LTR : fragment == 'rtl' ? book.DIRECTION_RTL : void 0
  that.prototype.direction = function (current) {
    const data = this._data
    const resultVec = this._getDirectionStr(data.direction)
    if (void 0 === current) {
      return resultVec
    }
    current = current.toLowerCase()
    const key = this._getDirectionConst(current)
    if (!key) {
      throw book.turnError(`"${current}" is not a value for direction`)
    }
    return current == 'rtl' && this.$el.attr('dir', 'ltr').css({
      direction: 'ltr'
    }), data.direction = key, data.done && this.size(this.$el.width(), this.$el.height()), this.$el
  }
  that.prototype.disabled = function (callback) {
    return void 0 === callback ? this._data.disabled === true : this.disable(callback)
  }
  that.prototype.size = function (w, n, obj) {
    if (void 0 === w || void 0 === n) {
      return {
        width: this.$el.width(),
        height: this.$el.height()
      }
    }
    let page
    let dimension
    let testWindow
    const data = this._data
    const keys = this.view()
    if (data.display == book.DISPLAY_DOUBLE ? (w = Math.floor(w), n = Math.floor(n), w % 2 == 1 && (w -= 1), testWindow = Math.floor(w / 2)) : testWindow = w, this.stop(), this.$el.css({
      width: w,
      height: n
    }), data.zoom > 1) {
      const a = {}
      let i = 0
      for (;i < keys.length; i++) {
        if (keys[i]) {
          a[keys[i]] = 1
        }
      }
      for (page in data.pageWrap) {
        if (book.has(page, data.pageWrap)) {
          if (this._isCoverPageVisible(page)) {
            a[page] = 1
          }
        }
      }
      for (page in a) {
        if (book.has(page, a)) {
          dimension = this._pageSize(page, true)
          if (!obj) {
            data.pageObjs[page].css({
              width: dimension.width,
              height: dimension.height
            })
          }
          data.pageWrap[page].css(dimension)
          if (data.pages[page]) {
            data.pages[page].flip('_restoreClip', false, true)
            data.pages[page].flip('resize', dimension.width, dimension.height)
          }
        }
      }
    } else {
      for (page in data.pageWrap) {
        if (book.has(page, data.pageWrap)) {
          dimension = this._pageSize(page, true)
          if (!(obj && $.inArray(parseInt(page, 10), keys) != -1)) {
            data.pageObjs[page].css({
              width: dimension.width,
              height: dimension.height
            })
          }
          data.pageWrap[page].css(dimension)
          if (data.pages[page]) {
            data.pages[page].flip('_restoreClip')
            data.pages[page].flip('resize', dimension.width, dimension.height)
          }
        }
      }
    }
    if (data.pages[0]) {
      data.pageWrap[0].css({
        left: -this.$el.width()
      })
      data.pages[0].flip('resize')
    }
    this._updateShadow()
    const _book = this
    const options = data.options
    return options.autoCenter && (options.animatedAutoCenter && data.done ? (this.$el.css(book.addCssWithPrefix({
      '@transition': ''
    })), _book.center(), setTimeout(() => {
        _book.$el.css(book.addCssWithPrefix({
          '@transition': `margin-left ${options.duration}ms`
        }))
      }, 0)) : this.center()), this.$el.css(this._position()), data.pages[0] && (page = data.pages[0].data('f').tPage, page && data.pageObjs[0].children().eq(0).css({
      width: data.pageObjs[data.page].width(),
      height: data.pageObjs[data.page].height()
    })), data.peel && this.peel(data.peel.corner, data.peel.x, data.peel.y, false), this.flow(), this.$el
  }
  that.prototype.stop = function () {
    let e
    let page
    const data = this._data
    if (this.isAnimating()) {
      const notUp = data.display == book.DISPLAY_SINGLE
      if (data.tpage) {
        data.page = data.tpage
        delete data.tpage
      }
      for (;data.pageMv.length > 0;) {
        if (page = data.pages[data.pageMv[0]], e = page.data('f')) {
          const source = e.peel
          e.peel = null
          page.flip('hideFoldedPage')
          e.peel = source
          e.next = notUp ? e.page + 1 : data.options.showDoublePage ? e.page % 2 === 0 ? e.page + 1 : e.page - 1 : e.page % 2 === 0 ? e.page - 1 : e.page + 1
          page.flip('_bringClipToFront', false)
        }
      }
      data.status = ''
      this.update()
    } else {
      for (page in data.pages) {
        if (book.has(page, data.pages)) {
          data.pages[page].flip('_bringClipToFront', false)
        }
      }
    }
    return this.$el
  }
  that.prototype._eventStart = function (e, dataAndEvents, charsetPart) {
    const data = this._data
    const opts = $(e.target).data('f')
    return data.display == book.DISPLAY_SINGLE && (charsetPart && (opts.next = charsetPart.charAt(1) == 'l' && data.direction == book.DIRECTION_LTR || charsetPart.charAt(1) == 'r' && data.direction == book.DIRECTION_RTL ? opts.next < opts.page ? opts.next : opts.page - 1 : opts.next > opts.page ? opts.next : opts.page + 1)), e.isDefaultPrevented() ? void this._updateShadow() : void this._updateShadow()
  }
  that.prototype._eventPress = function (e) {
    const that = this._data
    that.finger = book.eventPoint(e)
    that.hasSelection = ''
    let page
    for (page in that.pages) {
      if (book.has(page, that.pages) && that.pages[page].flip('_pagePress', e)) {
        return that.tmpListeners || (that.tmpListeners = {}, that.tmpListeners.tap = book.getListeners(this.$el, 'tap', true), that.tmpListeners.doubleTap = book.getListeners(this.$el, 'doubleTap', true)), e.preventDefault(), void (that.statusHolding = true)
      }
    }
    if (that.options.smartFlip) {
      e.preventDefault()
    }
  }
  that.prototype._eventMove = function (e) {
    let page
    const that = this._data
    for (page in that.pages) {
      if (book.has(page, that.pages)) {
        that.pages[page].flip('_pageMove', e)
      }
    }
    if (that.finger) {
      const prev = $.extend({}, that.finger)
      if (!that.tmpListeners) {
        that.tmpListeners = {}
        that.tmpListeners.tap = book.getListeners(this.$el, 'tap', true)
        that.tmpListeners.doubleTap = book.getListeners(this.$el, 'doubleTap', true)
      }
      that.finger = book.eventPoint(e)
      that.finger.prev = prev
    }
  }
  that.prototype._eventRelease = function (deepDataAndEvents) {
    const head = this
    const data = this._data
    if (setTimeout(() => {
      if (data.tmpListeners) {
        book.setListeners(head.$el, 'tap', data.tmpListeners.tap)
        book.setListeners(head.$el, 'doubleTap', data.tmpListeners.doubleTap)
        delete data.tmpListeners
      }
    }, 1), data.finger) {
      let page
      for (page in data.pages) {
        if (book.has(page, data.pages)) {
          data.pages[page].flip('_pageUnpress', deepDataAndEvents)
        }
      }
      delete data.finger
      if (data.statusHolding) {
        data.statusHolding = false
        if (!data.statusHover) {
          this._hasMotionListener(false)
        }
      }
    }
  }
  that.prototype._eventSwipe = function (a) {
    const data = this._data
    const ok = ''
    if (data.status != 'turning' && (data.zoom == 1 && data.hasSelection == ok)) {
      if (data.display == book.DISPLAY_SINGLE) {
        const i = data.page
        if (a.speed < 0) {
          if (~$.inArray(data.corner, book.corners.forward)) {
            this.next()
          } else {
            if (data.status = 'swiped', data.pages[i].flip('hideFoldedPage', true), i > 1) {
              const target = data.pages[i - 1].data('f').point
              data.pages[i - 1].flip('turnPage', target ? target.corner : '')
            }
          }
        } else {
          if (a.speed > 0) {
            if (~$.inArray(data.corner, book.corners.backward)) {
              this.previous()
            } else {
              data.status = 'swiped'
              data.pages[i].flip('hideFoldedPage', true)
            }
          }
        }
      } else {
        if (data.display == book.DISPLAY_DOUBLE) {
          if (a.speed < 0) {
            if (this.isAnimating()) {
              if (~$.inArray(data.corner, book.corners.forward)) {
                this.next()
              }
            } else {
              this.next()
            }
          } else {
            if (a.speed > 0) {
              if (this.isAnimating()) {
                if (~$.inArray(data.corner, book.corners.backward)) {
                  this.previous()
                }
              } else {
                this.previous()
              }
            }
          }
        }
      }
    }
  }
  that.prototype._eventHover = function () {
    const data = this._data
    clearInterval(data.noHoverTimer)
    data.statusHover = true
    this._hasMotionListener(true)
  }
  that.prototype._eventNoHover = function (datum) {
    const that = this
    const data = this._data
    data.noHoverTimer = setTimeout(() => {
      if (!data.statusHolding) {
        that._eventMove(datum)
        that._hasMotionListener(false)
      }
      delete data.noHoverTimer
      data.statusHover = false
    }, 10)
  }
  that.prototype._hasMotionListener = function (recurring) {
    const data = this._data
    if (recurring) {
      if (!data.hasMoveListener) {
        $(document).on('vmousemove', $.proxy(this, '_eventMove')).on('vmouseup', $.proxy(this, '_eventRelease'))
        data.hasMoveListener = true
      }
    } else {
      if (data.hasMoveListener) {
        $(document).off('vmousemove', this._eventMove).off('vmouseup', this._eventRelease)
        data.hasMoveListener = false
      }
    }
  }
  that.prototype._position = function (value) {
    const book = this._data
    const class2remove = value || book.zoom
    const data = value ? this._size(value) : this.size()
    const pos = {
      top: 0,
      left: 0
    }
    if (book.options.responsive && (pos.top = book.viewerHeight / 2 - data.height / 2, pos.left = book.viewerWidth / 2 - data.width / 2, class2remove == 1)) {
      const cursor = book.margin
      if (pos.top < cursor[0] || pos.top + data.height > book.viewerHeight - cursor[2]) {
        pos.top = cursor[0]
      }
      if (pos.left < cursor[1] || pos.left + data.width > book.viewerWidth - cursor[3]) {
        pos.left = cursor[3]
      }
    }
    return pos
  }
  that.prototype._cloneView = function (recurring) {
    const data = this._data
    if (recurring) {
      let pos
      let el
      let page
      const codeSegments = this.view()
      const state = {}
      const fileInput = $('<div />')
      fileInput.css(book.addCssWithPrefix({
        '@transform-origin': '0% 0%'
      }))
      fileInput.css({
        position: 'absolute',
        top: 0,
        left: 0,
        'z-index': 10,
        width: this.$el.width(),
        height: this.$el.height()
      })
      let i = 0
      for (;i < codeSegments.length; i++) {
        if (codeSegments[i]) {
          state[codeSegments[i]] = 1
        }
      }
      for (page in state) {
        if (book.has(page, state)) {
          pos = this._pageSize(page, true)
          pos.position = 'absolute'
          pos.zIndex = data.pageWrap[page].css('z-index')
          el = data.pageObjs[page].clone()
          el.css(pos)
          el.appendTo(fileInput)
        }
      }
      fileInput.appendTo(this.$el)
    }
  }
  results.prototype._pageCURL = function (e) {
    let rect
    let top
    let left
    let px
    let len
    let a
    let index
    let y
    let tubeRadius
    let radius
    let dY
    let dX
    let angle
    const data = this.$el.data('f')
    const config = data.turnData
    const width = this.$el.width()
    const height = this.$el.height()
    const $ = this
    let absPos = 0
    let that = book.point2D(0, 0)
    let size = book.point2D(0, 0)
    let pos = book.point2D(0, 0)
    const scale = (this._foldingPage(), config.options.acceleration)
    const h = data.clip.height()
    const compute = () => {
      rect = $._startPoint(e.corner)
      let angleMid
      const x = width - rect.x - e.x
      const y = rect.y - e.y
      let angle = Math.atan2(y, x)
      let i = Math.sqrt(x * x + y * y)
      const touch = book.point2D(width - rect.x - Math.cos(angle) * width, rect.y - Math.sin(angle) * width)
      if (i > width) {
        e.x = touch.x
        e.y = touch.y
      }
      const delta = book.point2D(0, 0)
      const diff = book.point2D(0, 0)
      if (delta.x = rect.x ? rect.x - e.x : e.x, delta.y = book.hasRotation ? rect.y ? rect.y - e.y : e.y : 0, diff.x = left ? width - delta.x / 2 : e.x + delta.x / 2, diff.y = delta.y / 2, angle = lastAngle - Math.atan2(delta.y, delta.x), angleMid = angle - Math.atan2(diff.y, diff.x), i = Math.sin(angleMid) * Math.sqrt(diff.x * diff.x + diff.y * diff.y), pos = book.point2D(i * Math.sin(angle), i * Math.cos(angle)), angle > lastAngle) {
        if (pos.x = pos.x + Math.abs(pos.y * delta.y / delta.x), pos.y = 0, Math.round(pos.x * Math.tan(PI - angle)) < height) {
          return e.y = Math.sqrt(height ** 2 + 2 * diff.x * delta.x), top && (e.y = height - e.y), compute()
        }
        const beta = PI - angle
        const dd = h - height / Math.sin(beta)
        that = book.point2D(Math.round(dd * Math.cos(beta)), Math.round(dd * Math.sin(beta)))
        if (left) {
          that.x = -that.x
        }
        if (top) {
          that.y = -that.y
        }
      }
      absPos = Math.round(100 * book.deg(angle)) / 100
      px = Math.round(pos.y / Math.tan(angle) + pos.x)
      const side = width - px
      let windowHeight = Math.min(height, side * Math.tan(angle))
      if (windowHeight < 0) {
        windowHeight = height
      }
      const sideX = side * Math.cos(2 * angle)
      const sideY = side * Math.sin(2 * angle)
      if (size = book.point2D(Math.round(left ? side - sideX : px + sideX), Math.round(top ? sideY : height - sideY)), config.options.gradients) {
        const coords = $._endPoint(e.corner)
        index = Math.sqrt((coords.x - e.x) ** 2 + (coords.y - e.y) ** 2) / width
        len = Math.min(100, side * Math.sin(angle))
        a = 1.3 * Math.min(side, windowHeight)
      }
      return pos.x = Math.round(pos.x), pos.y = Math.round(pos.y), true
    }
    const init = (pos, nodeLength, opt_attributes, angle) => {
      const f = ['0', 'auto']
      const i = (width - h) * opt_attributes[0] / 100
      const err = (height - h) * opt_attributes[1] / 100
      const v = {
        left: f[nodeLength[0]],
        top: f[nodeLength[1]],
        right: f[nodeLength[2]],
        bottom: f[nodeLength[3]]
      }
      const offset = angle != 90 && angle != -90 ? left ? -1 : 1 : 0
      const later = `${opt_attributes[0]}% ${opt_attributes[1]}%`
      const g = config.pages[data.over].data('f')
      const x = data.clip.parent().position().left - config.pageWrap[data.over].position().left
      if (data.ipage.css(v).transform(book.rotate(angle) + book.translate(pos.x + offset, pos.y, scale), later), g.ipage.css(v).transform(book.rotate(angle) + book.translate(pos.x + size.x - that.x - width * opt_attributes[0] / 100, pos.y + size.y - that.y - height * opt_attributes[1] / 100, scale) + book.rotate(Math.round(100 * (180 / angle - 2) * angle) / 100), later), data.clip.transform(book.translate(-pos.x + i - offset, -pos.y + err, scale) + book.rotate(-angle), later), g.clip.transform(book.translate(x -
      pos.x + that.x + i, -pos.y + that.y + err, scale) + book.rotate(-angle), later), config.options.gradients) {
        let camelKey
        let rotation
        let tx
        if (top) {
          if (left) {
            rotation = angle - 90
            tx = px - 50
            len = -len
            camelKey = '50% 25%'
          } else {
            rotation = angle - 270
            tx = width - px - 50
            camelKey = '50% 25%'
          }
        } else {
          if (left) {
            tx = px - 50
            rotation = angle - 270
            len = -len
            camelKey = '50% 75%'
          } else {
            tx = width - px - 50
            rotation = angle - 90
            camelKey = '50% 75%'
          }
        }
        let change = Math.max(0.5, 2 - index)
        if (change > 1) {
          change = change >= 1.7 ? (2 - change) / 0.3 : 1
        }
        g.igradient.css({
          opacity: Math.round(100 * change) / 100
        }).transform(book.translate(tx, 0, scale) + book.rotate(rotation) + book.scale(len / 100, 1, scale), camelKey)
        if (top) {
          if (left) {
            rotation = -270 - angle
            a = -a
            tx = width - px - 20
            camelKey = '20% 25%'
          } else {
            rotation = -90 - angle
            tx = px - 20
            camelKey = '20% 25%'
          }
        } else {
          if (left) {
            rotation = -90 - angle
            tx = width - px - 20
            a = -a
            camelKey = '20% 75%'
          } else {
            rotation = 90 - angle
            tx = px - 20
            camelKey = '20% 75%'
          }
        }
        change = index < 0.3 ? index / 0.3 : 1
        data.ogradient.css({
          opacity: Math.round(100 * change) / 100
        }).transform(book.translate(tx, 0, scale) + book.rotate(rotation) + book.scale(-a / 100, 1, scale), camelKey)
      }
    }
    switch (data.point = book.peelingPoint(e.corner, e.x, e.y), e.corner) {
      case 'l':
        dY = e.y - data.startPoint.y
        dX = e.x
        angle = Math.atan2(dY, dX)
        if (angle > 0) {
          y = data.startPoint.y
          tubeRadius = Math.sqrt(dX * dX + dY * dY)
          radius = 2 * y * Math.sin(angle) + tubeRadius
          e.x = radius * Math.cos(angle)
          e.y = radius * Math.sin(angle)
          e.corner = 'tl'
          left = true
          top = true
          compute()
          init(pos, [1, 0, 0, 1], [100, 0], absPos)
        } else {
          angle = -angle
          y = height - data.startPoint.y
          tubeRadius = Math.sqrt(dX * dX + dY * dY)
          radius = 2 * y * Math.cos(lastAngle - angle) + tubeRadius
          e.x = radius * Math.cos(angle)
          e.y = height - radius * Math.sin(angle)
          e.corner = 'bl'
          left = true
          compute()
          init(book.point2D(pos.x, -pos.y), [1, 1, 0, 0], [100, 100], -absPos)
        }
        break
      case 'r':
        dY = data.startPoint.y - e.y
        dX = width - e.x
        angle = Math.atan2(dY, dX)
        if (angle < 0) {
          y = data.startPoint.y
          angle = -angle
          tubeRadius = Math.sqrt(dX * dX + dY * dY)
          radius = 2 * y * Math.sin(angle) + tubeRadius
          e.x = width - radius * Math.cos(angle)
          e.y = radius * Math.sin(angle)
          e.corner = 'tr'
          top = true
          compute()
          init(book.point2D(-pos.x, pos.y), [0, 0, 0, 1], [0, 0], -absPos)
        } else {
          y = height - data.startPoint.y
          tubeRadius = Math.sqrt(dX * dX + dY * dY)
          radius = 2 * y * Math.cos(lastAngle - angle) + tubeRadius
          e.x = width - radius * Math.cos(angle)
          e.y = height - radius * Math.sin(angle)
          e.corner = 'br'
          compute()
          init(book.point2D(-pos.x, -pos.y), [0, 1, 1, 0], [0, 100], absPos)
        }
        break
      case 'tl':
        top = true
        left = true
        e.x = Math.max(e.x, 1)
        data.point.x = e.x
        rect = this._startPoint('tl')
        compute()
        init(pos, [1, 0, 0, 1], [100, 0], absPos)
        break
      case 'tr':
        top = true
        e.x = Math.min(e.x, width - 1)
        data.point.x = e.x
        compute()
        init(book.point2D(-pos.x, pos.y), [0, 0, 0, 1], [0, 0], -absPos)
        break
      case 'bl':
        left = true
        e.x = Math.max(e.x, 1)
        data.point.x = e.x
        compute()
        init(book.point2D(pos.x, -pos.y), [1, 1, 0, 0], [100, 100], -absPos)
        break
      case 'br':
        e.x = Math.min(e.x, width - 1)
        data.point.x = e.x
        compute()
        init(book.point2D(-pos.x, -pos.y), [0, 1, 1, 0], [0, 100], absPos)
    }
  }
  book.widgetFactory('turn', that)
  book.widgetFactory('flip', results)
})(jQuery, this, document)
