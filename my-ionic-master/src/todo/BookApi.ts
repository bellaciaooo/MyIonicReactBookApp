import axios from "axios";
import { getLogger, authConfig, baseUrl, withLogs } from "../core";
import { Book } from "./Book";
import { Preferences } from "@capacitor/preferences";
import { book } from "ionicons/icons";

const log = getLogger('itemLogger');

const getBooksUrl = `http://${baseUrl}/api/book`;
const updateBookUrl = `http://${baseUrl}/api/book`;
const createBookUrl = `http://${baseUrl}/api/book`;

export const getAllBooks: (token: string) => Promise<Book[]> = (token) => {
    return withLogs(axios.get(getBooksUrl, authConfig(token)), 'getAllBooks');
}

export const updateBookAPI: (token: string, book: Book) => Promise<Book[]> = (token, book) => {
    return withLogs(axios.put(`${updateBookUrl}/${book._id}`, book, authConfig(token)), 'updateBook');
}

export const createBookAPI: (token: string, book: Book) => Promise<Book[]> = (token, book) => {
  return withLogs(axios.post(`${createBookUrl}`, book, authConfig(token)), 'createBook');
}

export const deleteBookAPI: (token: string, id: string) => Promise<Book[]> = (token, id) => {
  return withLogs(axios.delete(`${createBookUrl}/${id}`, authConfig(token)), 'deleteBook');
}

interface MessageData {
    event: string;
    payload: {
      successMessage: string,
      updatedBook: Book
    };
}

export const newWebSocket = (token: string, onMessage: (data: MessageData) => void) => {
    const ws = new WebSocket(`ws://${baseUrl}`)
    ws.onopen = () => {
      log('web socket onopen');
      ws.send(JSON.stringify({type: 'authorization', payload :{token}}));
    };
    ws.onclose = () => {
      log('web socket onclose');
    };
    ws.onerror = error => {
      log('web socket onerror', error);
    };
    ws.onmessage = messageEvent => {
      log('web socket onmessage');
      console.log(messageEvent.data);
      onMessage(JSON.parse(messageEvent.data));
    };
    return () => {
      ws.close();
    }
}

  