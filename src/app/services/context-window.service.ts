import { ContextListItemModel } from "../models/context-list-item.model";
import { Folder } from "../models/folder.model";
import { EventEmitter, Injectable } from '@angular/core'
import { FolderService } from "./folder-service";

@Injectable()
export class ContextWindowService {

  constructor(public fs: FolderService) {}
    linkItems: ContextListItemModel[] = [
        {
            id: 1,
            text: 'View',
            hasSubitems: true,
            icon: '../../assets/grid.svg',
            subItems: [
            {
                id: 2,
                text: 'Large icons',
                icon: ''
            },
            {
              id: 3,
              text: 'Medium icons',
              icon: ''
            },
            {
            id: 4,
            text: 'Small icons',
            icon: ''
            },
            ]
        },
        {
            id: 8,
            text: 'Clear recycle bin', 
            hasSubitems: false,
            icon: '../../assets/refresh.svg'
        },
        {
            id: 9,
            text: 'New', 
            hasSubitems: true,
            icon: '../../assets/plus.svg',
            subItems: [
                {
                    id: 10,
                    text: 'Folder',
                    icon: '../../assets/folder.png'
                },
                {
                  id: 11,
                  text: 'Text Document',
                  icon: '../../assets/text.png'
              }
                ]
        },
      ];
      iconItems: ContextListItemModel[] = [{
        id: 1556,
        text: "Rename",
        hasSubitems: false
      },
      {
        id: 2564,
        text: "Delete",
        hasSubitems: false
      }
    ];
    contextWindowVisible: boolean = false;
    clickedCurrentFolder: Folder;
    clickedOnIncon: boolean;
    commenceRenaming: boolean = false;

    updateClikedOnIcon = new EventEmitter<boolean>()
    updatecontextWindowVisible = new EventEmitter<boolean>()
    
    setContextWindowVisible(is: boolean) {
      this.contextWindowVisible = is
    }
    getClickedOnIcon() {
      this.updatecontextWindowVisible.emit(true)
        return this.iconItems.slice()
    }
    getItems() {
      this.updatecontextWindowVisible.emit(true)
      return this.linkItems.slice()
    }
    
    startRenaming() {
      this.setContextWindowVisible(false)
      this.updatecontextWindowVisible.emit(false)

    }

    setClickedOnIcon(is: boolean, folder: Folder | null) {
      this.clickedOnIncon = is
      if(folder) {
        this.clickedCurrentFolder = folder
      }
      this.updateClikedOnIcon.emit(this.clickedOnIncon)
    }
  }
