export class DragResizeBorder {
  constructor (selectorName, min = 200, max = 500) {
    this.sensitivityZone = 10
    this.min = min
    this.max = max
    this.panel = document.querySelector(selectorName)
    this.hand = this.panel.querySelector('.resize-hand')
    this.m_pos = 0
    this.onResize = e => {
      const dx = this.m_pos - e.x
      this.m_pos = e.x
      let width = (parseInt(getComputedStyle(this.panel, '').width) - dx)
      if (width >= max) {
        width = max
      } else if (width <= min) {
        width = min
      }
      this.panel.style.width = width + 'px'
    }

    this.onResizeOn = () => {
      this.hand.style.cursor = 'col-resize'
      this.setVendorProperty(document.querySelector('body'), 'userSelect', 'none')
    }

    this.onResizeOff = () => {
      this.hand.style.cursor = 'default'
      this.setVendorProperty(document.querySelector('body'), 'userSelect', '')
    }

    this.isDragArea = (e) => {
      const inZone =
        e.pageX > e.currentTarget.offsetWidth + e.currentTarget.getBoundingClientRect().left - this.sensitivityZone
      return inZone
    }
    this.addListeners()
  }

  addListeners () {
    this.hand.addEventListener(
      'mousedown',
      e => {
        if (!this.isDragArea(e)) {
          return
        }
        this.m_pos = e.x
        this.hand.classList.add('afterHandResize')
        document.addEventListener('mousemove', this.onResize, true)
      },
      true
    )

    document.addEventListener(
      'mouseup',
      () => {
        document.removeEventListener('mousemove', this.onResize, true)
      },
      true
    )

    this.hand.addEventListener(
      'mousemove',
      e => {
        this.onResizeOn()
        // if (this.isDragArea(e)) {
        //   this.onResizeOn()
        // } else {
        //   this.onResizeOff()
        // }
      },
      true
    )
    this.hand.addEventListener(
      'mouseout',
      e => {
        this.onResizeOff()
      },
      true
    )
  }

  setVendorProperty (element, property, value) {
    element.style['webkit' + (property[0].toUpperCase() + property.slice(1))] = value
    element.style['Moz' + (property[0].toUpperCase() + property.slice(1))] = value
    element.style['ms' + (property[0].toUpperCase() + property.slice(1))] = value
    element.style[property] = value
  }
}
