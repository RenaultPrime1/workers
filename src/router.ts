import { Router } from 'itty-router';

// now let's create a router (note the lack of "new")
const router = Router();

// GET collection index
// router.get('/api/todos', () => new Response('Todos Index!'));

// GET item
// router.get('/api/todos/:id', ({ params }) => new Response(`Todo #${params.id}`));

// POST to the collection (we'll use async here)
// router.post('/api/todos', async (request) => {
// 	const content = await request.json();
// 
// 	return new Response('Creating Todo: ' + JSON.stringify(content));
// });

// 404 for everything else
router.all('*', () => new Response(
	`<html><body><center><h1>403 forbidden</h1></center></body></html>`,
	{
		status: 403,
		headers: { 'Content-Type': 'text/html' }
	}

));

export default router;
