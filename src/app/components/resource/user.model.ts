import { ResourcesType } from "../../shared/models/enums";
import { PaginationFilter } from "../../shared/models/pagination.model";

export class User {
  id: string;
  fullName: string;
  lastName: string;
  email: string;
  password: string;
  isDisabled: boolean;
  isAdmin: boolean;
  roles: string;
  viewers: { viewerId: string; }[]
  inActiveDate: string = null;
  systemJoinDate: string;
  maxDateSearch: string | null = null;
  showHourlyCost: boolean;
  backLogDay: string | null;
  batchId: string;
  hasAttachment: boolean=false;
  imageURL?: string | null=null;
  hourlyRate?:string|null;

  

}



export class UserItems extends PaginationFilter {
  items: User[];
}

export class UsersFilter extends PaginationFilter {
  SearchValue: string;
  SortColumn: any;
}

export class ViewerMatrixRow {
  user: string;
  viewerAccess: { [viewerName: string]: boolean };
}
export class UserViewerAdd{
  
  userName : string ;
  viewerName : string ;
  isViewer : boolean ;

}