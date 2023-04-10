<script setup lang="ts">

import { ref, onMounted } from 'vue';
import BlocklyComponent from "../components/BlocklyComponent.vue";
import { javascriptGenerator } from "blockly/javascript";
import { NavigationBlocks } from "@/blocks/navigation"
import { TakeoffBlocks } from "@/blocks/takeoff";
import { LandBlocks } from "@/blocks/land";
import Interpreter from "js-interpreter"
import { CommandProcessor } from '@/command-processor';
import DroneBlocksTheme from '@/themes/droneblocks.js'
import * as mqtt from 'mqtt/dist/mqtt.min'

let mqttBroker: mqtt
let commandProcessor: CommandProcessor;

new NavigationBlocks();
new TakeoffBlocks();
new LandBlocks();

const blocklyRef = ref();
const launchButonRef = ref();

const options = {
  theme: DroneBlocksTheme,
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
    <category name="Takeoff" colour="#3a86ff">
      <block type="takeoff"></block>
      <block type="takeoff_after">
        <value name="delay">
          <shadow type="math_number">
            <field name="NUM">5</field>
          </shadow>
        </value>
      </block>
    </category>
    <category name="Navigation" colour="#8338ec">
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
      <block type="go_home"></block>
    </category>
    <category name="Land" colour="#fb5607">
      <block type="land"></block>
      <block type="land_then_takeoff">
        <value name="delay">
          <shadow type="math_number">
            <field name="NUM">5</field>
          </shadow>
        </value>
      </block>
    </category>
    <sep></sep>
    <category name="Control" colour="#ffc6ff">
    </category>
    <category name="LED" colour="#bdb2ff">
    </category>
    <sep></sep>
    <category name="Logic" colour="#4ecdc4">
      <block type="controls_if"></block>
      <block type="logic_compare"></block>
      <block type="logic_operation"></block>
      <block type="logic_negate"></block>
      <block type="logic_boolean"></block>
    </category>
    <category name="Loops" colour="#00bbf9">
      <block type="controls_repeat_ext">
        <value name="TIMES">
          <block type="math_number">
            <field name="NUM">10</field>
          </block>
        </value>
      </block>
      <block type="controls_whileUntil"></block>
    </category>
    <category name="Math" colour="#ffd166">
      <block type="math_number">
        <field name="NUM">123</field>
      </block>
      <block type="math_arithmetic"></block>
      <block type="math_single"></block>
    </category>
    <category name="Text" colour="#f15bb5">
      <block type="text"></block>
      <block type="text_length"></block>
      <block type="text_print"></block>
    </category>
    <category name="Lists" colour="#9b5de5">
      <block type="lists_create_with">
        <mutation items="0"></mutation>
      </block>
      <block type="lists_create_with">
        <mutation items="3"></mutation>
      </block>
      <block type="lists_repeat">
        <value name="NUM">
          <shadow type="math_number">
            <field name="NUM">5</field>
          </shadow>
        </value>
      </block>
      <block type="lists_length"></block>
      <block type="lists_isEmpty"></block>
      <block type="lists_indexOf">
        <field name="END">FIRST</field>
        <value name="VALUE">
          <block type="variables_get">
            <field name="VAR" id="@=*efbqX#savK%0;4;fo">list</field>
          </block>
        </value>
      </block>
      <block type="lists_getIndex">
        <mutation statement="false" at="true"></mutation>
        <field name="MODE">GET</field>
        <field name="WHERE">FROM_START</field>
        <value name="VALUE">
          <block type="variables_get">
            <field name="VAR" id="@=*efbqX#savK%0;4;fo">list</field>
          </block>
        </value>
      </block>
      <block type="lists_setIndex">
        <mutation at="true"></mutation>
        <field name="MODE">SET</field>
        <field name="WHERE">FROM_START</field>
        <value name="LIST">
          <block type="variables_get">
            <field name="VAR" id="@=*efbqX#savK%0;4;fo">list</field>
          </block>
        </value>
      </block>
      <block type="lists_getSublist">
        <mutation at1="true" at2="true"></mutation>
        <field name="WHERE1">FROM_START</field>
        <field name="WHERE2">FROM_START</field>
        <value name="LIST">
          <block type="variables_get">
            <field name="VAR" id="@=*efbqX#savK%0;4;fo">list</field>
          </block>
        </value>
      </block>
      <block type="lists_split">
        <mutation mode="SPLIT"></mutation>
        <field name="MODE">SPLIT</field>
        <value name="DELIM">
          <shadow type="text">
            <field name="TEXT">,</field>
          </shadow>
        </value>
      </block>
      <block type="lists_sort">
        <field name="TYPE">NUMERIC</field>
        <field name="DIRECTION">1</field>
      </block>
    </category>
    <sep></sep>
    <category name="Variables" custom="VARIABLE" colour="#08979d">
    </category>
    <category name="Functions" colour="#0d3b66" custom="PROCEDURE"></category>
  </xml>`,
};

/**
 * When connected the broker let's change the launch button to green
 */
onMounted(() => {
  mqttBroker = mqtt.connect(`ws://10.42.0.1:9001`)

  mqttBroker.on('connect', () => {
    launchButonRef.value.classList.remove('is-light')
    launchButonRef.value.classList.add('is-primary')
  })
});


const launchMission = () => {
  // console.log('launching mission')
  // const code = javascriptGenerator.workspaceToCode(blocklyRef.value.workspace);
  // console.log(code);
  setupInterpreter();

}

// Method for external application to send next command
// @ts-ignore
window.processNextCommand = function () {
  //console.log(javascriptGenerator.workspaceToCode(blocklyRef.value.workspace));
  commandProcessor.step();
}

const setupInterpreter = () => {

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
    const sendNavigationCommandWrapper = function (json: string) {
      commandProcessor.sendNavigationCommand(json);
    }
    interpreter.setProperty(globalObject, 'sendNavigationCommand', interpreter.createNativeFunction(sendNavigationCommandWrapper));

    // // For the print block
    // const alertWrapper = function (message: string) {
    //   return commandProcessor.log(message);
    // }
    // interpreter.setProperty(globalObject, 'alert', interpreter.createNativeFunction(alertWrapper));

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

    // // Handle variables in the workspace
    // const setGlobalVarWrapper = function (varName, varValue) {
    //   commandProcessor.setGlobalVar(varName, varValue);
    // }
    // interpreter.setProperty(globalObject, 'setGlobalVar', interpreter.createNativeFunction(setGlobalVarWrapper))

    // const getGlobalVarWrapper = function (varName) {
    //   return commandProcessor.getGlobalVar(varName);
    // }
    // interpreter.setProperty(globalObject, 'getGlobalVar', interpreter.createNativeFunction(getGlobalVarWrapper))
  }

  // Launch the mission
  const code = javascriptGenerator.workspaceToCode(blocklyRef.value.workspace);
  const interpreter = new Interpreter(code, interpreterAPI);
  commandProcessor = new CommandProcessor(interpreter, blocklyRef.value.workspace, mqttBroker);
  commandProcessor.step();
}
</script>

<template>
  <div>
    <button class="button is-light" id="launchButton" @click="launchMission" ref="launchButonRef">Launch</button>
    <BlocklyComponent id="blocklyComponent" :options="options" ref="blocklyRef"></BlocklyComponent>
  </div>
</template>

<style>
#blocklyComponent {
  position: absolute;
  left: 0;
  top: 60px;
  width: 100%;
  height: 90%;
}

#launchButton {
  position: absolute;
  top: 80px;
  right: 20px;
  z-index: 100;
}
</style>
