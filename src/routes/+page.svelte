<script lang="ts">
	import { type Message, createChatStore } from "$lib/chatStore";
    import {onMount, onDestroy} from "svelte";
	import type { PageData } from "./$types";
    
    export let data: PageData;
    let _from: string;
    let text: string;

    const chat = createChatStore(data.messages);
    
    const onSend = async () => {
        if (text == "") return;
        let from = _from;
        if (from == "") {
            from = "Anonymous"
        }
        let msg = {
            from,
            text
        };
        await chat.send(msg);
        text = "";
    }
</script>

<div>WebSocket: {$chat.statusMessage}</div>
<div>From: <input bind:value={_from}> Msg: <input bind:value={text}> <button on:click={onSend}>Send</button> </div>
<h4>Messages:</h4>
{#each $chat.messages as msg}
    <div><b>[{msg.from}]</b>: {msg.text}</div>
{/each}