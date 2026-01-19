import React from 'react'

const ComponentBox = ({ children }) => children

export const MockTypeAnnotations = () => {
  const value = 'hello' as string

  return (
    <ComponentBox data-test="id">
      <span>{value as string}</span>
    </ComponentBox>
  )
}
