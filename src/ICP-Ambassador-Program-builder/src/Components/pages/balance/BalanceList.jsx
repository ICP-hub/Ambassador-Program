import React, { useState } from 'react';
import {
  Stack,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  Select,
  MenuItem,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CircularProgress from '@mui/material/CircularProgress';

const emptyAddNewBalanceForm = {
    rewardTokenId: 0,
    amount: '0',
    reason: '',
  };
  

const sampleTokens = [
  { id: '1', name: 'Token A', ticker: 'TKA' },
  { id: '2', name: 'Token B', ticker: 'TKB' },
  { id: '3', name: 'Token C', ticker: 'TKC' },
];

const sampleBalances = [
  { id: '1', token: 'Token A', amount: 100, reason: 'Initial deposit', date: '2024-10-01' },
  { id: '2', token: 'Token B', amount: 200, reason: 'Referral bonus', date: '2024-10-15' },
];

const BalanceList = () => {
  const [balances, setBalances] = useState(sampleBalances);
  const [tokens, setTokens] = useState(sampleTokens);
  const [isBalanceUpdating, setIsBalanceUpdating] = useState(false);
  const [addNewBalanceForm, setAddNewBalanceForm] = useState(emptyAddNewBalanceForm);
  const [isAddNewBalanceOpen, setIsAddNewBalanceOpen] = useState(false);
  const [editBalanceId, setEditBalanceId] = useState(null);
  const [editBalanceForm, setEditBalanceForm] = useState({
    amount: '',
    reason: '',
  });
  
  const handleClose = () => {
    setEditBalanceId(null);
    setAddNewBalanceForm({ tokenId: '', amount: '', reason: '' });
    setEditBalanceForm({ amount: '', reason: '' });
  };

  const handleAddingNewToken = () => {
    setIsBalanceUpdating(true);
    setTimeout(() => {
      const newBalance = {
        id: (balances.length + 1).toString(),
        token: tokens.find((token) => token.id === addNewBalanceForm.tokenId).name,
        amount: addNewBalanceForm.amount,
        reason: addNewBalanceForm.reason,
        date: new Date().toISOString().split('T')[0],
      };
      setBalances((prev) => [...prev, newBalance]);
      setIsBalanceUpdating(false);
      handleClose();
    }, 1000);
  };

  const handleEditingBalance = () => {
    setIsBalanceUpdating(true);
    setTimeout(() => {
      setBalances((prev) =>
        prev.map((balance) =>
          balance.id === editBalanceId
            ? { ...balance, amount: editBalanceForm.amount, reason: editBalanceForm.reason }
            : balance
        )
      );
      setIsBalanceUpdating(false);
      handleClose();
    }, 1000);
  };


  const onAddBalanceHandler = () => {
    setAddNewBalanceForm(emptyAddNewBalanceForm);
    setIsAddNewBalanceOpen(true);
  };


  return (
    <div>
        <div className='mx-5 lg:mx-40 my-5 text-4xl'>Balance</div>
    <Stack spacing={2} className='mx-10 lg:mx-44'>
      <Box>
        <IconButton
          onClick={() => onAddBalanceHandler()}
          sx={{ borderRadius: 2, justifyContent: 'flex-start' }}
        >
          <AttachMoneyIcon />
          <Typography ml={1}>Add new token</Typography>
        </IconButton>
      </Box>
      {balances.length === 0 ? <p>No tokens available in the space</p> : null}
      <Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label='List of balances' size='small'>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Token</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell align='right'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {balances.map((spaceBalance, idx) => {
                return (
                  <TableRow key={spaceBalance.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell scope='row'>{idx + 1}</TableCell>
                    <TableCell>{spaceBalance.token}</TableCell>
                    <TableCell>{spaceBalance.amount}</TableCell>
                    <TableCell align='right'>
                      <IconButton
                        onClick={() => {
                          setEditBalanceId(spaceBalance.id);
                          setEditBalanceForm({ amount: spaceBalance.amount, reason: spaceBalance.reason });
                        }}
                        sx={{ borderRadius: 2, justifyContent: 'flex-start' }}
                      >
                        <AttachMoneyIcon />
                        <Typography ml={1}>Change balance</Typography>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {isBalanceUpdating && (
        <Box position='absolute' top='50%' left='50%'>
          <CircularProgress />
        </Box>
      )}

      <Dialog open={addNewBalanceForm.tokenId !== ''} onClose={handleClose}>
        <DialogTitle>Add new token to the space</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add a new token to the space, please select the token and enter the amount.
          </DialogContentText>
          <Stack spacing={2} pt={2}>
            <Box>
              <Select
                label='Token'
                fullWidth
                variant='standard'
                value={addNewBalanceForm.tokenId}
                onChange={(e) => {
                  setAddNewBalanceForm((prev) => ({
                    ...prev,
                    tokenId: e.target.value,
                  }));
                }}
              >
                {tokens.map((token) => (
                  <MenuItem key={token.id} value={token.id}>
                    {token.ticker} [{token.name}]
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <TextField
              required
              label='Amount'
              type='number'
              fullWidth
              value={addNewBalanceForm.amount}
              onChange={(e) => {
                setAddNewBalanceForm((prev) => ({
                  ...prev,
                  amount: e.target.value,
                }));
              }}
            />
            <TextField
              required
              label='Reason'
              fullWidth
              value={addNewBalanceForm.reason}
              onChange={(e) => {
                setAddNewBalanceForm((prev) => ({
                  ...prev,
                  reason: e.target.value,
                }));
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton loading={isBalanceUpdating} onClick={handleAddingNewToken}>
            Add token
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Dialog open={editBalanceId !== null} onClose={handleClose}>
        <DialogTitle>Update balance for the token</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To update the balance for the selected token, please enter the amount and reason.
          </DialogContentText>
          <Stack spacing={2} pt={2}>
            <TextField
              required
              label='Amount'
              type='number'
              fullWidth
              value={editBalanceForm.amount}
              onChange={(e) => {
                setEditBalanceForm((prev) => ({
                  ...prev,
                  amount: e.target.value,
                }));
              }}
            />
            <TextField
              required
              label='Reason'
              fullWidth
              value={editBalanceForm.reason}
              onChange={(e) => {
                setEditBalanceForm((prev) => ({
                  ...prev,
                  reason: e.target.value,
                }));
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton loading={isBalanceUpdating} onClick={handleEditingBalance}>
            Update balance
          </LoadingButton>
        </DialogActions>
      </Dialog>
      {/* <Dialog open={isAddNewBalanceOpen} onClose={handleClose}>
            <DialogTitle>Add new token to the space</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To add a new token to the space, please select the token and enter the amount.
              </DialogContentText>
              <Stack spacing={2} pt={2}>
                <Box>
                  <Select
                    label='Token'
                    placeholder=''
                    disabled={availableRewards.length === 0}
                    size='medium'
                    fullWidth
                    variant='standard'
                    value={addNewBalanceForm.rewardTokenId}
                    onChange={(e) => {
                      setAddNewBalanceForm((prev) => ({
                        ...prev,
                        rewardTokenId: Number(e.target.value),
                      }));
                    }}
                  >
                    {availableRewards.map((token) => {
                      return (
                        <MenuItem key={String(token.id)} value={String(token.id)}>
                          {token.ticker} - {token.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </Box>
                <Box>
                  <TextField
                    label='Amount of tokens to add'
                    placeholder=''
                    fullWidth
                    variant='standard'
                    value={addNewBalanceForm.amount}
                    onChange={(e) => {
                      setAddNewBalanceForm((prev) => ({...prev, amount: e.target.value}));
                    }}
                    error={parseFloat(addNewBalanceForm.amount) < 0}
                    helperText={
                      parseFloat(addNewBalanceForm.amount) < 0
                        ? 'Amount should be positive number'
                        : undefined
                    }
                  />
                </Box>
                <Box>
                  <TextField
                    label='Reason to the change (will be visible for customer)'
                    placeholder=''
                    type='text'
                    fullWidth
                    variant='standard'
                    value={addNewBalanceForm.reason}
                    onChange={(ev) => {
                      setAddNewBalanceForm((prev) => ({...prev, reason: ev.target.value}));
                    }}
                  />
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions sx={{justifyContent: 'space-between'}}>
              <Button color='info' onClick={handleClose} disabled={isBalanceUpdating}>
                Cancel
              </Button>
              <LoadingButton
                color='primary'
                onClick={handleAddingNewToken}
                loading={isBalanceUpdating}
                disabled={!addNewBalanceForm.rewardTokenId}
              >
                Add new token
              </LoadingButton>
            </DialogActions>
          </Dialog> */}
    </Stack>
    </div>
  );
}

export default BalanceList;
