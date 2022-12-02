# Babel Plugin to enhance React Live syntax

[React Live](https://github.com/FormidableLabs/react-live) only supports code as a string. This Babel Plugin uses AST to transform JavaScript and TypeScript code to a string.

This allows the given "source code" to be fully typed (TypeScript).

## Example

**Input**

```tsx
const YourComponent = () => {
  const foo = 'bar'
  return (
    <LiveProvider scope={{ foo }} data-your-attributes>
      <div>{foo}</div>
    </LiveProvider>
  )
}
```

**Output**

```tsx
const YourComponent = () => {
  const foo = 'bar'
  return (
    <LiveProvider scope={{ foo }} data-your-attributes>
      {`<div>{foo}</div>`}
    </LiveProvider>
  )
}
```

When used with a render callback, it is transformed to use ReactLive's `render` (noInline).

**Input**

```tsx
const YourComponent = () => {
  const foo = 'bar'
  return (
    <LiveProvider scope={{ foo, styled }}>
      {() => {
        const StyledDiv = styled.div`
          color: red;
        `
        return <StyledDiv>{foo}</StyledDiv>
      }}
    </LiveProvider>
  )
}
```

**Output**

```tsx
const YourComponent = () => {
  const foo = 'bar'
  return (
    <LiveProvider scope={{ foo, styled }} noInline>
      {`
        const StyledDiv = styled.div\`
          color: red;
        \`
        render(<StyledDiv>{foo}</StyledDiv>)
      `}
    </LiveProvider>
  )
}
```

## How to use

Install `babel-plugin-react-live` and add it to your Babel config.

```json
{
  "plugins": [
    [
      "babel-plugin-react-live",
      {
        "componentName": "YourComponent",
        "filesToMatch": ["Examples.tsx"],
        "prettierPath": "./.prettierrc"
      }
    ]
  ]
}
```

## How it works

It uses Babel AST to transform related code to a string.
