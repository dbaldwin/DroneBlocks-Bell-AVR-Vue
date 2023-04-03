<script setup lang="ts">

import { ref, onMounted } from 'vue';
import BlocklyComponent from "../components/BlocklyComponent.vue";
import { javascriptGenerator } from "blockly/javascript";
import { NavigationBlocks } from "@/blocks/navigation"
import { TakeoffBlocks } from "@/blocks/takeoff";
import Interpreter from "js-interpreter"
import Blockly from "blockly";

// onMounted(() => {
//   console.log("mounted!");
//   new Interpreter();
// });

new NavigationBlocks();
new TakeoffBlocks();

const blocklyRef = ref();
const codeRef = ref();

const options = {
  media: "media/",
  grid: {
    spacing: 20,
    length: 1,
    colour: '#888',
    snap: false
  },
  zoom: {
    controls: true,
    startScale: 1,
    maxScale: 3,
    minScale: 0.3,
    scaleSpeed: 1.2
  },
  toolbox: `<xml>
    <category name="Takeoff" colour="00FF00">
      <block type="takeoff"></block>
      <block type="takeoff_after">
        <value name="delay">
          <shadow type="math_number">
            <field name="NUM">5</field>
          </shadow>
        </value>
      </block>
    </category>
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
  </xml>`,
};
const showCode = () => {
  (codeRef.value = javascriptGenerator.workspaceToCode(blocklyRef.value.workspace));
}

const launchMission = () => {
  // console.log('launching mission')
  // const code = javascriptGenerator.workspaceToCode(blocklyRef.value.workspace);
  // console.log(code);
  setupInterpreter();

}

const setupInterpreter = () => {
  const code = javascriptGenerator.workspaceToCode(blocklyRef.value.workspace);

  console.log(code);

  return;

  function interpreterAPI(interpreter: Interpreter, globalObject: object) {

    // Ensure function name does not conflict with variable names.
    javascriptGenerator.addReservedWords('highlightBlock');

    // Highlight block
    const highlightBlockWrapper = function (blockId: string) {
      //Blockly.getMainWorkspace().highlightBlock(blockId)
      blocklyRef.value.workspace.highlightBlock(blockId);
    }
    interpreter.setProperty(globalObject, 'highlightBlock', interpreter.createNativeFunction(highlightBlockWrapper));

    // Send normal command - command processor
    const sendCommandWrapper = function (...args) {
      commandProcessor.sendCommand(...args);
    }
    interpreter.setProperty(globalObject, 'sendCommand', interpreter.createNativeFunction(sendCommandWrapper));

    // For the print block
    const alertWrapper = function (message: string) {
      return commandProcessor.log(message);
    }
    interpreter.setProperty(globalObject, 'alert', interpreter.createNativeFunction(alertWrapper));

    // Wait
    const waitWrapper = function async(timeInSeconds: number, callback: Function) {
      commandProcessor.pauseCode = true;
      // Delay the call to the callback.
      setTimeout(() => {
        callback();
        commandProcessor.step();
      }, timeInSeconds * 1000);
    }
    interpreter.setProperty(globalObject, 'waitForSeconds', interpreter.createAsyncFunction(waitWrapper));

    // Handle variables in the workspace
    const setGlobalVarWrapper = function (varName, varValue) {
      commandProcessor.setGlobalVar(varName, varValue);
    }
    interpreter.setProperty(globalObject, 'setGlobalVar', interpreter.createNativeFunction(setGlobalVarWrapper))

    const getGlobalVarWrapper = function (varName) {
      return commandProcessor.getGlobalVar(varName);
    }
    interpreter.setProperty(globalObject, 'getGlobalVar', interpreter.createNativeFunction(getGlobalVarWrapper))
  }

  // Launch the mission
  const interpreter = new Interpreter(code, interpreterAPI);
  commandProcessor = new CommandProcessor(interpreter, Blockly.getMainWorkspace());
  commandProcessor.step();
}
</script>

<template>
  <div>
    <button class="button is-primary" id="launchButton" @click="launchMission">Launch</button>
    <BlocklyComponent id="blocklyComponent" :options="options" ref="blocklyRef"></BlocklyComponent>
    <p id="code">
      <button @click="showCode()">Show JavaScript</button>
    <pre v-html="codeRef"></pre>
    </p>
  </div>
</template>

<style>
#code {
  position: absolute;
  right: 0;
  top: 60px;
  width: 50%;
  height: 90%;
  margin: 0;
  background-color: beige;
}

#blocklyComponent {
  position: absolute;
  left: 0;
  top: 60px;
  width: 50%;
  height: 90%;
}

#launchButton {
  position: absolute;
  top: 150px;
  left: 50%;
  z-index: 100;
}
</style>
