export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext) {
        const url = new URL(request.url);
        const token = url.searchParams.get('token');

        if (token === null) {
            return new Response('Missing token', {
                status: 405,
            });
        }

        const tokenValidation = await env.UDON_BETA_KV.get(token, { type: 'text' });

        const fileKey = 'kareudon-win-x64.7z';
        const object = await env.R2_BUCKET.get(fileKey);

        switch (request.method) {
            case 'GET':
                const headers = new Headers();
                headers.set('Content-Disposition', 'attachment; filename="kareudon-win-x64.7z"');
                headers.set('Content-Type', 'application/x-7z-compressed');
                if (object !== null) {
                    if (tokenValidation === 'false') {
                        await env.UDON_BETA_KV.put(token, 'true');
                        return new Response(
                            object.body, {
                            headers: headers,
                        });
                    } else {
                        return new Response('Invalid token', {
                            status: 405,
                        });
                    };
                } else {
                    return new Response('Object not found', {
                        status: 405,
                    });
                }


            default:
                return new Response('Method Not Allowed', {
                    status: 405,
                    headers: {
                        Allow: 'GET',
                    },
                });
        }
    },
};