import { Injectable } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Attatchment, AttatchmentDetails } from './attachment.model';
import { AttachmentType } from '../../models/enums';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {
  //controller: string = 'attachments';
  controller: string = 'NewAttachments';

  constructor(private httpService : HttpService) { }

  addAttachment = (attachment : Attatchment) => {
    return this.httpService.post<AttatchmentDetails>(`${this.controller}/upload?BatchId=${attachment.batchId}8&Type=${attachment.type}` ,  attachment.file);
  }

  deleteAttachment = (attachment : AttatchmentDetails , type : AttachmentType) => {
    return this.httpService.delete<boolean>(`${this.controller}/delete/${attachment.attachmentId}/${type}`);
  }

  getAllAttachment = (referenceId : number |string , type : AttachmentType) => {
    return this.httpService.get<AttatchmentDetails[]>(`${this.controller}/get-attachments` , {body : { ReferenceId :referenceId , Type :type }});
  }
 
  downloadAttachment(attachmentId: string, type: AttachmentType) {
    return this.httpService.get(`${this.controller}/download/${attachmentId}/${type}`, {
      responseType: 'blob' as 'json' // Tell Angular this is a binary response
    });
  }
  
}