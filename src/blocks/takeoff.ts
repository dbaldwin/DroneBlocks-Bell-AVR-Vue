import * as Blockly from 'blockly'
import { javascriptGenerator } from 'blockly/javascript'

export class TakeoffBlocks {

  constructor() {
    // Block definitions
    Blockly.defineBlocksWithJsonArray([
      {
        type: 'takeoff',
        message0: 'takeoff',
        previousStatement: null,
        nextStatement: null,
        style: 'takeoff_blocks'
      },
      {
        type: 'takeoff_after',
        message0: 'takeoff after %1 seconds',
        args0: [
            {
                'type': 'input_value',
                'name': 'delay'
            }
        ],
        inputsInline: true,
        previousStatement: null,
        nextStatement: null,
        style: 'takeoff_blocks',
    },

    ]);
  }


}