import { Link } from "@remix-run/react"
import { Canvas, FabricImage, Rect} from 'fabric'
import { useCallback, useEffect, useRef } from "react"
import { useAnnotationTools } from "~/hooks/use_annotation_tools"
import { useImageLoader } from "~/hooks/use_image_loader"

export default function ShowFabric() {
  const canvas = useRef<Canvas | null>(null)
  const {image, width, height, onChangeFile} = useImageLoader()

  const createStrokedRect = useCallback(() => {
    if(!canvas.current) { return }

    const rect = new Rect({
      left: Math.random() * width, top: Math.random() * height, width: 100, height: 100, fill: 'transparent', stroke: 'red', strokeUniform: true
    })

    canvas.current.add(rect)
  }, [height, width])

  const {annotationToolsView} = useAnnotationTools({ createStrokedRect })

  useEffect(() => {
    if(!image) { return }

    const c = new Canvas('canvas', {width, height})

    const img = new FabricImage(image, {
      selectable: false, scaleX: width / image.width, scaleY: height / image.height
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
