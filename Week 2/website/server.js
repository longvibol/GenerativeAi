import Fastify from 'fastify';
import FastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';

const fastify = Fastify({ logger: true });

// Setup __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve files from ./public folder
await fastify.register(FastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/', // Serve at root URL
});

// In-memory array to store names
const names = [];

// POST route to add a name
fastify.post('/names', async (request, reply) => {
  const { name } = request.body;

  if (!name || typeof name !== 'string') {
    return reply.status(400).send({ error: 'Name is required and must be a string' });
  }

  names.push(name);
  return { message: 'Name added successfully', names };
});

// GET route to retrieve all names
fastify.get('/names', async () => {
  return { names };
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info('Server running on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
