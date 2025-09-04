import { Component } from "@angular/core";
import { LeftSidebarComponent } from "./left-sidebar/left-sidebar.component";
import { MainBoardComponent } from "./main-board/main-board.component";
import { RightSidebarComponent } from "./right-sidebar/right-sidebar.component";
import { TimeThreadComponent } from "./time-thread/time-thread.component";


@Component({
    selector:'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [
        LeftSidebarComponent,
        MainBoardComponent,
        RightSidebarComponent,
        TimeThreadComponent
    ]
})

export class HomeComponent{}