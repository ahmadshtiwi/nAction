import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AttachmentService } from './attachment.service';
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator
import { AttachmentType } from '../../models/enums';
import { Attatchment, AttatchmentDetails } from './attatchment';
import { ModalComponent } from '../modal/modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignalRService } from '../../services/signalR.service';

type GUID = string; // Define GUID type

@Component({
  selector: 'app-attachmnet',
  templateUrl: './attachmnet.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./attachmnet.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AttachmnetComponent),
      multi: true,
    },
  ],
})
export class AttachmnetComponent implements ControlValueAccessor, OnInit {

  @Input() hasAttachments: boolean;
  @Input() isImageOnly: boolean;
  @Input() allowMultiple: boolean = true;
  @Input() viewInputField: boolean = true;
  @Input() referenceId: number;
  @Input() label: string;
  @Input() attachmentType = AttachmentType.Assignment;
  @Output() batchId = new EventEmitter<GUID>()

  fileNames: string[] = [];

  guid: string;
  filesList: AttatchmentDetails[] = [];


  constructor(private attachmentService: AttachmentService, private modalService: NgbModal , private signleRservice:SignalRService) { }

  ngOnInit(): void {
    this.getAttachments()
  }

  getAttachments() {
    
    if (this.hasAttachments) {
      this.attachmentService.getAllAttachment(this.referenceId, this.attachmentType).subscribe(res => {
        if (res) {
          this.filesList = res
        }
      })
    }
  }
  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;

    if (fileList && fileList.length > 0) {
      console.log('Number of files:', fileList.length);

      this.fileNames = []; // Clear previous filenames before adding new ones
      const formData = new FormData();

      Array.from(fileList).forEach((file: File) => {
        if (file.size > 0) { // Ensure file is not empty
          console.log(file.name);
            this.fileNames.push(file.name);
          formData.append('file', file);
        } else {
          console.warn(`File "${file.name}" is empty and will not be uploaded.`);
          const modalRef = this.modalService.open(ModalComponent, {
            windowClass: 'custom-modal-center',
            modalDialogClass: 'custom-modal-content custom-modal-size'
          });
          modalRef.componentInstance.message = `File "${file.name}" is empty and will not be uploaded.`;
          modalRef.componentInstance.isDeleteAction = false;
        }
      });

      if (this.fileNames.length === 0) {
        return; // Stop execution if no valid files are selected
      }

      this.onChange(this.fileNames);
      this.onTouched();

      // Generate GUID only if it's not already set
      if (!this.guid) {
        this.guid = uuidv4(); // Store full UUID
      }

      let model: Attatchment = {
        batchId: this.guid.substring(0, 35), // Send full UUID in the request
        file: formData,
        type: this.attachmentType
      };

      if(!this.allowMultiple && this.filesList.length > 0){
        this.removeFile(this.filesList[0] , 0);
      }

      //this.signleRservice.UploadProgress();
      // Perform the request and emit batchId after successful response
      this.attachmentService.addAttachment(model).subscribe(res => {
        if (res) {
          this.batchId.emit(this.guid.substring(0, 35)); // Emit shortened UUID
          this.filesList.push(res);

        }
      });
    }
  }




  removeFile(attachmentDetails: AttatchmentDetails, index: number): void {
    if(this.allowMultiple){
      const modalRef = this.modalService.open(ModalComponent, {
        windowClass: 'custom-modal-center',
        modalDialogClass: 'custom-modal-content custom-modal-size'
      });
      modalRef.componentInstance.message = 'Are you sure you want to delete this record ? ';
      modalRef.componentInstance.isDeleteAction = true;
      modalRef.result.then((res: boolean) => {
        if (res) {
          this.attachmentService.deleteAttachment(attachmentDetails, this.attachmentType).subscribe(res => {
            if (res) {
              this.filesList.splice(index, 1);
              this.fileNames.splice(index, 1);
            }
          });
        }
      })
    }else{
      this.attachmentService.deleteAttachment(attachmentDetails, this.attachmentType).subscribe(res => {
        if (res) {
          this.filesList.splice(index, 1);
          this.fileNames.splice(index, 1);
        }
      });
    }
  }

  downloadFile(attachmentDetails: AttatchmentDetails): void {
    this.attachmentService.downloadAttachment(attachmentDetails.attachmentId, this.attachmentType).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob); // Create a temporary URL
      const a = document.createElement('a');
      a.href = url;
      a.download = attachmentDetails.fileName; // Set the filename
      document.body.appendChild(a);
      a.click(); // Simulate click to download
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url); // Clean up memory
    })
  }

  // ControlValueAccessor interface methods
  private onChange: any = () => { };
  private onTouched: any = () => { };

  writeValue(value: any): void {
    if (value) {
      this.fileNames = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Handle disable state if necessary
  }
}
