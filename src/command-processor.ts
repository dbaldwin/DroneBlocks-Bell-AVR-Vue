import Interpreter from "js-interpreter"
import Blockly from "blockly";

export class CommandProcessor {

  interpreter: Interpreter;
  pauseCode: Boolean;
  workspace: Blockly.Workspace;
  isAbortingMission: Boolean;
  globalVars: Object;


  constructor(interpreter: Interpreter, workspace: Blockly.Workspace) {
    this.interpreter = interpreter;
    this.pauseCode = false;
    this.workspace = workspace;
    this.isAbortingMission = false;
    this.globalVars = {};
}

step() {
  this.pauseCode = false;

  do {
      try {
          var hasMoreCode = this.interpreter.step();
      } finally {
          if (!hasMoreCode && !this.isAbortingMission) {
              this.done();
              return;
          }
      }
      // Keep executing until a highlight statement is reached,
      // or the code completes or errors.
  } while (hasMoreCode && !this.pauseCode);

}

setGlobalVar(varName, varValue) {
  this.globalVars[varName] = varValue;
}

getGlobalVar(varName) {
  return this.globalVars[varName];
}

// Send command to main process
sendCommand(...args) {
  window.ipcRenderer.send('send_command_to_tello', args);
  this.pauseCode = true;
}

sendLEDCommand(command, values) {
  window.ipcRenderer.send('send_led_command_to_tello', command, values);
  this.pauseCode = true;
}

// Get state of drone
getState(attribute) {
  const val = parseFloat(document.getElementById(attribute).textContent);
  return val;
}

log(message) {
  const logger = document.getElementById("consoleLogger");
  logger.value = logger.value + message + "\n";
}

abort() {
  toast('Mission aborted successfully');
  this.isAbortingMission = true;
  this.pauseCode = true;
  this.reset();
}

done() {
  toast('Mission completed successfully');

  // Delay in cases where there are only logic blocks on the canvas
  // Otherwise reset will be called before the command processor is complete
  setTimeout(() => {
      this.reset();
  }, 1000);
}

reset() {
  // Unhighlight any blocks
  this.workspace.highlightBlock(null);

  // Change abort button back to launch
  const launchMissionButton = document.getElementById('launchMissionButton');
  launchMissionButton.innerHTML = 'Launch';
  launchMissionButton.classList.remove('is-danger');
  launchMissionButton.classList.add('is-success');

  // Clear the interpreter
  this.interpreter = null;
}
  
}