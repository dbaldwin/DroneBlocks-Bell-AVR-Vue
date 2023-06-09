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
      },
      {
        type: 'go_home',
        message0: 'go home',
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
      const code = `waitForSeconds(${duration});`
      return code
    }

    javascriptGenerator['fly_forward'] = (block: Blockly.Block) => {
      const command = `{"action": "goto_location_ned", "payload": { "n": ${this.getDistance(
        block
      )}, "e": 0, "d": 0, "rel": true, "heading": 0 }}`
      return `sendNavigationCommand(${JSON.stringify(command)});`
    }

    javascriptGenerator['fly_backward'] = (block: Blockly.Block) => {
      const command = `{"action": "goto_location_ned", "payload": { "n": ${
        this.getDistance(block) * -1
      }, "e": 0, "d": 0, "rel": true, "heading": 0 }}`
      return `sendNavigationCommand(${JSON.stringify(command)});`
    }

    javascriptGenerator['fly_left'] = (block: Blockly.Block) => {
      const command = `{"action": "goto_location_ned", "payload": { "n": 0, "e":  ${
        this.getDistance(block) * -1
      }, "d": 0, "rel": true, "heading": 0 }}`
      return `sendNavigationCommand(${JSON.stringify(command)});`
    }

    javascriptGenerator['fly_right'] = (block: Blockly.Block) => {
      const command = `{"action": "goto_location_ned", "payload": { "n": 0, "e":  ${this.getDistance(
        block
      )}, "d": 0, "rel": true, "heading": 0 }}`
      return `sendNavigationCommand(${JSON.stringify(command)});`
    }

    javascriptGenerator['fly_up'] = (block: Blockly.Block) => {
      const command = `{"action": "goto_location_ned", "payload": { "n": 0, "e":  0, "d": ${
        this.getDistance(block) * -1
      }, "rel": true, "heading": 0 }}`
      return `sendNavigationCommand(${JSON.stringify(command)});`
    }

    javascriptGenerator['fly_down'] = (block: Blockly.Block) => {
      const command = `{"action": "goto_location_ned", "payload": { "n": 0, "e":  0, "d": ${this.getDistance(
        block
      )}, "rel": true, "heading": 0 }}`
      return `sendNavigationCommand(${JSON.stringify(command)});`
    }

    javascriptGenerator['go_home'] = () => {
      const command = `{"action": "goto_location_ned", "payload": { "n": 0, "e":  0, "d": -2.5, "heading": 0 }}`
      return `sendNavigationCommand(${JSON.stringify(command)});`
    }
  }

  getDistance(block: Blockly.Block): number {
    const distance: number = javascriptGenerator.valueToCode(
      block,
      'distance',
      javascriptGenerator.ORDER_NONE
    )

    const units: string = block.getFieldValue('units')
    if (units == 'ft') {
      return distance * 0.3048
    } else {
      return distance
    }
  }
}
