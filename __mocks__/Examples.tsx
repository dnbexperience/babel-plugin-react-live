import React from 'react'

const ComponentBox = ({ children }) => children

export const MockNoInlineWithComponent = () => {
  return (
    <ComponentBox data-test="id">
      {() => {
        const DemoComponent = () => {
          return <>content</>
        }

        return <DemoComponent />
      }}
    </ComponentBox>
  )
}

export const MockNoInlineWithText = () => {
  return (
    <ComponentBox data-test="id">
      {() => {
        return <>content</>
      }}
    </ComponentBox>
  )
}

export const MockOneChilds = () => {
  return (
    <ComponentBox data-test="id">
      <div>content</div>
    </ComponentBox>
  )
}

export const MockManyChilds = () => {
  return (
    <ComponentBox data-test="id">
      <div>content 1</div>
      <div>content 2</div>
      <div>content 3</div>
    </ComponentBox>
  )
}
