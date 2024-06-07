import { Link } from "@remix-run/react"
import Konva from "konva/lib/Core"
import { Rect as KonvaRect } from 'konva/lib/shapes/Rect'
import { Arrow as KonvaArrow } from 'konva/lib/shapes/Arrow'
import { Layer as KonvaLayer } from 'konva/lib/Layer'
import { Image as KonvaImage } from 'konva/lib/shapes/Image'
import { Transformer as KonvaTransformer } from 'konva/lib/shapes/Transformer'
import { useCallback, useEffect, useRef } from "react"
import { useAnnotationTools } from "~/hooks/use_annotation_tools"
import { useImageLoader } from "~/hooks/use_image_loader"

// 拡縮時の枠線の太さを固定
const keepStrokeWidth = (obj: KonvaRect, strokeWidth: number) => {
  obj.on('transform', () => {
    obj.setAttrs({
      width: Math.max(obj.width() * obj.scaleX(), strokeWidth),
      height: Math.max(obj.height() * obj.scaleY(), strokeWidth),
      scaleX: 1,
      scaleY: 1,
    })
  })
}

export default function ShowKonva() {
  const {image, width, height, onChangeFile} = useImageLoader()
  const layer = useRef<KonvaLayer | null>(null)

  // 四角の枠の描画
  const createStrokedRect = useCallback((color: string, strokeWidth: number) => {
    if(!layer.current) { return }

    const rect = new KonvaRect({
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

    keepStrokeWidth(rect, strokeWidth)
  }, [height, width])

  // 矢印の作成
  const createArrow = useCallback((color: string, strokeWidth: number) => {
    if(!layer.current) { return }

    const arrow = new KonvaArrow({
      name: 'annotation',
      x: Math.random() * width,
      y: Math.random() * height,
      points: [0, 0, 100, 0],
      pointerLength: 15,
      pointerWidth: 15,
      fill: color,
      stroke: color,
      strokeWidth,
      draggable: true,
    })

    layer.current.add(arrow)
  }, [height, width])

  const {annotationToolsView} = useAnnotationTools({ createStrokedRect, createArrow })

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

    const bg = new KonvaImage({
      x: 0, y: 0, image, width, height
    })
    layer.current.add(bg)

    const tr = new KonvaTransformer({ignoreStroke: true})
    layer.current.add(tr)

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

      selecting = true;
    });

    stage.on('mousemove touchmove', (e) => {
      if (!selecting) { return }
      const pos = stage.getPointerPosition()
      if (!pos){ return }
      e.evt.preventDefault()
      x2 = pos.x
      y2 = pos.y

      // selectionRect.setAttrs({
      //   visible: true,
      //   x: Math.min(x1, x2),
      //   y: Math.min(y1, y2),
      //   width: Math.abs(x2 - x1),
      //   height: Math.abs(y2 - y1),
      // })
    })

    stage.on('mouseup touchend', (e) => {
      if (!selecting) { return }

      e.evt.preventDefault()
      selecting = false
    });

    // クリック時のオブジェクトの選択
    stage.on('click tap', (e) => {
      if (selecting) { return }
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
