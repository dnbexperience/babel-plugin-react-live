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

export const MockFragment = () => {
  return (
    <ComponentBox data-test="id">
      <>
        <span>content 1</span>
        <span>content 2</span>
        <span>content 3</span>
      </>
    </ComponentBox>
  )
}

export const MockText = () => {
  return (
    <ComponentBox data-test="id">
      text
      <span>content</span>
      text
    </ComponentBox>
  )
}
