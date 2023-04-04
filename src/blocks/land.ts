import * as Blockly from 'blockly'
import { javascriptGenerator } from 'blockly/javascript'

export class LandBlocks {
  constructor() {
    // Block definitions
    Blockly.defineBlocksWithJsonArray([
      {
        type: 'land',
        message0: 'land',
        previousStatement: null,
        nextStatement: null,
        style: 'land_blocks'
      },
      {
        type: 'land_then_takeoff',
        message0: 'land for %1 seconds then takeoff',
        args0: [
          {
            type: 'input_value',
            name: 'delay'
          }
        ],
        inputsInline: true,
        previousStatement: null,
        nextStatement: null,
        style: 'land_blocks'
      }
    ])

    // Generators
    javascriptGenerator['land'] = function (block: Blockly.Block) {
      const command = `{"action": "land", "payload": {}}`
      return `sendNavigationCommand(${JSON.stringify(command)});`
    }

    javascriptGenerator['land_then_takeoff'] = function (block: Blockly.Block) {
      const delay = javascriptGenerator.valueToCode(
        block,
        'delay',
        javascriptGenerator.ORDER_ATOMIC
      )

      const command = `{"action": "takeoff", "payload": { "alt": 2.5 }}`
      const code = `waitForSeconds(${delay});sendNavigationCommand(${JSON.stringify(command)});`
      return code
    }
  }
}
