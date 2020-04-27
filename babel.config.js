module.exports = function (api) {
  api.cache(true)
  const IS_NODE = ['true'].includes(process.env.IS_NODE)
  const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
  const presets = []
  const plugins = []
  if (IS_NODE) {
    presets.push('@babel/preset-env')
    plugins.push(['@babel/plugin-transform-runtime'], ['@babel/plugin-proposal-decorators', { legacy: true }])
  } else {
    presets.push(
      '@vue/cli-plugin-babel/preset',
      [
        '@babel/preset-env',
        {
          'useBuiltIns': 'entry',
          'corejs': 3
        }
      ]
    )

    if (IS_PROD) {
      plugins.push('transform-remove-console')
    }

    plugins.push(['import', {
      'libraryName': 'ant-design-vue',
      'libraryDirectory': 'es',
      'style': true // `style: true` 会加载 less 文件
    }])
  }
  return {
    presets,
    plugins
  }
}
