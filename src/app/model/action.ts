type ActionType = 'add' | 'edit' | 'delete';
export interface Action<T> {
  item: T;
  action: ActionType;
}
