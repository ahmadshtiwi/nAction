import { AttachmentType } from "../../models/enums";

export class Attatchment{
    file : FormData;
    batchId : string;
    type : AttachmentType;
}

export class AttatchmentDetails{
    attachmentId: string;
    fileName: string;
    fileExtension: string;
    fileSize: number;
    contentType: string;
    downloadUrl: string;
}