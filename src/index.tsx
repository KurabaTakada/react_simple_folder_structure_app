import React, {ReactNode, useState, useRef, useLayoutEffect} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

interface FolderProps {
  name: string
  children: ReactNode[]
}

const Folder = (props: FolderProps) => {
  const [ isOpen, setIsOpen ] = useState(false)
  const direction: string = isOpen ? "down" : "right"
  const { name, children } = props

  return (
    <div>
      <span onClick={() => setIsOpen(!isOpen)}>
        <i className="folder icon"></i>
        <i className={`caret ${direction} icon`}></i>
      </span>
      <EditableText initialText={name}/>
      <div style={{marginLeft: '16px'}}>
        { isOpen ? children : null}
      </div>
    </div>
  );
}

interface Icon {
  [key: string]: string
}

const File = (props: any) => {
  const { name } = props
  const [ state, setState ] = useState({ name: name})
  const icon: Icon = {
    mp3: "file audio",
    jpeg: "file image",
    png: "file image outline",
    mp4: "file video"
  }

  return (
    <div>
      <i className={`${icon[state.name.split(".").pop()]} icon`}></i>
      <EditableText initialText={props.name} onNameChange={(name: string) => {
        setState({...state, name: name})
      }}/>
    </div>
  );
}

const EditableText = (props: any) => {
  const inputEl = useRef<HTMLInputElement>(null)
  const { initialText, onNameChange } = props
  const [ state, setState ] = useState({
    text: initialText,
    isEditing: false
  })

  const keypressHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      inputEl.current?.blur()
    }
  };

  useLayoutEffect(() => {
    inputEl.current?.focus()
  })

  const textField = (
    <form
      style={{display: "inline",}}
      onSubmit={e => { e.preventDefault() }}
      >
      <input 
        type="text" 
        value={state.text} 
        ref={inputEl}
        onKeyPress={(event) => keypressHandler(event)}
        onChange={ event => setState({...state, text: event.target.value})}
        onBlur={() => {
          setState({...state, isEditing: false})
          if (onNameChange) {
            onNameChange(state.text)
          }
        }}
        />
    </form>
  )

  const textDisplay = (
    <span onClick={() => {
      setState({...state, isEditing: true})
    }}>{state.text}</span>
  )

  return (
    <span>
      {state.isEditing ? textField : textDisplay}
    </span>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Folder name="Test1">
      <File name="children1.mp3"/>
      <File name="children2.mp4"/>
      <Folder name="Test2">
        <File name="children3.mp3"/>
        <File name="children4.mp4"/>
      </Folder>
    </Folder>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
