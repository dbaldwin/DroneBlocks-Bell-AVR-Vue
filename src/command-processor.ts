import Interpreter from 'js-interpreter'
import Blockly from 'blockly'
import { toast } from 'bulma-toast'
import * as mqtt from 'mqtt/dist/mqtt.min'

export class CommandProcessor {
  interpreter: Interpreter
  pauseCode: Boolean
  workspace: Blockly.Workspace
  isAbortingMission: Boolean
  globalVars: Object
  mqttBroker: mqtt

  constructor(interpreter: Interpreter, workspace: Blockly.Workspace, mqttBroker: mqtt) {
    this.interpreter = interpreter
    this.pauseCode = false
    this.workspace = workspace
    this.isAbortingMission = false
    this.globalVars = {}
    this.mqttBroker = mqttBroker
  }

  step() {
    this.pauseCode = false

    do {
      try {
        var hasMoreCode = this.interpreter.step()
      } finally {
        if (!hasMoreCode && !this.isAbortingMission) {
          this.done()
          return
        }
      }
      // Keep executing until a highlight statement is reached,
      // or the code completes or errors.
    } while (hasMoreCode && !this.pauseCode)
  }

  setGlobalVar(varName, varValue) {
    this.globalVars[varName] = varValue
  }

  getGlobalVar(varName) {
    return this.globalVars[varName]
  }

  // Send command to main process
  sendNavigationCommand(json: string) {
    console.log(json)
    this.mqttBroker.publish('avr/fcm/actions', json)
    this.pauseCode = true

    setTimeout(() => {
      this.step()
    }, 1000)
  }

  sendPCCCommand(topic: string, json: string) {
    console.log(json)
    this.mqttBroker.publish(topic, json)
    this.pauseCode = true

    setTimeout(() => {
      this.step()
    }, 1000)
  }

  // Get state of drone
  getState(attribute) {
    // const val = parseFloat(document.getElementById(attribute).textContent)
    // return val
  }

  log(message) {
    // const logger = document.getElementById('consoleLogger')
    // logger.value = logger.value + message + '\n'
  }

  abort() {
    // toast('Mission aborted successfully')
    this.isAbortingMission = true
    this.pauseCode = true
    this.reset()
  }

  done() {
    console.log('done')
    // toast('Mission completed successfully');

    toast({
      message: 'Mission completed successfully!',
      type: 'is-primary',
      position: 'top-center',
      closeOnClick: true,
      pauseOnHover: true,
      opacity: 0.8
    })

    // Delay in cases where there are only logic blocks on the canvas
    // Otherwise reset will be called before the command processor is complete
    setTimeout(() => {
      this.reset()
    }, 1000)
  }

  reset() {
    // Unhighlight any blocks
    // @ts-ignore
    this.workspace.highlightBlock(null)

    // Change abort button back to launch
    // const launchMissionButton = document.getElementById('launchMissionButton')
    // launchMissionButton.innerHTML = 'Launch'
    // launchMissionButton.classList.remove('is-danger')
    // launchMissionButton.classList.add('is-success')

    // Clear the interpreter
    this.interpreter = null
  }
}
