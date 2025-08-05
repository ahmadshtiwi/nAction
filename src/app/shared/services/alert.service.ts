import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private toasterService: ToastrService, private translate: TranslateService) {}

  error(message: string = 'ERROR.DEFAULT_MESSAGE', title: string = 'ERROR.DEFAULT_TITLE'): void {
    this.toasterService.error(
      this.translate.instant(message), 
      this.translate.instant(title)
    );
  }

  success(message: string = 'SUCCESS.DEFAULT_MESSAGE', title: string = 'SUCCESS.DEFAULT_TITLE'): void {
    this.toasterService.success(
      this.translate.instant(message), 
      this.translate.instant(title)
    );
  }

  warning(message: string = 'WARNING.DEFAULT_MESSAGE', title: string = 'WARNING.DEFAULT_TITLE'): void {
    this.toasterService.warning(
      this.translate.instant(message), 
      this.translate.instant(title)
    );
  }

  info(message: string = 'INFO.DEFAULT_MESSAGE', title: string = 'INFO.DEFAULT_TITLE'): void {
    this.toasterService.info(
      this.translate.instant(message), 
      this.translate.instant(title)
    );
  }
}
