import { Link } from "@remix-run/react"
import Konva from "konva"
import { ChangeEvent, useCallback, useEffect, useState } from "react"

export default function ShowKonva() {
  const [image, setImage] = useState<HTMLImageElement|null>(null)

  const width = image ? Math.min(image.width, 600) : 0
  const height = image ? image.height / image.width * width : 0

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


  const onChangeFile = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if(!files) { return }

    const url = URL.createObjectURL(files[0])
    const img = new Image()
    img.onload = ()=> {
      setImage(img)
    }
    img.src = url
  }, [])

  return (
    <div>
      <Link to={'/'}>Back</Link>
      <h1>Konva</h1>

      <input type="file" onChange={onChangeFile} />
      <div id="container"></div>
    </div>
  )
}
