import { EventEmitter } from '@angular/core';

export class MouseMoveService {
    updatedCoordinates = new EventEmitter<{x: number; y: number}>()
    updatedFolderGrabbed = new EventEmitter<boolean>()

    x: number;
    y: number;

    folderGrabbed: boolean = false;


    getCoordinates() {
        return {x: this.x, y: this.y }
    }

    setFolderGrabbed(grabbed: boolean) {
        this.folderGrabbed = grabbed
        this.updatedFolderGrabbed.emit(this.folderGrabbed)
    }
    
    setCoordinates(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.updatedCoordinates.emit({x: this.x, y: this.y})
    }

}