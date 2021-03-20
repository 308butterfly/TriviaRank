import { Component, OnInit, Input } from '@angular/core';
import { AccountService } from '../services/account.service';
import { User } from '../models/User';
import { OutboxService } from '../services/outbox.service';


@Component({
  selector: 'app-friendinvites',
  templateUrl: './friendinvites.component.html',
  styleUrls: ['./friendinvites.component.css']
})
export class FriendinvitesComponent implements OnInit {
  public inviters: User[] = [];
  @Input() private player?: User;

  constructor(
    private outboxService: OutboxService,
    private accountService: AccountService
    ) {
      this.player = accountService.user;
    }

  ngOnInit(): void {
    if (this.player)
    {
      this.outboxService.getPlayerFriendInvites(this.player.id)
        .subscribe(players => {this.inviters = players; });
    }
  }

  handleDeleteFriendInvite(friend: User): void {
    console.log('deleted friend invite');
    if (this.player && friend) {
      const index = this.inviters.findIndex(f => f === friend);
      this.inviters.splice(index, 1);
      this.accountService.createFriend(this.player.id, friend.id)
        .subscribe(() => {console.log('created friend'); });
    }
  }

  onFriendInviteClick(friend: User): void {
    if (this.player && friend) {
      this.outboxService.deleteFriendInvite(this.player.username, friend.username)
        .subscribe(() => {this.handleDeleteFriendInvite(friend); });
    }
  }

}
