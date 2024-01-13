import { Hono, HonoRequest } from "hono";
import { cors } from 'hono/cors'
import { Md5 } from 'ts-md5';
import { v4 as uuidv4 } from 'uuid';

type Bindings = {
    UDON_WAITLIST_KV: KVNamespace;
    DB: D1Database;
}

const submitWaitlist = new Hono<{ Bindings: Bindings }>();

submitWaitlist.use('*', cors({
    origin: 'https://kareudon.kamitsubaki.fans',
    allowHeaders: ['Content-Type'],
    allowMethods: ['POST', 'OPTIONS'],
    maxAge: 600,
    credentials: true,
}))

submitWaitlist.all('/', async (c) => {
    let data: { timestamp: string, email: string };
    try {
        data = await c.req.json();
    } catch (error) {
        return c.text('Invalid JSON in request body', 400);
    }

    const timestamp = data.timestamp;
    const date = new Date(timestamp);
    const sqlTimestamp = date.toISOString().slice(0, 19).replace('T', ' ');
    const email = data.email;
    const md5 = new Md5();
    md5.appendStr(email);
    const email_md5 = md5.end();
    const uuid = uuidv4();

    if (!timestamp || !email) {
        return new Response('Missing params in the request', { status: 400 });
    }

    await c.env.DB.prepare(
        `insert into users (email, email_md5, uuid, reg_timestamp) values (?, ?, ?, ?)`
    ).bind([email, email_md5, uuid, sqlTimestamp]).run();

    return c.text('Submitted successfully', 200);

})

export default submitWaitlist;
