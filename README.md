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

## License

Licensed under the [Eufemia DNB Project License v1.0](./LICENSE) for DNB Group projects, including internal and customer-facing applications and suppliers working on DNB's behalf. Public access does not permit reuse in unrelated projects.

Third-party materials retain their own terms. Earlier-version rights and separate agreements remain in effect. By submitting a contribution, you agree to the contributor grant in section 3 of the license and confirm that you have the right to grant it.
