const path = require('path')
const { apiReference } = require('@scalar/express-api-reference')

const initDocumentation = (server) => {
  server.get('/', (req, res) => {
    res.redirect('/docs')
  })

  server.get('/docs/openapi.yaml', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'docs', 'openapi.yaml'))
  })

  server.use(
    '/docs',
    apiReference({
      url: '/docs/openapi.yaml',
      pageTitle: 'IT Ticketing Manager API Docs',
      title: 'IT Ticketing Manager API',
      defaultHttpClient: {
        targetKey: 'js',
        clientKey: 'fetch',
      },
      persistAuth: true,
      agent: { disabled: true },
      defaultOpenAllTags: true,
      theme: 'fastify',
      layout: 'modern',
      telemetry: false,
    }),
  )
}

module.exports = { initDocumentation }
