import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SelectionComponent } from './selection/selection.component';
import { TaskbarComponent } from './taskbar/taskbar.component';
import { ContextWindowComponent } from './context-window/context-window.component';
import { VisibleDirective } from './visible.directive';
import { ContextWindowService } from './services/context-window.service';
import { ShowSublistDirective } from './show-sublist.directive';
import { FolderComponent } from './folder/folder.component';
import { PanelManagementService } from './services/panel-management.service';
import { SearchModalComponent } from './search-modal/search-modal.component';
import { ShowSearchPanelDirective } from './show-search-panel.directive';
import { OpenFolderComponent } from './open-folder/open-folder.component';
import { FolderService } from './services/folder-service';
import { MouseMoveService } from './services/mouse-movement.service';

@NgModule({
  declarations: [
    AppComponent,
    SelectionComponent,
    TaskbarComponent,
    ContextWindowComponent,
    VisibleDirective,
    ShowSublistDirective,
    FolderComponent,
    SearchModalComponent,
    ShowSearchPanelDirective,
    OpenFolderComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [MouseMoveService, ContextWindowService, PanelManagementService, FolderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
