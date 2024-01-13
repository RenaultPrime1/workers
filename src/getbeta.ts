import { Hono, HonoRequest } from "hono";

type Bindings = {
    UDON_BETA_KV: KVNamespace;
    R2_BUCKET: R2Bucket;
}

const getBeta = new Hono<{ Bindings: Bindings }>();

getBeta.get('/', async (c) => {

    const url = new URL(c.req.url)
    const token = url.searchParams.get('token')

    if (!token) {
        return c.text('Missing token', 405)
    }

    const tokenValidation = await c.env.UDON_BETA_KV.get(token, { type: 'text' })

    const fileKey = 'kareudon-win-x64.7z'
    const object = await c.env.R2_BUCKET.get(fileKey)
    if (!object) {
        return c.text('File not found', 404)
    }

    const headers = new Headers()
    headers.set('Content-Disposition', 'attachment; filename="kareudon-win-x64.7z"')
    headers.set('Content-Type', 'application/x-7z-compressed')

    if (tokenValidation === 'false') {
        await c.env.UDON_BETA_KV.put(token, 'true')
        return c.body(
            object.body, {
            headers: headers,
        })
    } else {
        return c.text('Invalid token', 405)
    };

}


)

export default getBeta;
