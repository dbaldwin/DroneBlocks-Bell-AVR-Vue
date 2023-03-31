import * as Blockly from 'blockly'
import { javascriptGenerator } from 'blockly/javascript'

export class NavigationBlocks {
  constructor() {
    // Block definitions
    Blockly.defineBlocksWithJsonArray([
      {
        type: 'wait',
        message0: 'wait %1 seconds',
        args0: [
          {
            type: 'input_value',
            name: 'duration'
          }
        ],
        previousStatement: true,
        nextStatement: true,
        style: 'navigation_blocks'
      },
      {
        type: 'fly_forward',
        message0: 'fly forward %1 %2',
        args0: [
          {
            type: 'input_value',
            name: 'distance'
          },
          {
            type: 'field_dropdown',
            name: 'units',
            options: [
              ['m', 'm'],
              ['ft', 'ft']
            ]
          }
        ],
        previousStatement: true,
        nextStatement: true,
        style: 'navigation_blocks'
      },
      {
        type: 'fly_backward',
        message0: 'fly backward %1 %2',
        args0: [
          {
            type: 'input_value',
            name: 'distance'
          },
          {
            type: 'field_dropdown',
            name: 'units',
            options: [
              ['m', 'm'],
              ['ft', 'ft']
            ]
          }
        ],
        previousStatement: true,
        nextStatement: true,
        style: 'navigation_blocks'
      },
      {
        type: 'fly_left',
        message0: 'fly left %1 %2',
        args0: [
          {
            type: 'input_value',
            name: 'distance'
          },
          {
            type: 'field_dropdown',
            name: 'units',
            options: [
              ['m', 'm'],
              ['ft', 'ft']
            ]
          }
        ],
        previousStatement: true,
        nextStatement: true,
        style: 'navigation_blocks'
      },
      {
        type: 'fly_right',
        message0: 'fly right %1 %2',
        args0: [
          {
            type: 'input_value',
            name: 'distance'
          },
          {
            type: 'field_dropdown',
            name: 'units',
            options: [
              ['m', 'm'],
              ['ft', 'ft']
            ]
          }
        ],
        previousStatement: true,
        nextStatement: true,
        style: 'navigation_blocks'
      },
      {
        type: 'fly_up',
        message0: 'fly up %1 %2',
        args0: [
          {
            type: 'input_value',
            name: 'distance'
          },
          {
            type: 'field_dropdown',
            name: 'units',
            options: [
              ['m', 'm'],
              ['ft', 'ft']
            ]
          }
        ],
        previousStatement: true,
        nextStatement: true,
        style: 'navigation_blocks'
      },
      {
        type: 'fly_down',
        message0: 'fly down %1 %2',
        args0: [
          {
            type: 'input_value',
            name: 'distance'
          },
          {
            type: 'field_dropdown',
            name: 'units',
            options: [
              ['m', 'm'],
              ['ft', 'ft']
            ]
          }
        ],
        previousStatement: true,
        nextStatement: true,
        style: 'navigation_blocks'
      }
    ])

    // Generators
    javascriptGenerator['wait'] = (block: Blockly.Block) => {
      const duration = javascriptGenerator.valueToCode(
        block,
        'duration',
        javascriptGenerator.ORDER_ATOMIC
      )
      const code = `wait(${duration});`
      return code
    }

    javascriptGenerator['fly_forward'] = (block: Blockly.Block) => {
      //return this.getCommand(block, 'forward', 'distance')
      return 'fly_forward'
    }
  }
}
