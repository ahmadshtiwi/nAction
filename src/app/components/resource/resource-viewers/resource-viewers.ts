import { Component, OnInit } from '@angular/core';
import { UserViewerAdd, ViewerMatrixRow } from '../user.model';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-resource-viewers',
  imports: [],
  templateUrl: './resource-viewers.html',
  styleUrl: './resource-viewers.scss'
})
export class ResourceViewers implements OnInit {
  data: ViewerMatrixRow[] = []; // this comes from API
  viewerNames: string[] = [];   // populated from first row

  allViewers: string[] = [];
  allUsers: string[] = [];
  tableMatrix: { viewer: string, access: { [user: string]: boolean } }[] = [];

  constructor(private userService: UsersService, private spinner: SpinnerService) { }

  ngOnInit(): void {
    this.getData();
  }


  getData() {



    this.userService.getViewers().subscribe(res => {
      this.spinner.show();
      this.data = res;

      // جميع أسماء اليوزرز
      this.allUsers = this.data.map(u => u.user);

      // جميع أسماء الفيوورز من أول عنصر (كلهم مشتركين)
      this.allViewers = Object.keys(this.data[0].viewerAccess);

      // بناء جدول المصفوفة
      this.tableMatrix = this.allViewers.map(viewerName => {
        const row: { viewer: string, access: { [user: string]: boolean } } = {
          viewer: viewerName,
          access: {}
        };

        this.data.forEach(userObj => {
          row.access[userObj.user] = userObj.viewerAccess[viewerName] || false;
        });

        return row;
      });

      this.spinner.hide();
      console.log('Table Matrix', this.tableMatrix);
    });
  }

  // getData(){
  //   this.userService.getViewers().subscribe(res=>
  //   {
  //     debugger
  //     this.data=res;
  //  if (this.data.length > 0 && this.data[0].viewerAccess) {
  //     this.viewerNames = Object.keys(this.data[0].viewerAccess);
  //  }
  //   })
  // };
  submit(user, viewer, access) {

    this.spinner.show();
    var req = new UserViewerAdd();

    req.userName = user;
    req.viewerName = viewer;
    req.isViewer = access;

    this.userService.addOrRemove(req).subscribe(res => {

      if (res) {
        this.getData();
        // this.spinner.hide();
      }

    });
  }
}
