import { Link } from "@remix-run/react"
import { Canvas, FabricImage, Rect, Line, Triangle, Group} from 'fabric'
import { useCallback, useEffect, useRef } from "react"
import { useAnnotationTools } from "~/hooks/use_annotation_tools"
import { useImageLoader } from "~/hooks/use_image_loader"

export default function ShowFabric() {
  const canvas = useRef<Canvas | null>(null)
  const {image, width, height, onChangeFile} = useImageLoader()

  // 四角の枠の描画
  const createStrokedRect = useCallback((color: string, strokeWidth: number) => {
    if(!canvas.current) { return }

    const rect = new Rect({
      left: Math.random() * width,
      top: Math.random() * height,
      width: 100,
      height: 100,
      fill: 'transparent',
      stroke: color,
      strokeUniform: true,
      strokeWidth,
    })

    canvas.current.add(rect)
  }, [height, width])

  // 矢印の表示
  const createArrow = useCallback((color: string, strokeWidth: number) => {
    if(!canvas.current) { return }

    const pos = {
      x: Math.random() * width,
      y: Math.random() * height,
    }
    const bar = new Line([pos.x, pos.y, pos.x + 100, pos.y],{
      strokeWidth,
      stroke: color,
    })

    const pointerWidth = strokeWidth * 3
    const pointerLength = strokeWidth * 3
    const pointer = new Triangle({
      width: pointerWidth,
      height: pointerLength,
      fill: color,
      left: pos.x + 100 + pointerLength,
      top: pos.y - pointerWidth / 2,
      angle: 90,
    })

    const arrow = new Group([bar, pointer])
    canvas.current.add(arrow)
  }, [height, width])

  const {annotationToolsView} = useAnnotationTools({ createStrokedRect, createArrow })

  // canvasの初期化
  useEffect(() => {
    if(!image) { return }

    const c = new Canvas('canvas', {width, height})

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

  return (
    <div>
      <Link to={'/'}>Back</Link>
      <h1>Fabric</h1>

      <input type="file" onChange={onChangeFile} />

      { image && annotationToolsView}

      <div>
        <canvas id="canvas"/>
      </div>
    </div>
  )
}
