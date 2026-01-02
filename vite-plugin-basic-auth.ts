import type { Plugin } from 'vite';
import type { Connect } from 'vite';

export function basicAuthPlugin(): Plugin {
  return {
    name: 'basic-auth',
    configureServer(server) {
      server.middlewares.use((req: Connect.IncomingMessage, res: Connect.ServerResponse, next: Connect.NextFunction) => {
        const username = process.env.AUTH_USER;
        const password = process.env.AUTH_PASS;

        // Skip auth if credentials are not set
        if (!username || !password) {
          return next();
        }

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Basic ')) {
          res.statusCode = 401;
          res.setHeader('WWW-Authenticate', 'Basic realm="Restricted Area"');
          res.end('401 Unauthorized');
          return;
        }

        // Decode the base64 credentials
        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [user, pass] = credentials.split(':');

        if (user === username && pass === password) {
          next();
        } else {
          res.statusCode = 401;
          res.setHeader('WWW-Authenticate', 'Basic realm="Restricted Area"');
          res.end('401 Unauthorized');
        }
      });
    },
  };
}

