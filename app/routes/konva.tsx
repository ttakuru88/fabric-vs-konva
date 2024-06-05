import { Link } from "@remix-run/react"
import Konva from "konva"
import { useCallback, useEffect, useRef } from "react"
import { useAnnotationTools } from "~/hooks/use_annotation_tools"
import { useImageLoader } from "~/hooks/use_image_loader"

export default function ShowKonva() {
  const {image, width, height, onChangeFile} = useImageLoader()
  const layer = useRef<Konva.Layer | null>(null)

  // 四角の枠の描画
  const createStrokedRect = useCallback((color: string, strokeWidth: number) => {
    if(!layer.current) { return }

    const rect = new Konva.Rect({
      name: 'annotation',
      x: Math.random() * width,
      y: Math.random() * height,
      width: 100,
      height: 100,
      draggable: true,
      stroke: color,
      strokeWidth,
    })
    layer.current.add(rect)

    // 拡縮時の枠線の太さを固定
    rect.on('transform', () => {
      rect.setAttrs({
        width: Math.max(rect.width() * rect.scaleX(), strokeWidth),
        height: Math.max(rect.height() * rect.scaleY(), strokeWidth),
        scaleX: 1,
        scaleY: 1,
      })
    })
  }, [height, width])

  const {annotationToolsView} = useAnnotationTools({ createStrokedRect })

  // canvasの初期化
  useEffect(() => {
    if(!image) { return }

    const stage = new Konva.Stage({
      container: 'container',
      width: width,
      height: height,
    })

    layer.current = new Konva.Layer()
    stage.add(layer.current)

    const bg = new Konva.Image({
      x: 0, y: 0, image, width, height
    })
    layer.current.add(bg)

    const tr = new Konva.Transformer({ignoreStroke: true})
    layer.current.add(tr)

    // 選択範囲の矩形を用意
    const selectionRect = new Konva.Rect({
      fill: 'rgba(0,0,255,0.5)',
      visible: false,
      listening: false,
    })
    layer.current.add(selectionRect)

    // 選択範囲の矩形を表示
    let x1: number, y1: number, x2: number, y2: number
    let selecting: boolean = false
    stage.on('mousedown touchstart', (e) => {
      if (e.target !== bg) { return }
      const pos = stage.getPointerPosition()
      if (!pos){ return }

      e.evt.preventDefault()
      x1 = x2 = pos.x
      y1 = y2 = pos.y

      selectionRect.width(0)
      selectionRect.height(0)
      selecting = true;
    });

    stage.on('mousemove touchmove', (e) => {
      if (!selecting) { return }
      const pos = stage.getPointerPosition()
      if (!pos){ return }
      e.evt.preventDefault()
      x2 = pos.x
      y2 = pos.y

      selectionRect.setAttrs({
        visible: true,
        x: Math.min(x1, x2),
        y: Math.min(y1, y2),
        width: Math.abs(x2 - x1),
        height: Math.abs(y2 - y1),
      })
    })

    stage.on('mouseup touchend', (e) => {
      selecting = false;
      if (!selectionRect.visible()) {return }
      e.evt.preventDefault()

      setTimeout(() => {
        selectionRect.visible(false)
      })
      const shapes = stage.find('.annotation')
      const box = selectionRect.getClientRect()
      const selected = shapes.filter((shape) =>
        Konva.Util.haveIntersection(box, shape.getClientRect())
      )

      tr.nodes(selected)
    });

    // クリック時のオブジェクトの選択
    stage.on('click tap', (e) => {
      if (selectionRect.visible()) { return }
      if (e.target === bg) {
        tr.nodes([])
        return
      }
      if (!e.target.hasName('annotation')) { return }

      const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey
      const isSelected = tr.nodes().indexOf(e.target) >= 0
      if (!metaPressed && !isSelected) {
        tr.nodes([e.target])
      } else if (metaPressed && isSelected) {
        const nodes = tr.nodes().slice()
        nodes.splice(nodes.indexOf(e.target), 1)
        tr.nodes(nodes)
      } else if (metaPressed && !isSelected) {
        const nodes = tr.nodes().concat([e.target])
        tr.nodes(nodes)
      }
    })

    return () => {
      stage.destroy()
    }
  }, [image, width, height])

  return (
    <div>
      <Link to={'/'}>Back</Link>
      <h1>Konva</h1>

      <input type="file" onChange={onChangeFile} />

      { image && annotationToolsView}

      <div id="container"></div>
    </div>
  )
}
