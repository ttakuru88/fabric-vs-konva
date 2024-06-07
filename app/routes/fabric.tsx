import { Link } from "@remix-run/react"
import { Canvas, FabricImage, Rect, Line, Triangle, Group} from 'fabric'
import { useEffect, useRef } from "react"
import { useAnnotationTools } from "~/hooks/use_annotation_tools"
import { useImageLoader } from "~/hooks/use_image_loader"

export default function ShowFabric() {
  const canvas = useRef<Canvas | null>(null)
  const {image, width, height, onChangeFile} = useImageLoader()
  const {annotationToolsView, color, strokeWidth, shape} = useAnnotationTools()

  // canvasの初期化
  useEffect(() => {
    if(!image) { return }

    const c = new Canvas('canvas', {width, height, selection: false})

    const img = new FabricImage(image, {
      selectable: false,
      scaleX: width / image.width,
      scaleY: height / image.height,
    })
    c.add(img)

    canvas.current = c

    return () => {
      c.dispose()
    }
  }, [image, width, height])

  useEffect(() => {
    const c = canvas.current
    if(!c) { return }

    let obj: Rect | Group | null = null
    let isMousedown = false

    c.on('mouse:down',(e) => {
      isMousedown = true
      let pos: {x: number, y: number}, bar: Line, pointerWidth: number, pointerLength: number, pointer: Triangle
      switch(shape){
        case 'rect':
          obj = new Rect({
            left: e.scenePoint.x,
            top: e.scenePoint.y,
            width: 1,
            height: 1,
            fill: 'transparent',
            stroke: color,
            strokeUniform: true,
            strokeWidth,
          })
          break
        case 'arrow':
          pos = {
            x: e.scenePoint.x,
            y: e.scenePoint.y,
          }
          bar = new Line([pos.x, pos.y, pos.x + 100, pos.y],{
            strokeWidth,
            stroke: color,
          })

          pointerWidth = strokeWidth * 3
          pointerLength = strokeWidth * 3
          pointer = new Triangle({
            width: 1,
            height: pointerLength,
            fill: color,
            left: pos.x + 100 + pointerLength,
            top: pos.y - pointerWidth / 2,
            angle: 90,
          })

          obj = new Group([bar, pointer])
          break
      }

      if(obj){
        c.add(obj)
      }
    })

    c.on('mouse:move', (e) => {
      if(!isMousedown || !obj) { return}

      if(obj instanceof Rect){
        obj.set({
          width: e.scenePoint.x - obj.left,
          height: e.scenePoint.y - obj.top
        })
      } else if(obj instanceof Group){
        const arrowLength = Math.sqrt((e.scenePoint.x - obj.left) ** 2 + (e.scenePoint.y - obj.top) ** 2)
        const angle = Math.atan2(e.scenePoint.y - obj.top, e.scenePoint.x - obj.left)
        obj.rotate(angle * 180 / Math.PI)
        obj.set({width: arrowLength})
      }

      c.renderAll()
    })

    c.on('mouse:up', () => {
      isMousedown = false
    })

    return () => {
      c.off()
    }
  }, [image, color, height, shape, strokeWidth, width])

  return (
    <div>
      <Link to={'/'}>Back</Link>
      <h1>Fabric</h1>

      <input type="file" onChange={onChangeFile} />

      { image && annotationToolsView}
      { shape === 'mosaic' && <span>モザイク未対応</span>}

      <div>
        <canvas id="canvas"/>
      </div>
    </div>
  )
}
