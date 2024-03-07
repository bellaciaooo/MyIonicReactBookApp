// class Book {
//     constructor({ id, title, author, date, pages, awarded, version}) {
//       this.id = id;
//       this.title = title;
//       this.author = author;
//       this.date = date;
//       this.pages = pages;
//       this.awarded = awarded;
//       this.version = version;
//     }
//   }
  
//   const items = [];
//   for (let i = 0; i < 3; i++) {
//     items.push(new Book({ id: `${i}`, title: `Title ${i}`, author: `Author ${i}`, date: new String(new Date(Date.now() + i).toLocaleDateString()), pages: 100, awarded: i%2==0, version: 1 }));
//   }
//   let lastUpdated = items[items.length - 1].date;
//   let lastId = items[items.length - 1].id;
//   const pageSize = 10;
  
//   const broadcast = data =>
//     wss.clients.forEach(client => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(JSON.stringify(data));
//       }
//     });
  
//   const router = new Router();
  
//   router.get('/item', ctx => {
//     ctx.response.body = items;
//     ctx.response.status = 200;
//   });
  
//   router.get('/item/:id', async (ctx) => {
//     const itemId = ctx.request.params.id;
//     const item = items.find(item => itemId === item.id);
//     if (item) {
//       ctx.response.body = item;
//       ctx.response.status = 200; // ok
//     } else {
//       ctx.response.body = { message: `item with id ${itemId} not found` };
//       ctx.response.status = 404; // NOT FOUND (if you know the resource was deleted, then return 410 GONE)
//     }
//   });
  
//   const createItem = async (ctx) => {
//     const item = ctx.request.body;
//     if (!item.title || !item.author) { // validation to have the data of the boook
//       ctx.response.body = { message: 'Details of the book are missing' };
//       ctx.response.status = 400; //  BAD REQUEST
//       return;
//     }
//     item.id = `${parseInt(lastId) + 1}`;
//     lastId = item.id;
//     //item.date = new Date(); avem un tip date in camp
//     item.version = 1;
//     items.push(item);
//     ctx.response.body = item;
//     ctx.response.status = 201; // CREATED
//     broadcast({ event: 'created', payload: { item } });
//   };
  
//   router.post('/item', async (ctx) => {
//     await createItem(ctx);
//   });
  
//   router.put('/item/:id', async (ctx) => {
//     const id = ctx.params.id;
//     const item = ctx.request.body;
//     //item.date = new Date();
//     const itemId = item.id;
//     if (itemId && id !== item.id) {
//       ctx.response.body = { message: `Param id and body id should be the same` };
//       ctx.response.status = 400; // BAD REQUEST
//       return;
//     }
//     if (!itemId) {
//       await createItem(ctx);
//       return;
//     }
//     const index = items.findIndex(item => item.id === id);
//     if (index === -1) {
//       ctx.response.body = { issue: [{ error: `item with id ${id} not found` }] };
//       ctx.response.status = 400; // BAD REQUEST
//       return;
//     }
//     const itemVersion = parseInt(ctx.request.get('ETag')) || item.version;
//     if (itemVersion < items[index].version) {
//       ctx.response.body = { issue: [{ error: `Version conflict` }] };
//       ctx.response.status = 409; // CONFLICT
//       return;
//     }
//     item.version++;
//     items[index] = item;
//     lastUpdated = new Date();
//     ctx.response.body = item;
//     ctx.response.status = 200; // OK
//     broadcast({ event: 'updated', payload: { item } });
//   });
  
//   router.del('/item/:id', ctx => {
//     const id = ctx.params.id;
//     const index = items.findIndex(item => id === item.id);
//     if (index !== -1) {
//       const item = items[index];
//       items.splice(index, 1);
//       lastUpdated = new Date();
//       broadcast({ event: 'deleted', payload: { item } });
//     }
//     ctx.response.status = 204; // no content
//   });
  
//   // setInterval(() => {
//   //   lastUpdated = new Date();
//   //   lastId = `${parseInt(lastId) + 1}`;
//   //   const item = new Item({ id: lastId, text: `item ${lastId}`, date: lastUpdated, version: 1 });
//   //   items.push(item);
//   //   console.log(`New item: ${item.text}`);
//   //   broadcast({ event: 'created', payload: { item } });
//   // }, 5000);
  
//   app.use(router.routes());
//   app.use(router.allowedMethods());
  
//   server.listen(3000);

import http from "http";
import Koa from "koa";
import WebSocket from "ws";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import jwt from "koa-jwt";
import cors from "@koa/cors";
import { jwtConfig, timingLogger, exceptionHandler } from "./utils.js";
import { initWss } from "./wss.js";
import { itemRouter } from "./item.js";
import { authRouter } from "./auth.js";

const app = new Koa();
const server = http.createServer(app.callback());
const wss = new WebSocket.Server({ server });
initWss(wss);

app.use(cors());
app.use(timingLogger);
app.use(exceptionHandler);
app.use(bodyParser());

const prefix = "/api";

// public
const publicApiRouter = new Router({ prefix });
publicApiRouter.use("/auth", authRouter.routes());
app.use(publicApiRouter.routes()).use(publicApiRouter.allowedMethods());

app.use(jwt(jwtConfig));

// protected
const protectedApiRouter = new Router({ prefix });
protectedApiRouter.use("/book", itemRouter.routes());
app.use(protectedApiRouter.routes()).use(protectedApiRouter.allowedMethods());

server.listen(3000);
console.log("started on port 3000");
