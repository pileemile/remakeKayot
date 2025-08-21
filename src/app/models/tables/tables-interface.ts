export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'action';
}

export interface TableAction {
  label?: string;
  icon?: string;
  handler: (item: any) => void;
}
