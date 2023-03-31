<script setup lang="ts">

import { ref } from 'vue';
import BlocklyComponent from "../components/BlocklyComponent.vue";
import { javascriptGenerator } from "blockly/javascript";
import { NavigationBlocks } from "../blocks/navigation"

new NavigationBlocks();

const foo = ref();
const code = ref();

const options = {
  media: "media/",
  grid: {
    spacing: 25,
    length: 3,
    colour: "#ccc",
    snap: true,
  },
  toolbox: `<xml>
          <category name="Navigation" colour="#FF0000">
            <block type="wait">
              <value name="duration">
                <shadow type="math_number">
                  <field name="NUM">5</field>
                </shadow>
              </value>
            </block>
            <block type="fly_forward">
              <value name="distance">
                <shadow type="math_number">
                  <field name="NUM">0.5</field>
                </shadow>
              </value>
            </block>
            <block type="fly_backward">
              <value name="distance">
                <shadow type="math_number">
                  <field name="NUM">0.5</field>
                </shadow>
              </value>
            </block>
            <block type="fly_left">
              <value name="distance">
                <shadow type="math_number">
                  <field name="NUM">0.5</field>
                </shadow>
              </value>
            </block>
            <block type="fly_right">
              <value name="distance">
                <shadow type="math_number">
                  <field name="NUM">0.5</field>
                </shadow>
              </value>
            </block>
            <block type="fly_up">
              <value name="distance">
                <shadow type="math_number">
                  <field name="NUM">0.5</field>
                </shadow>
              </value>
            </block>
            <block type="fly_down">
              <value name="distance">
                <shadow type="math_number">
                  <field name="NUM">0.5</field>
                </shadow>
              </value>
            </block>
          </category>
          <category name="Logic" colour="%{BKY_LOGIC_HUE}">
            <block type="controls_if"></block>
            <block type="logic_compare"></block>
            <block type="logic_operation"></block>
            <block type="logic_negate"></block>
            <block type="logic_boolean"></block>
          </category>
          <category name="Loops" colour="%{BKY_LOOPS_HUE}">
            <block type="controls_repeat_ext">
              <value name="TIMES">
                <block type="math_number">
                  <field name="NUM">10</field>
                </block>
              </value>
            </block>
            <block type="controls_whileUntil"></block>
          </category>
          <category name="Math" colour="%{BKY_MATH_HUE}">
            <block type="math_number">
              <field name="NUM">123</field>
            </block>
            <block type="math_arithmetic"></block>
            <block type="math_single"></block>
          </category>
          <category name="Text" colour="%{BKY_TEXTS_HUE}">
            <block type="text"></block>
            <block type="text_length"></block>
            <block type="text_print"></block>
          </category>
          <category name="Variables" custom="VARIABLE" colour="%{BKY_VARIABLES_HUE}">
            </category>
          <category name="Stocks" colour="%{BKY_LOOPS_HUE}">
            <block type="stock_buy_simple"></block>
            <block type="stock_buy_prog"></block>
            <block type="stock_fetch_price"></block>
          </category>
        </xml>`,
};
const showCode = () => {
  (code.value = javascriptGenerator.workspaceToCode(foo.value.workspace));
}
</script>

<template>
  <div>
    <BlocklyComponent id="blocklyComponent" :options="options" ref="foo"></BlocklyComponent>
    <p id="code">
      <button @click="showCode()">Show JavaScript</button>
    <pre v-html="code"></pre>
    </p>
  </div>
</template>

<style>
#code {
  position: absolute;
  right: 0;
  top: 100;
  width: 50%;
  height: 90%;
  margin: 0;
  background-color: beige;
}

#blocklyComponent {
  position: absolute;
  left: 0;
  top: 100;
  width: 50%;
  height: 90%;
}
</style>
