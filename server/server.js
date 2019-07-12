const Hapi = require('@hapi/hapi')
const { routes } = require('./routes')
const { methods } = require('./methods')

const server = Hapi.server({
  port: 1313,
  host: 'localhost'
})
// Add methods
server.method('fetch.char', methods.fetch.char)
server.method('fetch.chars', methods.fetch.chars)
// Add routes
server.route(routes.root)

async function init () {
  server.bind()
  await server.start()
  console.log(`Server running on ${server.info.uri}`)
}



process.on('unhandledRejection', (err) => {
  console.error(err)
  process.exit(1)
})

init()