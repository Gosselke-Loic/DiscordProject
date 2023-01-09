import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { remove } from "lodash";
import {
    interval, 
    Subject, 
    catchError, 
    filter, 
    mergeMap, 
    take, 
    takeUntil, 
    tap 
} from "rxjs";

import { MainSocket } from "src/app/core/socket/main-socket";
import { AuthService, User } from "src/app/features/auth/service/auth.service";
import { MessageType } from "src/app/features/messages/components/messages.component";
import { Message } from "src/app/features/messages/service/messages.service";
import { Room, RoomService } from "../../service/room.service";

interface InternalRoom extends Room {
    members: User[];
}

@Component({
    templateUrl: './room-page.component.html',
    styleUrls: ['./room-page.component.scss']
})
export class RoomPageComponent implements OnDestroy, OnInit {
    roomId: string;
    room: InternalRoom;
    destroy$ = new Subject();
    MessageType = MessageType;
    areMembersShown = false;
    messages: Message[] = [];
    updateMessages$ = new Subject();
    user: User;
    showTotalMembers = true;

    constructor(
        private roomService: RoomService,
        private route: ActivatedRoute,
        private socket: MainSocket,
        private router: Router,
        private authService: AuthService,
        private changeDetector: ChangeDetectorRef,
    ) {}

    get onlineMembers() {
        return this.room.members.filter(user => user.online);
    }

    ngOnInit() {
        this.route.params
            .pipe(
                takeUntil(this.destroy$),
                mergeMap(params => {
                    this.roomId = params.id;

                    return this.roomService.joinRoom(this.roomId).pipe(take(1));
                }),
                catchError(() => this.router.navigate(['/rooms'])),
                filter<InternalRoom>(room => typeof room !== 'boolean'),
                mergeMap(room => {
                    this.room = room;
          
                    this.changeDetector.detectChanges();
          
                    return this.socket.onConnect();
                }),
                tap(() => {
                    this.roomService.subscribeRoom(this.room);

                    this.updateMessages$.next(true);
                }),
                takeUntil(this.destroy$),
            )
            .subscribe();

        interval(5000)
            .pipe(
                takeUntil(this.destroy$),
                filter(() => this.room != null),
                mergeMap(() => this.roomService.getRoom(this.roomId).pipe(take(1))),
                tap<InternalRoom>({
                    next: (room) => (this.room = room),
                    complete: () => this.router.navigate(['/rooms']),
                }),
            )
            .subscribe();
        
        this.roomService
            .onJoinEvent()
            .pipe(takeUntil(this.destroy$))
            .subscribe(user => {
                this.room.members.push(user);

                this.room = this.roomService.getRoomWithSortedMembers(
                    this.room,
                ) as InternalRoom;
            });
        
        this.roomService
            .onLeaveEvent()
            .pipe(takeUntil(this.destroy$))
            .subscribe(user => {
                if(user._id === this.user._id) {
                    this.router.navigate(['/rooms']);

                   return; 
                }

                remove(this.room.members, u => u === user || u._id === user._id)
            });

        this.roomService
            .onUpdateEvent()
            .pipe(takeUntil<InternalRoom>(this.destroy$))
            .subscribe(room => (this.room = room));

        this.roomService
            .onDeleteEvent()
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.router.navigate(['/rooms']));
      
        this.authService.user$
            .pipe(takeUntil(this.destroy$))
            .subscribe(user => (this.user = user));
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}