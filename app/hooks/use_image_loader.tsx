import { type ChangeEvent, useCallback, useState } from "react"

export const useImageLoader = () => {
  const [image, setImage] = useState<HTMLImageElement|null>(null)

  const width = image ? Math.min(image.width, 600) : 0
  const height = image ? image.height / image.width * width : 0

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

  return { image, setImage, onChangeFile, width, height }
}
