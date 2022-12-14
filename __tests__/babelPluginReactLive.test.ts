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

it('babelPluginReactLive', async () => {
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

  const code = String(babelFileResult?.code)

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
      render(<DemoComponent />)
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
          <ComponentBox data-test="id">{\`<>
        <div>content 1</div>
        <div>content 2</div>
        <div>content 3</div>
      </>
      \`}</ComponentBox>
        )
      }
      "
    `)

  expect(formattedCode.match(/noInline/g)).toHaveLength(2)
  expect(formattedCode.match(/\{`/g)).toHaveLength(4)
  expect(formattedCode.match(/`\}/g)).toHaveLength(4)
})
