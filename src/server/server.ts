import * as SocketIO from 'socket.io';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as http from 'http';
import * as cors from 'cors';
import * as path from 'path';
import * as jwt from 'jsonwebtoken';
import * as fs from 'file-system';

class HttpServer {

  private app;

  public static create() {
    const self = new HttpServer();
    return http.createServer(self.app);
  }

  constructor() {
    this.app = express();
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
    this.app.use(express.static('./build'));
    this.app.use(cors());
    this.app.use('/api', this.registerApiRoutes());
    this.registerMainRoute();
  }

  private registerMainRoute() {
    this.app.get('/', (req, res, next) => {
      if (req.url.indexOf('/api') === 0) {
        return next();
      }
      res.sendFile(path.join(__dirname, '../build/index.html'));
    });
  }

  private registerApiRoutes() {
    const api = express.Router();
    api.post('/login', (req, res) => {
      if (
        typeof req.body.username !== 'undefined' &&
        typeof req.body.password !== 'undefined' &&
        req.body.key === process.env.REACT_APP_KEY
      ) {
        // TODO: get company hash from somewhere...
        const companyHash = 'mycompanyhash';
        const token = jwt.sign(
          { username: req.body.username, password: req.body.password, company: companyHash },
          process.env.REACT_APP_SECRET,
          { expiresIn: '16h' }
        );
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ token: token }));
      }
    });
    api.get('/', (req, res) => {
      res.send('hello world');
    });
    api.all('/:resource/:id?/:subset?', (req, res) => {
      // TODO: get company hash from jwt token
      const companyHash = 'mycompanyhash';
      const handler = RestApiHandler.init(companyHash);
      try {
        const response = handler.resolve(
          req.method,
          req.params.resource,
          req.params.id,
          req.params.subset,
          req.query,
          req.body
        );
        res.send(response);
      } catch (error) {
        if (error.code && error.message) {
          res.status(error.code).send(error.message);
        } else {
          res.sendStatus(500);
        }
      }
    });
    return api;
  }
}

class RestApiHandler {

  private companyHash: string;
  private resource: string;

  public static init(companyHash: string) {
    return new RestApiHandler(companyHash);
  }

  public constructor(companyHash: string) {
    this.companyHash = companyHash;
  }

  public resolve(
    method: string,
    resource: string,
    id?: string,
    subset?: string,
    params?: { ids?: string[] },
    body?: {}
  ) {
    if (subset) {
      params[resource] = id;
      resource = subset;
    }
    this.resource = path.join(__dirname, 'data/' + this.companyHash + '/' + resource + '.json');
    if (fs.existsSync(this.resource)) {
      switch (method) {
        case 'GET':
          return (id) ? this.retrieve(id) : this.list();
        case 'PUT':
          return (id) ? this.replace(body as { id: string }) : this.replaceCollection(body as { id: string }[]);
        case 'POST':
          let returnSingle = true;
          let items = [body];
          if (Array.isArray(body)) {
            returnSingle = false;
            items = body;
          }
          const result = this.create(items);
          if (returnSingle) {
            return result[0];
          }
          return result;
        case 'DELETE':
          if (id) {
            return this.delete(id);
          } else if (params.ids) {
            return this.deleteCollection(params.ids);
          }
          break;
        default:
          break;
      }
    } else {
      throw({ code: 404, message: 'Resource not found' });
    }
  }

  private retrieve(id: string) {
    const items = this.list();
    let match;
    items.forEach(item => {
      if (item.id === id) {
        match = item;
        return;
      }
    });
    if (!match) {
      throw({ code: 404, message: 'Resource not found' });
    }
    return match;
  }

  private list() {
    const contents = fs.readFileSync(this.resource).toString();
    return JSON.parse(contents);
  }

  private replace(item: { id: string }) {
    const original = this.list();
    original.forEach((old: { id: string }) => {
      if (old.id === item.id) {
        old = item;
      }
    });
    fs.writeFileSync(this.resource, JSON.stringify(original));
    return true;
  }

  private replaceCollection(items: {}[]) {
    const original = this.list();
    original.forEach((old: { id: string }) => {
      items.forEach((item: { id: string }) => {
        if (old.id === item.id) {
          old = item;
        }
      });
    });
    fs.writeFileSync(this.resource, JSON.stringify(original));
    return true;
  }

  private create(items: {}[]) {
    const original = this.list();
    items.forEach((item: { id: string }) => {
      item.id = this.makeid();
      original.push(item);
    });
    fs.writeFileSync(this.resource, JSON.stringify(original));
    return items;
  }

  private delete(id: string) {
    const original = this.list();
    const newItems = [];
    original.forEach((item: { id: string }) => {
      if (item.id !== id) {
        newItems.push(item);
      }
    });
    fs.writeFileSync(this.resource, JSON.stringify(newItems));
    return true;
  }

  private deleteCollection(ids: string[]) {
    const original = this.list();
    const newItems = [];
    original.forEach((item: { id: string }) => {
      let match = false;
      ids.forEach(id => {
        if (item.id === id) {
          match = true;
        }
      });
      if (!match) {
        newItems.push(item);
      }
    });
    fs.writeFileSync(this.resource, JSON.stringify(newItems));
    return true;
  }

  private makeid() {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

}

class SocketServer {

  private io;
  private clients = {};

  public static listen(server: http.Server) {
    const self = new SocketServer();
    self.io = SocketIO(server);
    self.connect();
    return self;
  }

  connect() {
    this.io.use(require('socketio-jwt').authorize({
      secret: process.env.REACT_APP_SECRET,
      handshake: true
    }));

    this.io.on('connection', (socket: SocketIO.Socket) => {
      const companyHash = 'mycompanyhash'; // TODO: get company hash from jwt
      if (!this.clients[companyHash]) {
        this.clients[companyHash] = {};
      }
      this.clients[companyHash][socket.id] = socket;
      socket.on('disconnect', () => {
        delete this.clients[socket.id];
      });
    });
  }

}

const port = process.env.port || 3001;

const httpServer = HttpServer.create();
const socketServer = SocketServer.listen(httpServer);
httpServer.listen(port, () => {
  console.log('Server started on port %s', port);
});

export enum ErrorCodes {
  NOT_FOUND = '0',
  ALREADY_LOGGED_IN = '1',
  PASSWORD_INCORRECT = '2'
}

export function isAuthorized(req: { get: Function }, res: { sendStatus: Function }) {
  // TODO: should probably also check if user is actually an admin
  /*
  let auth = req.get('authorization');
  if (typeof auth === 'undefined' || !verifyToken(auth)) {
      res.sendStatus(400);
      return;
  }
  */
}
