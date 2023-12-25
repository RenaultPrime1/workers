async function validToken(request: any, env: any) {
    const token = request.url.searchParams.get('token');
    const ifFalse = env.UDON_BETA_KV.get(token);

    if (token === null) {
        return new Response('Missing token', {
            status: 405,
        });
    } else {

        if (ifFalse === false) {
            await env.UDON_BETA_KV.put(token, true);
            return true;
        } else {
            return false;
        }
    }
};

export default {
    async fetch(request: any, env: any) {
        const token = request.url.searchParams.get('token');
        const ifFalse = env.UDON_BETA_KV.get(token);

        const fileKey = 'kareudon-win-x64.7z';

        switch (request.method) {
            case 'GET':
                const headers = new Headers();
                headers.set('Content-Disposition', 'attachment; filename="yourfile.7z"');
                headers.set('Content-Type', 'application/x-7z-compressed');

                if (await validToken(request, env) === true) {
                    const object = await env.R2_BUCKET.get(fileKey);

                    if (object === null) {
                        return new Response(`<html><body>File not found</body></html>`, {
                            status: 404,
                            headers: {
                                'content-type': 'text/html; charset=UTF-8'
                            }
                        });
                    }
                    return new Response(object.body, {
                        headers: headers,
                    });
                } else {
                    return new Response('Invalid token', {
                        status: 405,
                    });
                }

            default:
                return new Response('Method Not Allowed', {
                    status: 405,
                    headers: {
                        Allow: 'PUT, GET, DELETE',
                    },
                });
        }
    },
};