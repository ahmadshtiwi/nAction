import { PaginationFilter } from "../../../shared/models/pagination.model";

export class Role {
    id: string;
    name: string;
    isDeleted: boolean;
    permissions : string[] = [];
}

export class RoleItems extends PaginationFilter {
    items: Role[];
}