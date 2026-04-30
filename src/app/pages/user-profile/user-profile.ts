import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {DataLoader} from '../../shared/services/get-data-service';
import {User} from '../../shared/services/User';
import {BannerProfile} from '../../shared/components/banner-profile/banner-profile';
import {UserSkills} from '../../shared/components/user-skills/user-skills';
import {UserDataField} from '../../shared/components/user-data-field/user-data-field';
import {CardsGrid} from '../../shared/components/cards-grid/cards-grid';
import {Projects} from '@angular/cli/lib/config/workspace-schema';
import {Project} from '../../shared/services/Project';

@Component({
  selector: 'app-user-profile',
  imports: [
    BannerProfile,
    UserSkills,
    UserDataField,
    CardsGrid
  ],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit {

  constructor(private cd: ChangeDetectorRef) {}

  private loader: DataLoader = inject(DataLoader)
  userInformation: User | undefined;
  userProjects: Project[] | undefined;

  ngOnInit() {
    const state = history.state;
    this.loader.loadData({loadUsers: true, loadProjects: true},
      (data) =>{
        this.userInformation = data.userData?.find(u => u.Id===state.id) ?? undefined;
        this.userProjects = data.projectData?.filter(p => p.creator===this.userInformation?.Nickname) ?? undefined;
        this.cd.detectChanges();
      });
  }
}
