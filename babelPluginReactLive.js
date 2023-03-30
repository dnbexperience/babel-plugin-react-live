const fs = require('fs')
const prettier = require('prettier')

function babelPluginReactLive(babel, options) {
  const { types: t } = babel

  const prettierrc = options.prettierPath
    ? JSON.parse(fs.readFileSync(options.prettierPath, 'utf-8'))
    : {}

  const convertCodeToJSX = (children) => {
    // So prettier can do its work,
    // we wrap our JSX children in a fragment.
    // But we also remvoe it afterwards.
    let code =
      children.length > 1
        ? `<>${children.join('\n')}</>`
        : children.join('\n')

    code = prettier.format(code, {
      ...prettierrc,
      parser: 'babel',
    })

    // Prettier adds a leading ;
    // And we also escape `
    code = code.replace(/^;/, '').replace(/`/g, '\\`')

    if (children.length > 1) {
      code = code.replace(/^<>|<\/>$|^\s{2}/gm, '')
    }

    return t.jsxExpressionContainer(
      t.templateLiteral([t.templateElement({ raw: code })], [])
    )
  }

  const isEffectedFile = (filename) => {
    return options.filesToMatch.some((f) => filename.includes(f))
  }

  const runPlugin = (path) => {
    path.traverse({
      JSXElement(path) {
        if (
          path.node.openingElement.name.name === options.componentName &&
          /**
           * Do nothing, if the child is already a string / template literal
           */
          !path.node.children.some((node) => {
            return node.expression && t.isTemplateLiteral(node.expression)
          })
        ) {
          const rootPath = path
          const children = []
          let noInline = false

          path.traverse({
            BlockStatement(path) {
              if (rootPath === path.parentPath.parentPath.parentPath) {
                const currentReturnStatement = path.node.body.find(
                  (node) => node.type === 'ReturnStatement'
                )

                path.traverse({
                  ReturnStatement(path) {
                    if (currentReturnStatement === path.node) {
                      const code = path
                        .getSource()
                        .replace(/return ((.|\n|\r)*)/, 'render($1)')

                      const node = t.identifier(code)
                      path.replaceWith(node)

                      path.stop()
                    }
                  },
                })

                const code = path
                  .toString()
                  .replace(/^\{/, '')
                  .replace(/\}$/, '')

                children.push(code)

                path.stop()

                noInline = true
              }
            },
            JSXElement(path) {
              if (rootPath === path.parentPath) {
                const code = path.getSource()

                children.push(code)
              }
            },
            JSXFragment(path) {
              if (rootPath === path.parentPath) {
                const code = path.getSource()

                children.push(code)
              }
            },
            JSXText(path) {
              if (rootPath === path.parentPath) {
                const code = path.getSource()

                if (code.trim().length) {
                  children.push(code)
                }
              }
            },
            JSXExpressionContainer(path) {
              if (
                rootPath === path.parentPath &&
                path.node.expression.type !== 'ArrowFunctionExpression'
              ) {
                const code = path.getSource()

                if (code.length) {
                  children.push(code)
                }
              }
            },
          })

          if (children.length > 0) {
            if (
              noInline &&
              !path.node.openingElement.attributes.some(
                ({ name }) => name === 'noInline'
              )
            ) {
              path.node.openingElement.attributes.push(
                t.jsxAttribute(t.jsxIdentifier('noInline'))
              )
            }

            path.node.children = [convertCodeToJSX(children)]

            path.replaceWith(t.identifier(path.toString()))
          }
        }
      },
    })
  }

  return {
    name: 'react-live',
    visitor: {
      Program(path, state) {
        if (!isEffectedFile(state?.file.opts.filename)) {
          return // stop here
        }

        runPlugin(path)
      },
    },
  }
}

module.exports = babelPluginReactLive
