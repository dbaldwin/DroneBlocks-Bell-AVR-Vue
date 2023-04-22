import * as Blockly from 'blockly'
import { javascriptGenerator } from 'blockly/javascript'

export class LEDBlocks {
  constructor() {
    // Block definitions
    Blockly.defineBlocksWithJsonArray([
      {
        type: 'main_led_color',
        message0: 'set led ring color %1',
        args0: [
          {
            type: 'field_colour',
            name: 'color',
            colour: '#ff0000'
          }
        ],
        previousStatement: true,
        nextStatement: true,
        style: 'led_blocks'
      }
    ])

    // Generators
    javascriptGenerator['main_led_color'] = (block: Blockly.Block) => {
      const hexColor = block.getFieldValue('color')
      const rgbColor = this.hexToRgb(hexColor)
      const command = `{"wrgb": [255, ${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}]}`
      return `sendLEDCommand(${JSON.stringify(command)});`
    }

    javascriptGenerator['led_blink'] = (block: Blockly.Block) => {}
  }

  hexToRgb(hex) {
    let result = hex.replace(/'/g, '') // Remove single quotes, in value input cases Blockly will wrap in single quotes
    result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(result)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : { r: 0, g: 0, b: 0 }
  }
}
