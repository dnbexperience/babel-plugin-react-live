/**
 * Babel Plugin Test
 *
 */

import { transformFileAsync } from '@babel/core'
import nodePath from 'path'
import prettier from 'prettier'
import babelPluginReactLive from '../babelPluginReactLive'

const targetFile = nodePath.resolve(__dirname, '../__mocks__/Examples.tsx')
const prettierPath = nodePath.resolve(__dirname, '../.prettierrc')
const pluginOptions = {
  componentName: 'ComponentBox',
  filesToMatch: ['Examples.tsx'],
  prettierPath,
}

describe('transformFileAsync', () => {
  it('should convert Examples.tsx with all exported examples', async () => {
    const babelFileResult = await transformFileAsync(targetFile, {
      code: true,
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            targets: { firefox: '100' },
          },
        ],
      ],
      plugins: [[babelPluginReactLive, pluginOptions]],
    })

    const code = removeConsoleNinja(String(babelFileResult?.code))

    const formattedCode = prettier.format(code, {
      filepath: 'file.tsx',
      semi: false,
    })

    expect(formattedCode).toMatchInlineSnapshot(`
      "const ComponentBox = ({ children }) => children
      export const MockNoInlineWithComponent = () => {
        return (
          <ComponentBox data-test="id" noInline>{\`const DemoComponent = () => {
        return <>content</>
      }
      render(
        <div>
          <DemoComponent />
        </div>
      )
      \`}</ComponentBox>
        )
      }
      export const MockNoInlineWithBackticks = () => {
        return (
          <ComponentBox data-test="id" noInline>{\`const DemoComponent = () => {
        const more = '456'
        return \\\`123\\\${more}\\\` + \\\`789\\\`
      }
      render(
        <div>
          <DemoComponent />
        </div>
      )
      \`}</ComponentBox>
        )
      }
      export const MockNoInlineWithText = () => {
        return (
          <ComponentBox data-test="id" noInline>{\`render(<>content</>)
      \`}</ComponentBox>
        )
      }
      export const MockOneChilds = () => {
        return (
          <ComponentBox data-test="id">{\`<div>content</div>
      \`}</ComponentBox>
        )
      }
      export const MockManyChilds = () => {
        return (
          <ComponentBox data-test="id">{\`
      <div>content 1</div>
      <div>content 2</div>
      <div>content 3</div>

      \`}</ComponentBox>
        )
      }
      export const MockFragment = () => {
        return (
          <ComponentBox data-test="id">{\`<>
        <span>content 1</span>
        <span>content 2</span>
        <span>content 3</span>
      </>
      \`}</ComponentBox>
        )
      }
      export const MockText = () => {
        return (
          <ComponentBox data-test="id">{\`
      text
      {'text'}
      <span>content</span>
      text
      {'text'}

      \`}</ComponentBox>
        )
      }
      export const MockEvents = () => {
        return (
          <ComponentBox data-test="id">{\`<DemoComponent
        onChange={(e) => {
          // comment
          console.log(e)
        }}
        onOpen={(e) => 'console.log(e)'}
        onFocus={(e) => {
          const cleaned = 'console.log(e)'
        }}
      />
      \`}</ComponentBox>
        )
      }
      "
    `)

    expect(formattedCode.match(/noInline/g)).toHaveLength(3)
    expect(formattedCode.match(/\{`/g)).toHaveLength(8)
    expect(formattedCode.match(/`\}/g)).toHaveLength(8)
  })

  it('should format TypeScript syntax with the babel-ts parser', async () => {
    const targetFileWithTypes = nodePath.resolve(
      __dirname,
      '../__mocks__/ExamplesTypeAnnotations.tsx'
    )
    const pluginOptionsWithTypes = {
      componentName: 'ComponentBox',
      filesToMatch: ['ExamplesTypeAnnotations.tsx'],
      prettierPath,
    }

    const babelFileResult = await transformFileAsync(targetFileWithTypes, {
      code: true,
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            targets: { firefox: '100' },
          },
        ],
      ],
      plugins: [[babelPluginReactLive, pluginOptionsWithTypes]],
    })

    const code = removeConsoleNinja(String(babelFileResult?.code))

    const formattedCode = prettier.format(code, {
      filepath: 'file.tsx',
      semi: false,
    })

    expect(formattedCode).toMatchInlineSnapshot(`
      "const ComponentBox = ({ children }) => children
      export const MockTypeAnnotations = () => {
        const value = "hello"
        return (
          <ComponentBox data-test="id">{\`<span>{value as string}</span>
      \`}</ComponentBox>
        )
      }
      "
    `)
  })
})

function removeConsoleNinja(code: string): string {
  if (code.includes('oo_cm')) {
    const index = code.indexOf('function oo_cm()')
    code = code.slice(0, index)
    code = code.replace(/(\/\* eslint-disable \*\/(\n|\s|)+)/g, '')
  }

  return code
}
