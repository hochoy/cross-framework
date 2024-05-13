import { useEffect, useRef, useState } from 'react'
import useWillUnmount from '@restart/hooks/useWillUnmount'
import React from 'react'

type InputProps = {
  [key: string]: any
}

type CallbackProps = {
  [key: string]: EventListener
}

const MfeReactRoot = ({
  id,
  importedModule,
  inputProps,
  callbackProps
}:
  {
    id: string,
    importedModule: any,
    inputProps: InputProps,
    callbackProps: CallbackProps,
  }) => {

  const appInjectorRef = useRef<any>(null)
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null)

  // unmount the Relay and RemoteMFE when the component is unmounted
  useWillUnmount(() => {
    if (appInjectorRef.current) {
      appInjectorRef.current.unmount()
    }
  })

  // register listeners for the MFE events to send to Shell
  useEffect(() => {
    const handleEvent = (callbackFunc: (e: Event) => void) => (e: CustomEvent) => {
      return callbackFunc(e.detail)
    }
    for (const key in callbackProps) {
      window.addEventListener(`${id}-${key}`, handleEvent(callbackProps[key]) as EventListener)
    }

    // remove listeners when the component is unmounted
    return () => {
      for (const key in callbackProps) {
        window.removeEventListener(`${id}-${key}`, handleEvent(callbackProps[key]) as EventListener)
      }
    }
  }, [])

  // register listeners for the Shell input prop changes to send to MFE
  useEffect(() => {
    // TODO: Should we loop across each input prop and add a listener for each?
    const event = new CustomEvent(`${id}-input`, {
      detail: inputProps
    })
    window.dispatchEvent(event)
  }, [inputProps])

  // mount the Relay and RemoteMFE when the component is mounted
  useEffect(() => {
    console.warn('MFE React Root: Start')
    // already mounted so ignore
    if (appInjectorRef.current) {
      console.warn('MFE React Root: Already mounted')
      return
    }
    // if not yet mounted, try to mount the Relay and RemoteMFE on the rootElement
    if (rootElement && importedModule) {
      console.warn('MFE React Root: Mounting')
      appInjectorRef.current = new importedModule.default(rootElement)
      appInjectorRef.current.mount({ inputProps, callbackProps })
    }
    console.warn('MFE React Root: End')

  }, [rootElement, inputProps, callbackProps, importedModule])

  if (!importedModule) {
    return null
  }

  return <div ref={setRootElement} data-id="mfe-react-root" />
}

export default MfeReactRoot