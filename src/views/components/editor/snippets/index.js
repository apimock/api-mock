/* global ace */
const mockSnippets = require('./mock.snippets')
const javascriptSnippets = require('./javascript.snippets')
ace.define('ace/snippets/javascript', ['require', 'exports', 'module'], function (e, t) {
  if (javascriptSnippets.default && mockSnippets.default) {
    t.snippetText = javascriptSnippets.default + '\n' + mockSnippets.default
  } else {
    t.snippetText = javascriptSnippets + '\n' + mockSnippets
  }
  t.scope = 'javascript'
})
