import React from "react"

interface DisplayProps {
  value: string
}

const Display: React.FC<DisplayProps> = ({ value }) => {
  return (
    <div>
      <h1>{value}</h1>
    </div>
  )
}

export default Display