import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Footer} from '../../shared/components/footer/footer';
import {MediaList} from '../../shared/components/media-list/media-list';
import {Header} from '../../shared/components/header/header';
import {Router} from '@angular/router';
import {User} from '../../shared/services/User';
import {Project} from '../../shared/services/Project';

@Component({
  selector: 'app-search-result',
  imports: [
    Footer,
    MediaList,
    Header
  ],
  templateUrl: './search-result.html',
  styleUrl: './search-result.css',
})
export class SearchResult implements OnInit {
  type: string = '';
  projects: Project[] = [];
  users: User[] = [];

  constructor(private router: Router,private cd: ChangeDetectorRef) {}

  ngOnInit() {
    setTimeout(() => {
      const state = history.state;
      this.type = state.type;
      if (this.type == 'users') {
        this.users = state.data;
      } else {
        this.projects = state.data;
      }
      this.cd.detectChanges();
    }, 0);
  }
}
