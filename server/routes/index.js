export const routes = {
  'root': {
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return 'Nothing here yet- Sorry!'
    }
  },
  'character': {
    method: 'GET',
    path: '/character/{name}',
    handler: (request, h) => {
      const name = request.params.name
      const char = 
      return char
    }
  }
}