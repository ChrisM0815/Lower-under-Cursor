const Lang = imports.lang;
const Main = imports.ui.main;
const Settings = imports.ui.settings;

class LUCExtension {
  constructor(metaData) {
    this.meta = metaData;
    this.stack = [];
  }

  enable() {
    this.settings = new Settings.ExtensionSettings(this, this.meta.uuid);
    this.bindHotkey();
  }

  disable() {
    this.disableHotkey();
  }

  getHotkeySequence(name) {
    let str = this.settings.getValue(name);
    if (str && str.length > 0 && str != "::") {
      return str;
    }
    return null;
  }

  bindHotkey() {
    this.sequence = this.getHotkeySequence("trigger");
    if (this.sequence) {
      Main.keybindingManager.addHotKey(
        "trigger",
        this.sequence,
        Lang.bind(this, this.onHotkeyPress),
      );
    }
  }

  disableHotkey() {
    Main.keybindingManager.removeHotKey("trigger");
    this.sequence = null;
  }

  onHotkeyPress() {
    //global.log("LUC Extension: Trigger pressed");
    let focusTopWindow = false;
    let window = global.display.get_pointer_window(null);
    if (!window) return;
    window.lower();
    if (!focusTopWindow) return;
    window = global.display.get_pointer_window(null);
    if (!window) return;
    window.activate(global.get_current_time());
  }
}

let extension = null;
function enable() {
  extension.enable();
}

function disable() {
  extension.disable();
  extension = null;
}

function init(metadata) {
  if (!extension) {
    extension = new LUCExtension(metadata);
  }
}
