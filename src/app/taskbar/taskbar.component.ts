import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { PanelManagementService } from '../services/panel-management.service';
import { FolderService } from '../services/folder-service';
import { Folder } from '../models/folder.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-taskbar',
  templateUrl: './taskbar.component.html',
  styleUrls: ['./taskbar.component.css']
})
export class TaskbarComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('bar') bar: ElementRef;
  @ViewChild('img') img: ElementRef;
  folder: Folder | null;
  folderIsOpen: boolean = false;
  minimalized: boolean = false;
  subs: Subscription[] = []
  constructor( public pms: PanelManagementService, public fs: FolderService) {}
  
  ngOnInit(): void{
   
    this.subs.push(this.fs.folderIsOpenChanged.subscribe(is => {
      this.folderIsOpen = is
    }))

    this.subs.push(this.fs.minimalizedUpdated.subscribe(is => {
      this.minimalized = is
    }))

    this.folder = this.fs.openFolder
    this.subs.push(this.fs.openFolderUpdated.subscribe(f => this.folder = f))
  }
  ngAfterViewInit(): void {
    document.addEventListener('click',()=> {
      if(this.bar) {
        this.bar.nativeElement.classList.remove('active')
      }
    })
  }
  openSearchPanel(e: MouseEvent) {
    this.pms.setOpenPanel()
    e.stopImmediatePropagation()
    e.stopPropagation()
  }

  triggerIcon(e: MouseEvent) {
    e.stopPropagation()
    this.bar.nativeElement.classList.add('active')
    this.minimalized = !this.minimalized
    this.fs.setMinimalized(this.minimalized)
  }

  scaleDown() {
    this.img.nativeElement.classList.add('shrink')
  }
  scaleUp() {
    this.img.nativeElement.classList.remove('shrink')
  }

  ngOnDestroy(): void {
  this.subs.forEach(sub => sub.unsubscribe())    
  }
}
