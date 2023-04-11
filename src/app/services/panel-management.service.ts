import { EventEmitter } from '@angular/core';

export class PanelManagementService {
    panelOpened = false

    panelStatusChanged = new EventEmitter<boolean>()
    getPanelStatus() {
        return this.panelOpened
    }

    setOpenPanel() {
        this.panelOpened = true
        this.panelStatusChanged.emit(this.panelOpened)
    }
}