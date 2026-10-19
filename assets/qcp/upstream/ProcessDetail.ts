export interface ProcessDetail {
  ID: number;
  title: string;
  description: string;
  status: string;
  comments: string;
  checklistDocuments: checklistDocDetails[];
  relevantDocuments: relevantDocDetails[];
  modifiedBy: string;
  percentage: number;
  sortOrderDetails: number;
  triggers: Triggers[];
  triggerForm: TriggerForm[];
  dependantFields: DependantField[];
  addToTimeline: addToTimeline[];
  statusInformations: statusInformation;
  na: boolean;
  commentMandatory: boolean;
  relevantDocs_forms_links: RelevantDocs_Forms_Links[];
}

export interface TriggerForm {
  SiteUrl: string;
  Listname: string;
  FormUrl: string;
}
export interface Triggers {
  Action: string;
  ListName: string;
  Field: string;
  Status: string;
  FieldType: string;
  ActionIcon: string;
  Extender: number;
}
export interface relevantDocDetails {
  Label: string;
  Link: string;
}

export interface checklistDocDetails {
  Label: string;
  Link: string;
  Folder: string;
}
export interface DependantField {
  PhaseID: string;
  PhaseDetailID: string;
  PhaseTitle: string;
  PhaseDetailTitle: string;
  Status: string;
}
export interface statusInformation {
  started: string;
  startedBy: string;
  completed: string;
  completedBy: string;
  deviation: string;
  deviationBy: string;
  naUpdated: string;
  naUpdatedBy: string;
  dependencies: DependantField[];
}

export interface RelevantDocs_Forms_Links {
  Label: string;
  Link: string;
  Type: string;
  SiteUrl: string;
  Listname: string;
  FormUrl: string;
}
export interface addToTimeline {
  addToTimeline: boolean;
  sendNotification: boolean;
  notify: string;
}