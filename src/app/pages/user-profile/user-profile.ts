import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {DataLoader} from '../../shared/services/get-data-service';
import {User} from '../../shared/services/User';
import {BannerProfile} from '../../shared/components/banner-profile/banner-profile';
import {UserSkills} from '../../shared/components/user-skills/user-skills';
import {UserDataField} from '../../shared/components/user-data-field/user-data-field';
import {CardsGrid} from '../../shared/components/cards-grid/cards-grid';
import {Projects} from '@angular/cli/lib/config/workspace-schema';
import {Project} from '../../shared/services/Project';
import {ActivatedRoute, Router} from '@angular/router';

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
  private router: ActivatedRoute= inject(ActivatedRoute);
  userInformation: User | undefined;
  userProjects: Project[] | undefined;
  id!: string;

  ngOnInit() {
    this.id = this.router.snapshot.params['id']
    this.loader.loadData({loadUsers: true, loadProjects: true},
      (data) =>{
        this.userInformation = data.userData?.find(u => u.Id===Number(this.id)) ?? undefined;
        this.userProjects = data.projectData?.filter(p => p.creator===this.userInformation?.Nickname) ?? undefined;
        this.cd.detectChanges();
      });
  }
}
