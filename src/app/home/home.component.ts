import { Component } from "@angular/core";

import { LeftSidebarComponent } from "./left-sidebar/left-sidebar.component";
import { MainBoardComponent } from "./main-board/main-board.component";
import { RightSidebarComponent } from "./right-sidebar/right-sidebar.component";
import { TimeThreadComponent } from "./time-thread/time-thread.component";

// import { CharacterCardComponent } from "./character-card/character-card.component";
// import { WorldCardComponent } from "./world-card/world-card.component";
// import { EventNodeComponent } from "./event-node/event-node.component";

@Component({
    selector:'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [
        LeftSidebarComponent,
        MainBoardComponent,
        RightSidebarComponent,
        TimeThreadComponent,
        // CharacterCardComponent,
        // WorldCardComponent,
        // EventNodeComponent
    ]
})



export class HomeComponent{
    characters = [

    {name:'Alice', alias: "The Ice Queen", role:"Protagonist", avatarUrl:'assets/alice.png'},
    {name:'Bob', alias: "The middle manager", role:"Antagonist", avatarUrl:'assets/bob.png'}
    
]

worlds = [
    {name: 'Avalon', description: 'Mystical land of magic and heroes.'},
    {name: 'Front-desk service section', description: 'the worst place possible on the whole universe.'}
]

events = [
    {title: 'Battle of Avalon', description: 'A decisive battle.', imageUrl: 'assets/battle.png'},
    {title: 'PTO rejected', description: 'All hope is lost after Bob rejects Alice-s demmands.'}
]
}