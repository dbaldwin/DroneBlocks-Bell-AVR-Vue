<script setup lang="ts">
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Blockly Vue Component.
 * @author dcoodien@gmail.com (Dylan Coodien)
 */

import { onMounted, ref, shallowRef } from "vue";
import Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";

const props = defineProps(["options"]);
const blocklyToolbox = ref();
const blocklyDiv = ref();
const workspace = shallowRef();

defineExpose({ workspace });

onMounted(() => {
    const options = props.options || {};
    workspace.value = Blockly.inject(blocklyDiv.value, options);
    javascriptGenerator.STATEMENT_PREFIX = 'highlightBlock(%1);\n';

    // Listen for workspace changes and save them to storage when a block is moved
    workspace.value.addChangeListener((event) => {
        const xml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace.value));
        if (event.type == 'move' && xml !== '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>') {
            localStorage.setItem('backup', xml)
        }
    })

    // Retrieve the blocks from storage and place them on the canvas when reloaded
    if (localStorage.getItem('backup')) {
        setTimeout(() => {
            workspace.value.clear()
            Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(localStorage.getItem('backup') ?? ""), workspace.value)
        }, 1000)
    }

});

</script>

<template>
    <div>
        <div class="blocklyDiv" ref="blocklyDiv"></div>
        <xml ref="blocklyToolbox" style="display: none">
            <slot></slot>
        </xml>
    </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.blocklyDiv {
    height: 100%;
    width: 100%;
    text-align: left;
}
</style>