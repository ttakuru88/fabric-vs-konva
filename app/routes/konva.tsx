import { Link } from "@remix-run/react"
import Konva from "konva"
import { useEffect } from "react"
import { useImageLoader } from "~/hooks/use_image_loader"

export default function ShowKonva() {
  const {image, width, height, onChangeFile} = useImageLoader()

  useEffect(() => {
    if(!image) { return }

    const stage = new Konva.Stage({
      container: 'container',
      width: width,
      height: height,
    })

    const layer = new Konva.Layer()
    stage.add(layer)

    const bg = new Konva.Image({
      x: 0, y: 0, image, width, height
    })
    layer.add(bg)

    return () => {
      stage.destroy()
    }
  }, [image, width, height])

  return (
    <div>
      <Link to={'/'}>Back</Link>
      <h1>Konva</h1>

      <input type="file" onChange={onChangeFile} />
      <div id="container"></div>
    </div>
  )
}
