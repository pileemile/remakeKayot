export interface TableColumn {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'action' | 'badge';
  sortable?: boolean;
}

export interface TableAction {
  label?: string;
  icon?: string;
  handler: (item: any) => void;
  color?: 'primary' | 'secondary' | 'danger' | 'success';
}
