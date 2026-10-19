import { ProcessPhase } from "./ProcessPhase";
import { ProcessDetail } from "./ProcessDetail";
export interface QCPModal {
  qcp: [
    {
      qcpTitle: string;
      processPhases: ProcessPhase[];
      processPhasesLength: number;
      percentage: number;
      processPhaseSelectedIndex: number;
      processDetailsSelected: ProcessDetail[];
      qcpDetailsPopupShow: boolean;
      multiline: ITextFieldMultilineExampleState;
      qcpValidation: boolean;
      LPID: any;
      LPDID: any;
      PrevNext: PrevNext[];
    }
  ];
  qcpSelectedIndex: 0;
  processPhaseSelectedIndex: 0;
  processDetailsSelected: ProcessDetail[];
  qcpDetailsPopupShow: boolean;
  multiline: ITextFieldMultilineExampleState;
  modalState: IModalBasicExampleState;
  processTitle: string;
  sortOrder: string;
  processDetailsTitle: string;
  processDetailsDescription: string;
  parentSiteUrl: string;
  QCPName: string;
  selectedQCPName: string;
  isChecked: ICheckBoxChecked;
  addToTimeline: ICheckBoxChecked;
  sendNotification: ICheckBoxChecked;
  ShowMessage: boolean;
  WarningMessage: boolean;
  showQCPPanel: IShowQCPPanel;
  hideDialog: boolean;
  hidePhaseDialog: boolean;
  hideQCPDialog: boolean;
  processDetailID: string;
  filePickerResult: any;
  qcptrakingList: string;
  qcptrackingColumn: string;
  qcptrackingtype: string[];
  isCalloutVisible: boolean;
  Action: string;
  TriggerListName: string;
  TriggerFields: string;
  TriggerStatus: string;
  TriggerFieldType: string;
  TriggerExtender: string;
  ActionIcon: string;
  editTrigger: number;
  editDP: number;
  editNextPrev: number;
  editRelaventDocs: number;
  editCheckListL: number;
  loading: boolean;
  selectedItemQCP?: { key: string | number | undefined };
  selectedItemQCPList?: { key: string | number | undefined };
  isCalloutFormTrigger: boolean;
  TriggerFormUrl: string;
  TriggerFormListname: string;
  TriggerFormname: string;
  isCalloutVisibleDepandantField: boolean;
  DependantPhase: string;
  DependantPhaseDetails: string;
  PID: number;
  PDID: number;
  PhaseID: string;
  userExist: boolean;
  userExistInFiled: boolean;
  isEditChecked: boolean;
  QCPID: number;
  selectedQCPKey: number;
  ShowMessageEditQCP: boolean;
  PrevQCPType: string[];
  PrevQCPTitle: string;
  DBPhaseTitle: string;
  DBPhaseDescTitle: string;
  mainLoader: boolean;
  subLoader: boolean;
  qcpMultiselectionDrp: any[];
  richdescription: string;
  existingQCPID: number;
  existingQCPName: string;
  hideEditQCPChk: boolean;
  ShowMessageBlankTemplate: boolean;
  isCalloutRelaventLink: boolean;
  isCalloutChecklist: boolean;
  isSourceOrExternal: string;
  relDocLabel: string;
  relDOcLink: string;
  extrenalLink: string;
  chkDocLable: string;
  chkDocLink: string;
  extrenalchkLink: string;
  ConfirmationMessage: boolean;
  relDoc: any;
  chkDoc: any;
  isCalloutVisibleAddToTimeline: boolean;
  notify: any;
  isTimeLineChecked: boolean;
  isNotificationChecked: boolean;
  isNextPrev: boolean;
  prevNextHub: string;
  prevNextList: string;
  prevNxtSite: any;
  prevNextSite: string;
  prevNextSiteLabel: string;
  prevNext: string;
  version: string;
  minorVersion: number;
  panelOpen: ISendForApprovalPanel;
  approverMail: any;
  senderComments: string;
  dueDate?: string;
  dueDateValue: Date | null;
  approvalPage: boolean;
  approverComments: string;
  currentStatus: string;
  approverID: number;
  currentUserID: number;
  loader: boolean;
  selectedqcpid: any;
  revisionhistorypanelOpen: ISendForApprovalPanel;
  revisionhistorytimelinemodel: IRevisionHistoryTimeLineModel;
  verticalitem: ISingleItemModel[];
  disablerevisionhistorybtn: boolean;
  Opencancelpanel: ISendForApprovalPanel;
  approvervalue: any;
  senddatevalue: any;
  approvercommentvalue: any;
  approvermailvalue: any;
  sendermailvalue: any;
  mytaskid: any;
  cancelcurrentstatus: any;
  projecttypeid: any[];
  companytypeid: any[];
  contracttypeid: any[];
  leadtypeid: any[];
  personneltypeid: any[];
  selectedHub: string;
  prevqcpidforedit:any;
  producttypeid:any[];
  salestypeid:any[];
  offerstypeid:any[];
  teachertypeid:any[];
  shiptypeid:any[];
  mainqcp:boolean;
  showmainqcpvalidationmsg:boolean;
  projectId: string;
  currentUserEmail: string;
  importDialogOpen: boolean;
  replaceCandidates: Array<{ itemId: number; title: string; bindingListName: string; bindingColumnName: string; bindingColumnValue: string }>;

}

export interface ITextFieldMultilineExampleState {
  multiline: boolean;
}

export interface IModalBasicExampleState {
  showModal: boolean;
}
export interface ICheckBoxChecked {
  checked: boolean;
}
export interface IShowQCPPanel {
  showPanel: boolean;
}
export interface ISendForApprovalPanel {
  open: boolean;
}
export interface PrevNext {
  HubSites: string;
  ListName: string;
  SiteUrl: string;
  PrevNext: string;
  SiteUrlLabel: string;
}
export interface IRevisionHistoryTimeLineModel {

  QCPTitle: any;
  CreatedBy: any;
  Createddate: any;

}
export interface ISingleItemModel {

  detailTitle: string;
  approver: any;
  date: any;
  comments: string;
  status: any;
  versionNo: any;
  requestor: any;

}
