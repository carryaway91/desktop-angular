import { Component, ViewChild, ElementRef, OnInit, Input, OnDestroy} from '@angular/core';
import { MouseMoveService } from '../services/mouse-movement.service';
import { FolderService } from '../services/folder-service';
import { Folder } from '../models/folder.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-open-folder',
  templateUrl: './open-folder.component.html',
  styleUrls: ['./open-folder.component.css']
})
export class OpenFolderComponent implements OnInit, OnDestroy {
  @Input('folder') folder: Folder;
  @ViewChild('openFolder') openFolder: ElementRef;
  @ViewChild('draggable') draggable: ElementRef;
  @ViewChild('textDiv') textDiv: ElementRef;
  x: number = 500; 
  y: number = 150; 
  w: number = 50;
  h: number = 70;
  grabbed: boolean;
  tabActive: boolean = false
  minimalized: boolean = false;
  fullscreen: boolean = false;
  text: string = ''
  subs: Subscription[] = []
  constructor(public mms: MouseMoveService, public fs: FolderService) {}

  ngOnInit(): void {
    this.subs.push(this.mms.updatedFolderGrabbed.subscribe(grabbed => {
      this.grabbed = grabbed
    }))
    document.addEventListener('click', () => {
      this.tabActive = false
    })
    if(this.folder.text && this.folder.type === 3) {
      this.text = this.folder.text
    }
    this.subs.push(this.fs.minimalizedUpdated.subscribe(is => {
      this.minimalized = is
    }))
  }  
  
  folderGrabbed(e: any) {
    this.mms.setFolderGrabbed(true)
  }

  move(e:any) {
    if(this.grabbed){
      this.x = this.openFolder.nativeElement.getBoundingClientRect().x + e.movementX
     this.y =  this.openFolder.nativeElement.getBoundingClientRect().y + e.movementY
    }
  }

  removeGrab() {
    this.mms.setFolderGrabbed(false)
  }

  exitWindow() {
    this.fs.closeFolder()
  }

  maxOrMin() {
    if(this.w === 100) {
      this.w = 50
      this.h = 70
      this.x = 500;
      this.y = 150;
    } else {
      this.x = 0;
      this.y = 0;
      this.w = 100
      this.h = 100
    }
  }

  active(e: MouseEvent) {
    e.stopImmediatePropagation()
    e.stopPropagation()
    this.tabActive = true
  }

  prevent(e: MouseEvent) {
    e.stopImmediatePropagation()
    e.stopPropagation()
  }

  minimalize() {
    this.fs.setMinimalized(true)
  }

  type() {
    this.text = this.textDiv.nativeElement.textContent
    this.fs.typeToTextFile(this.folder.id, this.text)
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe())
  }
}
