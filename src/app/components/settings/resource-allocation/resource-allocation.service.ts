import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AllocationTableResponse, ResourceAllocation } from "./resource-allocation.model";
import { HttpService } from "../../../shared/services/http.service";

@Injectable({
    providedIn:'root'
})
export class ResourceAllocationService{


    controller = 'ResourceAllocation'
    
      constructor(private httpService: HttpService) { }
      
     getResourceAllocation = ( userId:string) :Observable<ResourceAllocation[]>=>{
       return this.httpService.get<ResourceAllocation[]>(`${this.controller}`,{body:{userId}});
     }
      
     getResourceAllocationById = (id:number) :Observable<ResourceAllocation>=>{
      return this.httpService.get<ResourceAllocation>(`${this.controller}/${id}`);
    }
     addResourceAllocation=(ResourceAllocation:ResourceAllocation) :Observable<ResourceAllocation>=>{
      return this.httpService.post<ResourceAllocation>(`${this.controller}`,ResourceAllocation) ;
     }

     updateResourceAllocation=(ResourceAllocation:ResourceAllocation) :Observable<ResourceAllocation>=>{
      return this.httpService.put<ResourceAllocation>(`${this.controller}`,ResourceAllocation) ;
     }

     deleteResourceAllocation=(id:number) :Observable<ResourceAllocation>=>{
      return this.httpService.delete<ResourceAllocation>(`${this.controller}/${id}`) ;
     }

     getAllocatioTableByUser=(userId:string,date:string):Observable<AllocationTableResponse>=>{

      return this.httpService.get<AllocationTableResponse>(`${this.controller}/GetAllocatioTableByUser`,{body:{userId,date}})
     }
     GetAllocatioTableByProject=(projectId:number,date:string):Observable<AllocationTableResponse>=>{

      return this.httpService.get<AllocationTableResponse>(`${this.controller}/GetAllocatioTableByProject`,{body:{projectId,date}})
     }
    
}
