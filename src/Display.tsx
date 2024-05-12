import React from "react"

interface DisplayProps {
  value: string
}

const Display: React.FC<DisplayProps> = ({ value }) => {
  return (
    <div>
      <h1>I am a Display React Component</h1>
      <p>{value}</p>
      <p>The end of the Display</p>
    </div>
  )
}

export default Display