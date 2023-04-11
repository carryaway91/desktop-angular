import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Folder } from '../models/folder.model';
import { ContextWindowService } from '../services/context-window.service';
import { FolderService } from '../services/folder-service';
import { MouseMoveService } from '../services/mouse-movement.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.css']
})
export class FolderComponent implements OnInit, AfterViewInit, OnDestroy {
 @Input('folder') folder: Folder;
 @Input('wholefolder') wholefolder: Folder;
 @Input('mousedata') mouseData: {x: number, y: number}
 @Input('isUpon') isUpon: boolean;
 @Input('movingToText') movingToText: string
 @Output('overalSizeOnDesktop') folderDataEmit = new EventEmitter<{x: number, y: number, id: number}>()
 @ViewChild('nameInput') nameInput: ElementRef;
 @ViewChild('fldr') fldr: ElementRef;
 nameSet: boolean = true
 renaming: boolean = false
 grabbed: boolean = false
 x: number;
 y: number;
 position: string = 'relative'
 scale: string = '50'
 overalSizeOnDesktopX: number
 overalSizeOnDesktopY: number
 folderToBePushedToId: number;
 subs: Subscription[] = []
 constructor(public cws: ContextWindowService, public fs: FolderService, public mms: MouseMoveService) {}

 ngOnInit(): void {
  this.x = this.folder.x;
  this.y = this.folder.y;
  this.scale = this.folder.size;

  document.onmouseup = () => { this.grabbed = false }
  this.subs.push(this.fs.updatingJustRenaming.subscribe(is => {
    if(!is && this.renaming) {
      this.type()
    }
    this.renaming = is
  }));
 
  this.subs.push(this.fs.updatingRenaming.subscribe(data => {
    if(data.id === this.folder.id) {
      this.renaming = data.is
    }
  }))
  this.subs.push(this.fs.updatedPushedToFolderId.subscribe(id => {
    this.folderToBePushedToId = id
  }))
  this.subs.push(this.fs.updateFolderSize.subscribe(size => {
    if(size === "L") {
      this.scale = '70'
      this.overalSizeOnDesktopX = 70 + this.x 
      this.overalSizeOnDesktopY = 70 + this.x 
    } else if(size === "M") {
      this.scale = '50'
      this.overalSizeOnDesktopX = 50 + this.x
      this.overalSizeOnDesktopY = 50 + this.x
    } else {
      this.scale = '30'
      this.overalSizeOnDesktopX = 30 + this.x
      this.overalSizeOnDesktopY = 30 + this.x
    }
  }))
}

ngAfterViewInit(): void {
  this.overalSizeOnDesktopX = !this.x ? 50 + 0 : this.x + 50
  this.overalSizeOnDesktopY = !this.y ? 50 + 0 : this.y + 50
  this.folderDataEmit.emit({x: this.overalSizeOnDesktopX, y: this.overalSizeOnDesktopY, id: this.folder.id})
  document.onclick = (e: any) => {
    console.log
    if(this.nameInput?.nativeElement) {
      if(e.target !== this.nameInput?.nativeElement) {
        console.log(e.target)
        this.type()
        this.renaming = false
      }
    }
  }
}

ngOnDestroy(): void {
  this.subs.forEach(sub => sub.unsubscribe())  
}
checkEnter(e: any) {
  if(e.keyCode === 13) {
   this.type()
   this.renaming = false
 }
}
 openFolder() {
  this.fs.setOpenFolder(this.folder.id)
  this.fs.openFolderFn()
 }
 
 openContextUponFolder(e: MouseEvent, folder: Folder) {
  if(e.which === 3) {
    this.cws.setClickedOnIcon(true, folder)
  }
 }

 type() {
  let value = this.nameInput?.nativeElement.textContent
  this.fs.renameFolder(true, this.folder, value)
 }


 folderGrabbed(e: MouseEvent) {
   console.log(e.target)
   console.log(e.which === 1 && e.target !== this.nameInput?.nativeElement)
   if(e.which === 1 && e.target !== this.nameInput?.nativeElement) {
     this.grabbed = true
     if(this.grabbed) {
       e.preventDefault()
     } 
    this.position = 'fixed'
  }
}

move(e:MouseEvent) {
  if(this.grabbed){
    this.mms.setFolderGrabbed(true)
    if(!this.renaming) {
      this.x = e.x;
      this.y = e.y
      this.folderDataEmit.emit({ x: e.x, y: e.y, id: this.folder.id})
    }
  }


}

removeGrab(e: MouseEvent) {
  this.grabbed = false
}

isOverFolder(is: boolean) {
  this.fs.setOverFolder(is)
}

prevent(e:MouseEvent) {
  e.stopPropagation()
}
} 
