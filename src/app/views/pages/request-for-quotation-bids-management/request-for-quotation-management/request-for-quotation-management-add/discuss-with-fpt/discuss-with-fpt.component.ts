import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as mainConfig from '../../../../../../core/_config/main.config';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { QuotationChatRequestPayload } from '../../../../../../services/modules/quotation-chat/quotation-chat.request-payload';
import { QuotationChatService } from '../../../../../../services/modules/quotation-chat/quotation-chat.service';

@Component({
  selector: 'app-discuss-with-fpt',
  templateUrl: './discuss-with-fpt.component.html',
  styleUrls: ['./discuss-with-fpt.component.scss']
})
export class DiscussWithFptComponent implements OnInit {

  public discussWithFPT: any = {};
  public listQuotationChatShow: any = [];
  public isShowDialogReply = false;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public listQuotationChat: any = [];
  public currentQuotationId: string;
  public supplierId: string;

  constructor(
    public cdr: ChangeDetectorRef,
    public quotationChatService: QuotationChatService,
    public notification: NotificationService,
  ) { }

  ngOnInit() {
  }

  public iniDataQuotationChat(rowData?: any): void {
    if (rowData) {
      this.currentQuotationId = rowData.requestForQuotationId;
      this.supplierId = rowData.supplierId;
    }

    const requestQuotationChat = new QuotationChatRequestPayload();
    requestQuotationChat.requestForQuotationId = this.currentQuotationId;
    requestQuotationChat.supplierId = this.supplierId;
    this.quotationChatService.select(requestQuotationChat).subscribe(res => {
      if (res && res.length > 0) {
        this.listQuotationChat = res;
        this.convertListQuotationChatForShow();
        this.cdr.detectChanges();
      } else {
        this.listQuotationChat = [];
      }
    });
  }

  public onBtnSendCommentClick(): void {
    if (this.currentQuotationId && this.discussWithFPT) {
      const requestSave: any = {
        requestForQuotationId: this.currentQuotationId,
        content: this.discussWithFPT.contentDialog ? this.discussWithFPT.contentDialog : this.discussWithFPT.content,
        supplierId: this.supplierId,
        parentId: this.discussWithFPT.parentId ? this.discussWithFPT.parentId : null
      };
      this.quotationChatService.merge(requestSave).subscribe(res => {
        if (res) {
          this.notification.showSuccess();
          this.iniDataQuotationChat();
          this.discussWithFPT = {};
          this.isShowDialogReply = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  public convertListQuotationChatForShow() {
    const dataQuotationChat = this.listQuotationChat;
    this.listQuotationChatShow = [];
    if (dataQuotationChat && dataQuotationChat.length > 0) {
      const parentItems = dataQuotationChat.filter(x => !x.parentId);
      for (const parent of parentItems) {
        const node = {
          parent: { ...parent },
          children: [],
        };
        node.children = dataQuotationChat.filter(x => x.parentId === parent.id);
        this.listQuotationChatShow.push(node);
      }
    }
  }

  public viewCommentClick(item: any): void {
    item.isHideViewTextComment = true;
    item.children.forEach(element => {
      element.isShowchildren = true;
    });

  }

  public replyCommentClick(item: any): void {
    this.discussWithFPT = {};
    this.discussWithFPT.parentId = item.parent.id;
    this.isShowDialogReply = true;
    this.cdr.detectChanges();
  }

  // Cancel diallog
  public onBtnCancelReplyClick(): void {
    this.discussWithFPT = {};
    this.isShowDialogReply = false;
  }

}
