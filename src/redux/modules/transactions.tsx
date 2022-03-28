export function typedAction<T extends string>(type: T): { type: T };
export function typedAction<T extends string, P extends any>(
  type: T,
  payload: P
): { type: T; payload: P };
export function typedAction(type: string, payload?: any) {
  return { type, payload };
}

type Transaction = {
  transactionID: string;
  accountID: string;
  amount: number;
  categories: string;
  date: Date;
  details: string;
  name: string;
  currency: string;
}

type TransactionState =  {
    transactions : Transaction[] | null;
    loading : boolean;
}

const initialState: TransactionState = { transactions: [], loading: true };

export const saveTransactions = (transactions: Transaction[]) => {
    return typedAction('saveTransactions',transactions);
};

export const setTransactionLoading = (loading: boolean) => {
  return typedAction('setTransactionLoading',loading);
};

type TransactionAction = ReturnType<typeof saveTransactions | typeof setTransactionLoading>;

export function transactionReducer(
  state = initialState,
  action: TransactionAction
): TransactionState {
  switch (action.type) {
    case 'saveTransactions':
      return { transactions: action.payload, loading:state.loading };
    case 'setTransactionLoading':
      return { transactions: state.transactions, loading:action.payload};
    default:
      return state;
  }
}