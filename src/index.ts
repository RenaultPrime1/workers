import handleRedirect from './redirect';
import apiRouter from './router';
import betaDL from './getbeta'
import submitWaitlist from './waitlist'

// Export a default object containing event handlers
export default {
	// The fetch handler is invoked when this worker receives a HTTP(S) request
	// and should return a Response (optionally wrapped in a Promise)
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// You'll find it helpful to parse the request.url string into a URL object. Learn more at https://developer.mozilla.org/en-US/docs/Web/API/URL
		const url = new URL(request.url);

		// You can get pretty far with simple logic like if/switch-statements
		switch (url.pathname) {
			// 	case '/redirect':
			// 		return handleRedirect.fetch(request, env, ctx);
			case '/getbeta':
				return betaDL.fetch(request, env);

		}

		if (url.pathname === '/v1/submit-waitlist' && request.method === 'POST') {
			return submitWaitlist.fetch(request, env);
		}

		if (url.pathname.startsWith('/v1/')) {
			// You can also use more robust routing
			return apiRouter.handle(request);
		}

		return new Response(
			`<html><body><center><h1>403 forbidden</h1></center></body></html>`,
			{
				status: 403,
				headers: { 'Content-Type': 'text/html' }
			}
		);
	},
};
