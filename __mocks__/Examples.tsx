import React from 'react'

const ComponentBox = ({ children }) => children

export const MockNoInlineWithComponent = () => {
  return (
    <ComponentBox data-test="id">
      {() => {
        const DemoComponent = () => {
          return <>content</>
        }

        return (
          <div>
            <DemoComponent />
          </div>
        )
      }}
    </ComponentBox>
  )
}

export const MockNoInlineWithBackticks = () => {
  return (
    <ComponentBox data-test="id">
      {() => {
        const DemoComponent = () => {
          const more = '456'
          return `123${more}` + `789`
        }

        return (
          <div>
            <DemoComponent />
          </div>
        )
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
      text {'text'}
      <span>content</span>
      text {'text'}
    </ComponentBox>
  )
}

export const MockEvents = () => {
  return (
    <ComponentBox data-test="id">
      <DemoComponent
        onChange={(e) => {
          // comment
          console.log(e)
        }}
        onOpen={(e) => 'console.log(...oo_oo(`ecc41efd_0`, e))'}
        onFocus={(e) => {
          /* eslint-disable */
          const cleaned = 'console.log(...oo_oo(`ecc41efd_0`, e))'
        }}
      />
    </ComponentBox>
  )
}
