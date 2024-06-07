import { useState } from "react"

export const useAnnotationTools = () => {
  const [shape, setShape] = useState<string>('rect')
  const [color, setColor] = useState<string>('red')
  const [strokeWidth, setStrokeWidth] = useState<number>(3)

  const annotationToolsView = <ul className="annotation-tools">
    <li className={shape === 'rect' ? 'active' : ''}><button onClick={() => {setShape('rect')}}>□</button></li>
    <li className={shape === 'arrow' ? 'active' : ''}><button onClick={() => {setShape('arrow')}}>→</button></li>
    <li className={shape === 'mosaic' ? 'active' : ''}><button onClick={() => {setShape('mosaic')}}>モザ</button></li>
    <li className={"ml20 " + (color === 'red' ? 'active' : '')}><button onClick={() => {setColor('red')}}>赤</button></li>
    <li className={color === 'blue' ? 'active' : ''}><button onClick={() => {setColor('blue')}}>青</button></li>
    <li className={color === 'green' ? 'active' : ''}><button onClick={() => {setColor('green')}}>緑</button></li>
    <li className={"ml20 " + (strokeWidth === 3 ? 'active' : '')}><button onClick={() => {setStrokeWidth(3)}}>細</button></li>
    <li className={strokeWidth === 10 ? 'active' : ''}><button onClick={() => {setStrokeWidth(10)}}>太</button></li>
  </ul>

  return { annotationToolsView, color, strokeWidth, shape}
}
