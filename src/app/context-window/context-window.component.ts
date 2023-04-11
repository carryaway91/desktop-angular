import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ContextWindowService } from '../services/context-window.service';
import { ContextListItemModel } from '../models/context-list-item.model';
import { FolderService } from '../services/folder-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-context-window',
  templateUrl: './context-window.component.html',
  styleUrls: ['./context-window.component.css']
})
export class ContextWindowComponent implements OnInit, OnDestroy {
  @Input('left') left: number;
  @Input('top') top: number;
  @ViewChild('context') context: ElementRef;
  opacity: number = 0;
  linkItems: ContextListItemModel[];
  isFolderContext: boolean = false;
  subs: Subscription[] = []
  constructor(public fs: FolderService, public cws: ContextWindowService) {}
  
  ngOnInit(): void {
    this.isFolderContext = this.cws.clickedOnIncon
    if(this.isFolderContext) {
      this.linkItems = this.cws.getClickedOnIcon()
    } else {
      this.linkItems = this.cws.getItems()
    }
    this.subs.push(this.cws.updateClikedOnIcon.subscribe(is => {
      this.isFolderContext = is
      if(is) {
        this.linkItems = this.cws.getClickedOnIcon()
      } else {
        this.linkItems = this.cws.getItems()
      }
    }))
    
      setTimeout(() => {
        this.opacity = 1
      }, 100)

  }

  clickSubitem(e: any, id: number) {
      this.fs.setCoordinates(e.x, e.y)
      this.fs.selectSubitem(id, e.x, e.y, this.fs.folderSize)
      this.context.nativeElement.style.display = 'none'
  }

  clickMainItem(e: MouseEvent, id: number) {
    this.preventClosing(e)
    if(id === 1556) {
      this.fs.renameFolder(true, this.cws.clickedCurrentFolder, this.cws.clickedCurrentFolder.name)
      if(this.isFolderContext) {
        this.context.nativeElement.style.display = 'none'
      }
    } else if(id === 2564) {
      if(this.cws.clickedCurrentFolder.nestable) {
        this.fs.pushFolderToFolder(this.fs.pushedToFolderId, this.cws.clickedCurrentFolder)
        this.context.nativeElement.style.display = 'none'
      } 
    } else if(id === 8) {
      this.fs.clearRecycleBin()  
      this.context.nativeElement.style.display = 'none'
 
    }
   }

   ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe())    
   }
  preventClosing(e: MouseEvent) {
    e.stopImmediatePropagation()
    e.stopPropagation()
  }
}
