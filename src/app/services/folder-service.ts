import { EventEmitter } from '@angular/core';
import { Folder } from '../models/folder.model';

enum FOLDER_TYPE {
    FOLDER,
    COMPUTER,
    RECYCLE,
    TEXT,
    
}

export class FolderService {
    manualText = `For the best experience, please, press F11 to maximize your the browser window.<br>
        This app is not responsive, simple because windows desktop is not meant to be a web app.
        <br>
        What can you do with this app: 
        <ol>
        <li>Create folder at the specific x/y coordinations</li>
        <li>Creating Folders of Text Documents</li>
        <li>Rename folders / text documents</li>
        <li>Resize icons (small, medium, large)</li>
        <li>Move icons within the desktop</li>
        <li>Open folders and move them around, maximize them or minimize (icon will appear in taskbar at the bottom)</li>
        <li>Folders can be nested to another folders, except recycle bin</li>
        <li>You can write a document in text documents</li>
        <li>Delete a folder which will appear in the recycle bin</li>
        <li>Clear recycle bin</li>
        <li>Make selection (however, this is only for aesthetic purpose)</li>
        </ol>
                            
    `
    folders: Folder[] = [
    {id:999, type: FOLDER_TYPE.COMPUTER, name: "This PC",image: '../../assets/monitor.png', x: 40, y: 40, size: "50", nestable: true, folders: [], text: ''},
    {id:997, type: FOLDER_TYPE.RECYCLE, name: "Recycle Bin",image: '../../assets/recycle-bin.png', x: 40, y: 130, size: "50", nestable: false, folders: [], text: ''},
    {id:998, type: FOLDER_TYPE.FOLDER, name: "New Folder",image: '../../assets/folder.png', x: 40, y: 220, size: "50", nestable: true, folders: [], text: ''},
    {id:996, type: FOLDER_TYPE.TEXT, name: "Manual",image: '../../assets/text.png', x: 40, y: 310, size: "50", nestable: true, text: this.manualText}]
    openFolder: Folder | null;
    folderIsOpen: boolean = false
    minimalized: boolean = false
    renaming: boolean = false;
    overFolder: boolean;
    coordinates: {x: number, y: number}
    folderSize: string = "M";
    pushedToFolderId: number;

    getFolders() {
        return this.folders.slice()
      }
    updatedPushedToFolderId = new EventEmitter<number>()
    minimalizedUpdated = new EventEmitter<boolean>()
    folderIsOpenChanged = new EventEmitter<boolean>()
    foldersUpdated = new EventEmitter<Folder[]>()
    openFolderUpdated = new EventEmitter<Folder>()
    updatingRenaming = new EventEmitter()
    updatingJustRenaming = new EventEmitter<boolean>()
    updateOverFolder = new EventEmitter<boolean>()
    updatedCoodrinates = new EventEmitter<{x:number; y:number}>()
    updateFolderSize = new EventEmitter<string>()
    
    selectSubitem(id: number, x:number, y: number, size: string) {
       switch(id) {
        case 10: this.onCreateFolder(x, y, size, 0);
        break;
        case 11: this.onCreateFolder(x, y, size, 3);
        break;
        case 2: this.onEnlargeIcons();
        break
        case 4: this.onSmallIcon();
        break
        case 3: this.onMediumIcon();
        break
       }


    }


    onCreateFolder(x: number, y: number, size: string, type: number) {
        const newFolder = {
            id: Math.random() * 10000000000000000,
            type: type,
            name: type === 0 ?'New Folder' : "New Text Document",
            image: type === 0 ? '../../assets/folder.png' : '../../assets/text.png',
            x: x,
            y: y,
            size: size === "M" ? size = "50" : size === "L" ? size = "70" : size = "30",
            nestable: true,
            folders: [],
            text: ""
        }
        this.folders.push(newFolder)
        this.foldersUpdated.emit(this.folders)
    }

    onEnlargeIcons() {
        this.folderSize = "L";
        this.updateFolderSize.emit(this.folderSize)
    }
    onSmallIcon() {
        this.folderSize = "S";
        this.updateFolderSize.emit(this.folderSize)
    }

    onMediumIcon() {
        this.folderSize = "M";
        this.updateFolderSize.emit(this.folderSize)
    }

    setMinimalized(to: boolean) {
        this.minimalized = to
        this.minimalizedUpdated.emit(this.minimalized)
    }
    setOpenFolder(id: number) {
       const folder = this.folders.find((f: Folder) => f.id === id)
       if(folder) {
           this.openFolder = folder
           this.folderIsOpen = true
           this.openFolderUpdated.emit(this.openFolder)
       }
    }

    setRenaming(is: boolean) {
        this.renaming = is
        this.updatingJustRenaming.emit(is)
    }
    openFolderFn() {
        this.folderIsOpen = true
        this.folderIsOpenChanged.emit(true)
    }
    
    closeFolder() {
        this.folderIsOpen = false
        this.folderIsOpenChanged.emit(false)
    }

    renameFolder(is: boolean, folder: Folder, newName: string) {
        this.renaming = is
        this.updatingRenaming.emit({ is: is,id: folder.id })
        const f = this.folders.find(f => f.id === folder.id)
        if(f) {
            f.name = newName
        }
    }
    setOverFolder(is: boolean) {
        this.overFolder = is
        this.updateOverFolder.emit(is)
    }

    setCoordinates(x: number, y: number) {
        this.coordinates = {x: x, y: y}
        this.updatedCoodrinates.emit(this.coordinates)
    }

    getFolder(id: number) {
        return this.folders.find(f => f.id === id)
    }

    pushFolderToFolder(id: number, f1: Folder) {
        if(!id) {
            this.folders[1].folders?.push(f1)
            this.removeFolderFromDesktop(f1.id)
            return
        }
        const folderToBePushedTo = this.folders.find(f => f.id === id)
        if(folderToBePushedTo) {
            this.updatedPushedToFolderId.emit(folderToBePushedTo.id)
            if(folderToBePushedTo.folders) {
                folderToBePushedTo.folders.push(f1)
                this.removeFolderFromDesktop(f1.id)
            }
            this.foldersUpdated.emit(this.folders)
        }
    }

    removeFolderFromDesktop(id: number) {
        this.folders = this.folders.filter(f => f.id !== id)
        this.foldersUpdated.emit(this.folders)
    }

    typeToTextFile(id: number, text: string) {
        const file = this.folders.find(f => f.id === id)
        if(file && file.text.length >= 0) {
            file.text = text
            this.foldersUpdated.emit(this.folders)
        }
    }

    clearRecycleBin() {
        this.folders[1].folders = [];
        this.foldersUpdated.emit(this.folders)
    }
}
