import { Link } from "@remix-run/react"
import Konva from 'konva/lib/Core';
import { Rect as KonvaRect } from 'konva/lib/shapes/Rect'
import { Arrow as KonvaArrow } from 'konva/lib/shapes/Arrow'
import { Stage as KonvaStage } from 'konva/lib/Stage'
import { Image as KonvaImage } from 'konva/lib/shapes/Image'
import { Transformer as KonvaTransformer } from 'konva/lib/shapes/Transformer'
import { useEffect, useRef } from "react"
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
  const stage = useRef<KonvaStage | null>(null)
  const {annotationToolsView, color, strokeWidth, shape} = useAnnotationTools()

  // canvasの初期化
  useEffect(() => {
    if(!image) { return }

    const stg = new KonvaStage({
      container: 'container',
      width: width,
      height: height,
    })
    stage.current = stg

    const layer = new Konva.Layer()
    stg.add(layer)

    const bg = new KonvaImage({
      x: 0, y: 0, image, width, height
    })
    layer.add(bg)

    const tr = new KonvaTransformer({ignoreStroke: true})
    layer.add(tr)

    // クリック時のオブジェクトの選択
    stg.on('click tap', (e) => {
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
      stg.destroy()
    }
  }, [image, width, height])

  useEffect(() => {
    const stg = stage.current
    if(!stg) { return }
    const bg = stg.children[0].children[0]
    if(!bg) { return }

    let obj: KonvaRect | KonvaArrow | null = null
    let isMousedown = false

    stg.on('mousedown touchstart', (e) => {
      if(e.target !== bg){ return }
      obj = null
      isMousedown = true
      const pos = stg.getPointerPosition()
      if (!pos){ return }

      switch(shape) {
        case 'rect':
          obj = new KonvaRect({
            name: 'annotation',
            x: pos.x,
            y: pos.y,
            width: 1,
            height: 1,
            draggable: true,
            stroke: color,
            strokeWidth,
          })

          keepStrokeWidth(obj, strokeWidth)
          break
        case 'arrow':
          obj = new KonvaArrow({
            name: 'annotation',
            x: pos.x,
            y: pos.y,
            points: [0, 0, 0, 0],
            pointerLength: 15,
            pointerWidth: 15,
            fill: color,
            stroke: color,
            strokeWidth,
            draggable: true,
          })
          break
      }

      if(obj) {
        stg.children[0].add(obj)
      }
    })

    stg.on('mousemove touchmove', () => {
      const pos = stg.getPointerPosition()
      if (!pos || !obj || !isMousedown){ return }

      if(obj instanceof KonvaRect){
        obj.width(pos.x - obj.x())
        obj.height(pos.y - obj.y())
      }
      else if(obj instanceof KonvaArrow){
        const points = obj.points()
        const arrowLength = Math.sqrt((pos.x - obj.x()) ** 2 + (pos.y - obj.y()) ** 2)
        points[2] = arrowLength

        const angle = Math.atan2(pos.y - obj.y(), pos.x - obj.x())
        obj.points(points)
        obj.rotation(angle * 180 / Math.PI)
      }
    })

    stg.on('mouseup touchend', () => {
      isMousedown = false
    })

    return () => {
      stg.off('mousedown mousemove mouseup touchstart touchmove touchend')
    }
  }, [image, color, shape, strokeWidth])

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
