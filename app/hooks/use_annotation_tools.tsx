import { useState } from "react"

interface Props {
  createStrokedRect: (color: string, strokeWidth: number) => void
}

export const useAnnotationTools = ({createStrokedRect}: Props) => {
  const [color, setColor] = useState<string>('red')
  const [strokeWidth, setStrokeWidth] = useState<number>(3)

  const annotationToolsView = <ul className="annotation-tools">
    <li><button onClick={() => {createStrokedRect(color, strokeWidth)}}>□</button></li>
    <li><button>→</button></li>
    <li className={"ml20 " + (color === 'red' ? 'active' : '')}><button onClick={() => {setColor('red')}}>赤</button></li>
    <li className={color === 'blue' ? 'active' : ''}><button onClick={() => {setColor('blue')}}>青</button></li>
    <li className={color === 'green' ? 'active' : ''}><button onClick={() => {setColor('green')}}>緑</button></li>
    <li className={"ml20 " + (strokeWidth === 3 ? 'active' : '')}><button onClick={() => {setStrokeWidth(3)}}>細</button></li>
    <li className={strokeWidth === 10 ? 'active' : ''}><button onClick={() => {setStrokeWidth(10)}}>太</button></li>
  </ul>

  return { annotationToolsView, }
}
