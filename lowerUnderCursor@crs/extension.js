const Lang = imports.lang;
const Main = imports.ui.main;
const Settings = imports.ui.settings;

class LUCExtension {
  constructor(metaData) {
    this.meta = metaData;
    this.stack = [];
    this.settingIDs = [];
  }

  enable() {
    this.settings = new Settings.ExtensionSettings(this, this.meta.uuid);
    this.bindHotkey();
    this.onSettingChangeFocus();
    let focusId = this.settings.connect(
      "changed::focus-after-lower",
      Lang.bind(this, this.onSettingChangeFocus),
    );
    let triggerId = this.settings.connect(
      "changed::trigger",
      Lang.bind(this, this.onSettingChangeHotkey),
    );
    this.settingIDs.push(focusId, triggerId);
  }

  disable() {
    this.disableHotkey();
    this._settingsChangeIds.forEach((id) => this.settings.disconnect(id));
    this._settingsChangeIds = [];
  }

  onSettingChangeFocus() {
    this.focusAfterLower = this.settings.getValue("focus-after-lower");
  }

  onSettingChangeHotkey() {
    this.disableHotkey();
    this.bindHotkey();
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
    let windowToLower = global.display.get_pointer_window(null);
    if (windowToLower) {
      windowToLower.lower();
    }
    if (this.focusAfterLower) {
      let windowToFocus = global.display.get_pointer_window(null);
      if (windowToFocus) {
        windowToFocus.activate(global.get_current_time());
      }
    }
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
