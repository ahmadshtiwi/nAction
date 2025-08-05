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
    showHourlyCost :boolean;
    backLogDay :string | null;
    
    
}

  export class UserItems extends PaginationFilter {
    items : User[];
  }

  export class UsersFilter extends PaginationFilter {
    SearchValue : string;
SortColumn: any;
  }