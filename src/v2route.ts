import { Hono, HonoRequest } from 'hono'

import submitWaitlist from './v2/submit_waitlist'

const api_v2 = new Hono()

api_v2.all('/', (c) => c.text('Udon!'))

api_v2.route('submit-waitlist', submitWaitlist);

export default api_v2