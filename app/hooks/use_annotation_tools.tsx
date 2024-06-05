interface Props {
  createStrokedRect: () => void
}

export const useAnnotationTools = ({createStrokedRect}: Props) => {
  const annotationToolsView = <ul className="annotation-tools">
    <li><button onClick={createStrokedRect}>□</button></li>
    <li><button>■</button></li>
    <li><button>→</button></li>
    <li className="ml20"><button>赤</button></li>
    <li><button>青</button></li>
    <li><button>緑</button></li>
    <li className="ml20"><button>細</button></li>
    <li><button>太</button></li>
  </ul>

  return { annotationToolsView, }
}
