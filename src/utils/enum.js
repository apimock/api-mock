export const Method = {
  1: 'get',
  2: 'post',
  3: 'put',
  4: 'delete',
  5: 'patch',
  'get': 1,
  'post': 2,
  'put': 3,
  'delete': 4,
  'patch': 5
}

export const MethodTagColor = {
  1: '#2d8cf0',
  2: '#19be6b',
  3: '#f90',
  4: '#ed3f14',
  5: '#f90'
}

export const MethodArray = [
  { code: 1, method: 'get' },
  { code: 2, method: 'post' },
  { code: 3, method: 'put' },
  { code: 4, method: 'delete' },
  { code: 5, method: 'patch' }
]

const CodeColor = {
  100: '#ccc',
  200: '#52c41a',
  300: '#5ca937',
  400: '#ff4d4f',
  500: 'red'
}

export const ResponseStatus = [
  { code: 200, desc: 'OK', color: CodeColor['200'] },
  { code: 401, desc: 'Unauthorized', color: CodeColor['400'] },
  { code: 403, desc: 'Forbidden', color: CodeColor['400'] },
  { code: 404, desc: 'Not Found', color: CodeColor['400'] },
  { code: 503, desc: 'Service Unavailable', color: CodeColor['500'] },
  { code: 0, desc: 'split' },
  { code: 100, desc: 'Continue', color: CodeColor['100'] },
  { code: 101, desc: 'Switching Protocols', color: CodeColor['100'] },
  { code: 102, desc: 'Processing', color: CodeColor['100'] },
  { code: 201, desc: 'Created', color: CodeColor['200'] },
  { code: 202, desc: 'Accepted', color: CodeColor['200'] },
  { code: 203, desc: 'Non-Authoritative Information', color: CodeColor['200'] },
  { code: 204, desc: 'No Content', color: CodeColor['200'] },
  { code: 205, desc: 'Reset Content', color: CodeColor['200'] },
  { code: 206, desc: 'Partial Content', color: CodeColor['200'] },
  { code: 207, desc: 'Multi-Status', color: CodeColor['200'] },
  { code: 208, desc: 'Already Reported', color: CodeColor['200'] },
  { code: 226, desc: 'Im Used', color: CodeColor['200'] },
  { code: 300, desc: 'Multiple Choices', color: CodeColor['300'] },
  { code: 301, desc: 'Moved Permanently', color: CodeColor['300'] },
  { code: 302, desc: 'Found', color: CodeColor['300'] },
  { code: 303, desc: 'See Other', color: CodeColor['300'] },
  { code: 304, desc: 'Not Modified', color: CodeColor['300'] },
  { code: 305, desc: 'Use Proxy', color: CodeColor['300'] },
  { code: 307, desc: 'Temporary Redirect', color: CodeColor['300'] },
  { code: 308, desc: 'Permanent Redirect', color: CodeColor['300'] },
  { code: 400, desc: 'Bad Request', color: CodeColor['400'] },
  { code: 402, desc: 'Payment Required', color: CodeColor['400'] },
  { code: 405, desc: 'Method Not Allowed', color: CodeColor['400'] },
  { code: 406, desc: 'Not Acceptable', color: CodeColor['400'] },
  { code: 407, desc: 'Proxy Authentication Required', color: CodeColor['400'] },
  { code: 408, desc: 'Request Timeout', color: CodeColor['400'] },
  { code: 409, desc: 'Conflict', color: CodeColor['400'] },
  { code: 410, desc: 'Gone', color: CodeColor['400'] },
  { code: 411, desc: 'Length Required', color: CodeColor['400'] },
  { code: 412, desc: 'Precondition Failed', color: CodeColor['400'] },
  { code: 413, desc: 'Payload Too Large', color: CodeColor['400'] },
  { code: 414, desc: 'Uri Too Long', color: CodeColor['400'] },
  { code: 415, desc: 'Unsupported Media Type', color: CodeColor['400'] },
  { code: 416, desc: 'Range Not Satisfiable', color: CodeColor['400'] },
  { code: 417, desc: 'Expectation Failed', color: CodeColor['400'] },
  { code: 418, desc: "I'm A Teapot", color: CodeColor['400'] },
  { code: 422, desc: 'Unprocessable Entity', color: CodeColor['400'] },
  { code: 423, desc: 'Locked', color: CodeColor['400'] },
  { code: 424, desc: 'Failed Dependency', color: CodeColor['400'] },
  { code: 426, desc: 'Upgrade Required', color: CodeColor['400'] },
  { code: 428, desc: 'Precondition Required', color: CodeColor['400'] },
  { code: 429, desc: 'Too Many Requests', color: CodeColor['400'] },
  { code: 431, desc: 'Request Header Fields Too Large', color: CodeColor['400'] },
  { code: 500, desc: 'Internal Server Error', color: CodeColor['500'] },
  { code: 501, desc: 'Not Implemented', color: CodeColor['500'] },
  { code: 502, desc: 'Bad Gateway', color: CodeColor['500'] },
  { code: 504, desc: 'Gateway Timeout', color: CodeColor['500'] },
  { code: 505, desc: 'Http Version Not Supported', color: CodeColor['500'] },
  { code: 506, desc: 'Variant Also Negotiates', color: CodeColor['500'] },
  { code: 507, desc: 'Insufficient Storage', color: CodeColor['500'] },
  { code: 508, desc: 'Loop Detected', color: CodeColor['500'] },
  { code: 510, desc: 'Not Extended', color: CodeColor['500'] },
  { code: 511, desc: 'Network Authentication Required', color: CodeColor['500'] }
]
