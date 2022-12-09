import {writable, type Readable} from "svelte/store";
import {browser} from "$app/environment";

export interface Message {
    from: string,
    text: string
}

export interface Chat {
    messages: Message[],
    statusMessage: string,
}

export interface ChatStore extends Readable<Chat> {
    send: (msg: Message) => Promise<void>;
}

export function createChatStore(initialData: Message[]): ChatStore {
    let socket: WebSocket;
    const w = writable<Chat>({messages: initialData, statusMessage: "Loading..."}, _ => {
        if (browser) {
            loadSocket();
            return unloadSocket;
        }
    });

    function loadSocket() {
            socket = new WebSocket("ws://194.87.248.194:8080/ws");

            socket.onopen = e => {
                w.update(
                    x => {return {
                        statusMessage: "Connected.",
                        messages: x.messages,
                    }}
                )
            }

            socket.onerror = e => {
                w.update(
                    x => {return {
                        statusMessage: "Error!",
                        messages: x.messages,
                    }}
                )
            }

            socket.onclose = e => {
                w.update(
                    x => {return {
                        statusMessage: "Closed.",
                        messages: x.messages,
                    }}
                )
            }

            socket.onmessage = e => {
                w.update(
                    x => {
                        return {
                            statusMessage: x.statusMessage,
                            messages: [...x.messages, JSON.parse(e.data)]
                        };
                    }
                )
            }
    }

    function unloadSocket() {
        socket.close()
    }

    const send = async (msg: Message) => {
        await fetch("http://194.87.248.194:8080/chat", {method: "POST", body: JSON.stringify(msg), headers: {
            "Content-Type": "application/json"
        }});
    }
    return {
        subscribe: w.subscribe,
        send 
    }
}