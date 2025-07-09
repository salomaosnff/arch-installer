<script setup lang="ts">
import { Terminal } from '@xterm/xterm';
import { onMounted, useTemplateRef } from 'vue';


const terminal = useTemplateRef('terminal');
const term = new Terminal()

onMounted(() => {
    term.open(terminal.value!)
    term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
})
</script>


<template>
    <div ref="terminal"></div>
</template>

