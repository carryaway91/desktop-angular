import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Folder } from './models/folder.model';
import { PanelManagementService } from './services/panel-management.service';
import { FolderService } from './services/folder-service';
import { MouseMoveService } from './services/mouse-movement.service';
import { ContextWindowService } from './services/context-window.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy  {
  title = 'desktop';
  @ViewChild('desktop') desktop: ElementRef;
  @ViewChild('folder') folder: ElementRef;

  mouseX: number;
  mouseY: number;
  w: number;
  h: number;
  left: number;
  top: number;
  contextLeft: number;
  contextTop: number;
  dir: 'LTR' | 'RTL' = 'LTR';
  contextVisible: boolean = false;
  showPanel: boolean = false;
  openFolder: Folder;
  folderGrabbed: boolean = false;
  folderIsOpen: boolean = false;
  overFolder: boolean;
  allFolderPositions: {x: number, y: number, id: number}[] = [];
  movingToText: string = ''
  isUpon: boolean = false;
  currentlyGrabbedFolder: Folder | undefined;
  toBePushedFolderId: number;
  subs: Subscription[] = []
  constructor(public cws: ContextWindowService, public fs: FolderService, public pms: PanelManagementService,
    public mms: MouseMoveService) {}
  folders: Folder[] = []

 

  ngAfterViewInit(): void {
    alert('Please, read the manual and have fun :)')

    document.addEventListener('mouseup', e => {
      this.mms.setFolderGrabbed(false)
    })
  }
  
  renamingFalse() {
    this.fs.setRenaming(false)

  }
  ngOnInit() {
    window.oncontextmenu = (e: MouseEvent) => {
      e.preventDefault()
      this.fs.setRenaming(false)
      if(this.cws.contextWindowVisible) {
        this.cws.setContextWindowVisible(false)
      } else {
        this.cws.setContextWindowVisible(true)
      }
      this.contextVisible = this.cws.contextWindowVisible
      this.contextLeft = e.x
      this.contextTop = e.y
    }
    this.subs.push(this.cws.updatecontextWindowVisible.subscribe(is => {
      this.contextVisible = is
    }))
    this.subs.push(this.fs.folderIsOpenChanged.subscribe(is => {
      this.folderIsOpen = is
    }))
    this.subs.push(this.mms.updatedFolderGrabbed.subscribe(grabbed => {
      this.folderGrabbed = grabbed
    }))
    
    this.folders = this.fs.getFolders()
    this.subs.push(this.fs.foldersUpdated.subscribe((data: Folder[]) => {
      this.folders = data
    }))

    this.subs.push(this.fs.openFolderUpdated.subscribe((f: Folder) => {
      this.openFolder = f
    }))

    this.showPanel = this.pms.getPanelStatus()
    this.subs.push(this.pms.panelStatusChanged.subscribe((opened: boolean) => {
      this.showPanel = opened
    }))
    this.overFolder = false;
    this.subs.push(this.fs.updateOverFolder.subscribe(is => {
      this.overFolder = is
    }))
    
    this.subs.push(this.fs.updatedCoodrinates.subscribe(data => {
      this.mouseX = data.x;
      this.mouseY = data.y;
    }))

    this.subs.push(this.fs.updatedPushedToFolderId.subscribe(id => {
      this.toBePushedFolderId = id
    }))

    document.addEventListener('click', (e) => {
      this.contextVisible = false
    })
  }

  
  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  onDragMouse(e: any) {
    this.left < e.x ? this.dir = 'LTR' : this.dir = 'RTL';
    if(this.dir === 'LTR' && this.left && this.top) {
      this.w = e.x - this.left
    this.h = e.y - this.top
    }

    if(this.dir === 'RTL') {
      this.w = e.x - this.left
      this.h = e.y - this.top
    }
  }

  onStartTheSelection(e: MouseEvent) {
    if(e.which === 1) {
      this.left = e.x
      this.top = e.y
    }
  }
  
  deleteSelection() {
    this.w = 0;
    this.h = 0;
    this.left = 0;
    this.top = 0
  }
 
  onContext(e: any) {
    if(e.target?.classList.contains('folder-list')) {
      this.cws.setClickedOnIcon(false, null)
    } 
  }
  addFolderWithData(data: any) {
    if(data) {
      this.allFolderPositions = []
      this.allFolderPositions.push(data)
    }
  }

  checkIfOnTopAnotherFolder(e: MouseEvent, folder: Folder) {
    if(this.mms.folderGrabbed) {
      const grabbedFolder = this.fs.getFolder(folder.id)
      if(grabbedFolder) {
        for(let i = 0; i <= this.allFolderPositions.length - 1; i++) {
          if(folder.id !== this.allFolderPositions[i].id) {
            if(this.allFolderPositions[i].x > e.x && this.allFolderPositions[i].x < e.x + 50 || this.allFolderPositions[i].y > e.y && this.allFolderPositions[i].y < e.x + 50) {
              this.currentlyGrabbedFolder = this.fs.getFolder(this.allFolderPositions[i].id)
              if(this.currentlyGrabbedFolder) {
                this.isUpon = true;
                this.movingToText = `Move to ${folder.name}`
              } 
            }
          }
        }
      }
    }
  }

  reset() {
    this.isUpon = false;
    this.movingToText = ""
  }

  addFolderToAnother(id: number, currentlyGrabbedFolder: Folder | undefined) {
    if(this.isUpon && id && currentlyGrabbedFolder && currentlyGrabbedFolder.nestable) {
      const folderToBePushedTo = this.fs.getFolder(id)
      if(folderToBePushedTo?.type === 0) {
        this.fs.pushFolderToFolder(id, currentlyGrabbedFolder)
        this.currentlyGrabbedFolder = undefined
        return
      }
    }
  }
}
