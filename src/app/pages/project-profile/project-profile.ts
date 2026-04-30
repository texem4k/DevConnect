import {ChangeDetectorRef, Component, inject, Input, OnInit} from '@angular/core';
import {Project} from '../../shared/services/Project';
import {CardsGrid} from '../../shared/components/cards-grid/cards-grid';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {DataLoader} from '../../shared/services/get-data-service';
import {TopicsGrid} from '../../shared/components/topics-grid/topics-grid';
import {User} from '../../shared/services/User';

@Component({
  selector: 'app-project-profile',
  imports: [
    CardsGrid,
    RouterLink,
    TopicsGrid
  ],
  templateUrl: './project-profile.html',
  styleUrl: './project-profile.css',
})
export class ProjectProfile implements OnInit {

  private route= inject(ActivatedRoute);
  private router= inject(Router);
  private loader = inject(DataLoader);
  private cd = inject(ChangeDetectorRef)

  id?: number;
  @Input() project?: Project;
  mantainers: User[] = []



  ngOnInit() {
    this.loader.loadData(
      {loadUsers: true, loadProjects: true},
      (data)=>{
        this.project = data.projectData!.find(p => p.title===this.route.snapshot.params['title']);
        this.id=data.userData!.find(u => u.Projects.find(p => p.Name===this.project?.title))?.Id;
        this.cd.detectChanges()
        this.mantainers=this.getMaintainers(data.userData!)
      });
  }

  getMaintainers(data: User[]): User[] {
    let result: User[] = []
    this.project?.maintainers.forEach(maintainer => {
      result.push(<User>data.find(u => u.Nickname === maintainer))
    })
    return result
  }



  goToUserProfile() {
    this.router.navigate(['/UserProfile', this.id]);
  }

}
