import { FC, ChangeEvent, useState } from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Select,
  MenuItem,
  Typography,
  CardHeader
} from '@mui/material';

import {Transaction, TransactionCategory } from 'src/models/transaction';

interface TransactionsTableProps {
  className?: string;
  transactions: Transaction[];
}

interface Filters {
  category?: TransactionCategory;
}

const applyFilters = (
  transactions: Transaction[],
  filters: Filters
): Transaction[] => {
  return transactions.filter((transaction) => {
    let matches = true;

    if (filters.category && transaction.category !== filters.category) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (
  transactions: Transaction[],
  page: number,
  limit: number
): Transaction[] => {
  return transactions.slice(page * limit, page * limit + limit);
};

const TransactionsTable: FC<TransactionsTableProps> = ({ transactions }) => {

  const [selectedTransactions, setSelectedTransactions] = useState<string[]>(
    []
  );

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    category: null
  });

  const transactionOptions = [
    {
        id: 'all',
        name: 'All'
    },
    {
      id: 'expense',
      name: 'Expense'
    },
    {
      id: 'food',
      name: 'Food'
    },
    {
      id: 'uncategorized',
      name: 'Uncategorized'
    }
  ];

  const [transaction, setTransaction] = useState<Transaction>();

  function returnCategory(value){
    
    let category: TransactionCategory;
    category = (value === 'expense' ? 'expense' : 'uncategorized');

    return category;
 }  


  const handleCateogryChange = (e: ChangeEvent<HTMLInputElement>): void => {

    let value = null;

    if (e.target.value !== 'all') {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      category: value
    }));
  };

  const handleCateogryAttributeChange = (e: ChangeEvent<HTMLInputElement>): void => {

    let value = e.target.value;
    alert(value);
  };


  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredTransactions = applyFilters(transactions, filters);
  const paginatedTransactions = applyPagination(
    filteredTransactions,
    page,
    limit
  );

  return (
    <Card>
        <CardHeader
          action={
            <Box width={150}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category || 'all'}
                  onChange={handleCateogryChange}
                  label="Category"
                  autoWidth
                >
                  {transactionOptions.map((transactionOption) => (
                    <MenuItem key={transactionOption.id} value={transactionOption.id}>
                      {transactionOption.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          }
        />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Transaction ID</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Category</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTransactions.map((transaction) => {
              const isTransactionSelected = selectedTransactions.includes(
                transaction.id
              );
              return (
                <TableRow
                  hover
                  key={transaction.id}
                  selected={isTransactionSelected}
                >
                  <TableCell padding="checkbox">
                    {/* <Checkbox
                      color="primary"
                      checked={isCryptoOrderSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneCryptoOrder(event, cryptoOrder.id)
                      }
                      value={isCryptoOrderSelected}
                    /> */}
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {transaction.details}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {format(transaction.transactionDate, 'MMMM dd yyyy')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {transaction.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {transaction.sourceName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {transaction.sourceDesc}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {transaction.currency} {transaction.amount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <FormControl fullWidth variant="outlined">
                    <Select
                      value={transaction.category || 'all'}

                      onChange={(e) => {setTransaction({ ...transaction, category: 'expense'})}}
                      fullWidth
                    >
                      {transactionOptions.filter(transactionOption => transactionOption.id !== 'all').map((transactionOption) => (
                      <MenuItem key={transactionOption.id} value={transactionOption.id}>
                        {transactionOption.name}
                      </MenuItem>
                    ))}
                    </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={filteredTransactions.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  );
};

TransactionsTable.propTypes = {
  transactions: PropTypes.array.isRequired
};

TransactionsTable.defaultProps = {
  transactions: []
};

export default TransactionsTable;