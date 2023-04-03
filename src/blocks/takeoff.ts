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

    // Generators
    javascriptGenerator['takeoff'] = function (block: Blockly.Block) {
      const code = `sendCommand("takeoff");`;
      return code;
    };

    javascriptGenerator['takeoff_after'] = function (block: Blockly.Block) {
        const delay = javascriptGenerator.valueToCode(block, 'delay', javascriptGenerator.ORDER_ATOMIC);
        const code = `waitForSeconds(${delay});sendCommand("takeoff");`;
        return code;
  };
  }


}