import { Link } from "@remix-run/react"
import { Canvas, FabricImage} from 'fabric'
import { useEffect } from "react"
import { useImageLoader } from "~/hooks/use_image_loader"

export default function ShowKonva() {
  const {image, width, height, onChangeFile} = useImageLoader()

  useEffect(() => {
    if(!image) { return }

    const canvas = new Canvas('canvas', {width, height})

    const img = new FabricImage(image, {
      selectable: false, scaleX: width / image.width, scaleY: height / image.height
    })
    canvas.add(img)

    return () => {
      canvas.dispose()
    }
  }, [image, width, height])

  return (
    <div>
      <Link to={'/'}>Back</Link>
      <h1>Fabric</h1>

      <input type="file" onChange={onChangeFile} />
      <div>
        <canvas id="canvas"/>
      </div>
    </div>
  )
}
