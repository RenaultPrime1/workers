import { Hono } from 'hono'

import api_v2 from './v2route'

import getBeta from './getbeta'

const api = new Hono()

api.all('/', (c) => c.text('Udon!'))
api.notFound((c) => c.text('404 not found', 404))

api.route('getbeta', getBeta)

api.route('v2', api_v2)

export default api
