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