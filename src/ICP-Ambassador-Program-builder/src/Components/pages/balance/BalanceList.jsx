// import React, { useState } from 'react';
// import {
//   Stack,
//   Typography,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   DialogContentText,
//   TextField,
//   Select,
//   MenuItem,
//   Box,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from '@mui/material';
// import LoadingButton from '@mui/lab/LoadingButton';
// import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
// import CircularProgress from '@mui/material/CircularProgress';

// const emptyAddNewBalanceForm = {
//     rewardTokenId: 0,
//     amount: '0',
//     reason: '',
//   };
  

// const sampleTokens = [
//   { id: '1', name: 'Token A', ticker: 'TKA' },
//   { id: '2', name: 'Token B', ticker: 'TKB' },
//   { id: '3', name: 'Token C', ticker: 'TKC' },
// ];

// const sampleBalances = [
//   { id: '1', token: 'Token A', amount: 100, reason: 'Initial deposit', date: '2024-10-01' },
//   { id: '2', token: 'Token B', amount: 200, reason: 'Referral bonus', date: '2024-10-15' },
// ];

// const BalanceList = () => {
//   const [balances, setBalances] = useState(sampleBalances);
//   const [tokens, setTokens] = useState(sampleTokens);
//   const [isBalanceUpdating, setIsBalanceUpdating] = useState(false);
//   const [addNewBalanceForm, setAddNewBalanceForm] = useState(emptyAddNewBalanceForm);
//   const [isAddNewBalanceOpen, setIsAddNewBalanceOpen] = useState(false);
//   const [editBalanceId, setEditBalanceId] = useState(null);
//   const [editBalanceForm, setEditBalanceForm] = useState({
//     amount: '',
//     reason: '',
//   });
  
//   const handleClose = () => {
//     setEditBalanceId(null);
//     setAddNewBalanceForm({ tokenId: '', amount: '', reason: '' });
//     setEditBalanceForm({ amount: '', reason: '' });
//   };

//   const handleAddingNewToken = () => {
//     setIsBalanceUpdating(true);
//     setTimeout(() => {
//       const newBalance = {
//         id: (balances.length + 1).toString(),
//         token: tokens.find((token) => token.id === addNewBalanceForm.tokenId).name,
//         amount: addNewBalanceForm.amount,
//         reason: addNewBalanceForm.reason,
//         date: new Date().toISOString().split('T')[0],
//       };
//       setBalances((prev) => [...prev, newBalance]);
//       setIsBalanceUpdating(false);
//       handleClose();
//     }, 1000);
//   };

//   const handleEditingBalance = () => {
//     setIsBalanceUpdating(true);
//     setTimeout(() => {
//       setBalances((prev) =>
//         prev.map((balance) =>
//           balance.id === editBalanceId
//             ? { ...balance, amount: editBalanceForm.amount, reason: editBalanceForm.reason }
//             : balance
//         )
//       );
//       setIsBalanceUpdating(false);
//       handleClose();
//     }, 1000);
//   };


//   const onAddBalanceHandler = () => {
//     setAddNewBalanceForm(emptyAddNewBalanceForm);
//     setIsAddNewBalanceOpen(true);
//   };


//   return (
//     <div>
//         <div className='mx-5 lg:mx-40 my-5 text-4xl'>Balance</div>
//     <Stack spacing={2} className='mx-10 lg:mx-44'>
//       <Box>
//         <IconButton
//           onClick={() => onAddBalanceHandler()}
//           sx={{ borderRadius: 2, justifyContent: 'flex-start' }}
//         >
//           <AttachMoneyIcon />
//           <Typography ml={1}>Add new token</Typography>
//         </IconButton>
//       </Box>
//       {balances.length === 0 ? <p>No tokens available in the space</p> : null}
//       <Box>
//         <TableContainer component={Paper}>
//           <Table sx={{ minWidth: 650 }} aria-label='List of balances' size='small'>
//             <TableHead>
//               <TableRow>
//                 <TableCell>#</TableCell>
//                 <TableCell>Token</TableCell>
//                 <TableCell>Balance</TableCell>
//                 <TableCell align='right'>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {balances.map((spaceBalance, idx) => {
//                 return (
//                   <TableRow key={spaceBalance.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
//                     <TableCell scope='row'>{idx + 1}</TableCell>
//                     <TableCell>{spaceBalance.token}</TableCell>
//                     <TableCell>{spaceBalance.amount}</TableCell>
//                     <TableCell align='right'>
//                       <IconButton
//                         onClick={() => {
//                           setEditBalanceId(spaceBalance.id);
//                           setEditBalanceForm({ amount: spaceBalance.amount, reason: spaceBalance.reason });
//                         }}
//                         sx={{ borderRadius: 2, justifyContent: 'flex-start' }}
//                       >
//                         <AttachMoneyIcon />
//                         <Typography ml={1}>Change balance</Typography>
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 );
//               })}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//       {isBalanceUpdating && (
//         <Box position='absolute' top='50%' left='50%'>
//           <CircularProgress />
//         </Box>
//       )}

//       <Dialog open={addNewBalanceForm.tokenId !== ''} onClose={handleClose}>
//         <DialogTitle>Add new token to the space</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             To add a new token to the space, please select the token and enter the amount.
//           </DialogContentText>
//           <Stack spacing={2} pt={2}>
//             <Box>
//               <Select
//                 label='Token'
//                 fullWidth
//                 variant='standard'
//                 value={addNewBalanceForm.tokenId}
//                 onChange={(e) => {
//                   setAddNewBalanceForm((prev) => ({
//                     ...prev,
//                     tokenId: e.target.value,
//                   }));
//                 }}
//               >
//                 {tokens.map((token) => (
//                   <MenuItem key={token.id} value={token.id}>
//                     {token.ticker} [{token.name}]
//                   </MenuItem>
//                 ))}
//               </Select>
//             </Box>
//             <TextField
//               required
//               label='Amount'
//               type='number'
//               fullWidth
//               value={addNewBalanceForm.amount}
//               onChange={(e) => {
//                 setAddNewBalanceForm((prev) => ({
//                   ...prev,
//                   amount: e.target.value,
//                 }));
//               }}
//             />
//             <TextField
//               required
//               label='Reason'
//               fullWidth
//               value={addNewBalanceForm.reason}
//               onChange={(e) => {
//                 setAddNewBalanceForm((prev) => ({
//                   ...prev,
//                   reason: e.target.value,
//                 }));
//               }}
//             />
//           </Stack>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose}>Cancel</Button>
//           <LoadingButton loading={isBalanceUpdating} onClick={handleAddingNewToken}>
//             Add token
//           </LoadingButton>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={editBalanceId !== null} onClose={handleClose}>
//         <DialogTitle>Update balance for the token</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             To update the balance for the selected token, please enter the amount and reason.
//           </DialogContentText>
//           <Stack spacing={2} pt={2}>
//             <TextField
//               required
//               label='Amount'
//               type='number'
//               fullWidth
//               value={editBalanceForm.amount}
//               onChange={(e) => {
//                 setEditBalanceForm((prev) => ({
//                   ...prev,
//                   amount: e.target.value,
//                 }));
//               }}
//             />
//             <TextField
//               required
//               label='Reason'
//               fullWidth
//               value={editBalanceForm.reason}
//               onChange={(e) => {
//                 setEditBalanceForm((prev) => ({
//                   ...prev,
//                   reason: e.target.value,
//                 }));
//               }}
//             />
//           </Stack>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose}>Cancel</Button>
//           <LoadingButton loading={isBalanceUpdating} onClick={handleEditingBalance}>
//             Update balance
//           </LoadingButton>
//         </DialogActions>
//       </Dialog>
      
//     </Stack>
//     </div>
//   );
// }

// export default BalanceList;

import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';
import { formatTokenMetaData, stringToSubaccountBytes } from '../../../utils/utils';
import { Principal } from '@dfinity/principal';
import { canisterId as ledgerId } from '../../../../../declarations/ledger';
import toast from 'react-hot-toast';
import { space } from 'postcss/lib/list';
const BalanceList = () => {
  const [amount,setAmount]=useState(0)
  const [balance,setBalance]=useState(0)
  const spaces=useSelector(state=>state.spaces.value)
  const actor=useSelector(state=>state.actor.value)
  console.log("showing ==>",spaces,actor)
  const [lockedAm,setLockedAm]=useState(0)
  const [loading,setLoading]=useState(false)

  async function getBalance(){
    try {
      let balance=await actor?.ledgerActor?.icrc1_balance_of({ 
        owner: Principal.fromText(process.env.CANISTER_ID_ICP_AMBASSADOR_PROGRAM_BACKEND) , 
        // subaccount: [stringToSubaccountBytes(spaces?.space_id)] 
        subaccount:[]
      })
      let metadataRes=await actor?.ledgerActor?.icrc1_metadata()
      let metadata=formatTokenMetaData(metadataRes)
      // console.log("space balance",spaces?.space_id,parseInt(balance),parseInt(metadata?.["icrc1:decimals"]))
      // console.log(stringToSubaccountBytes("uxi6s-eedvz-mgg63-2bcuy-fp5dh-2vswl-4xji2-he7zu-vszhg-wq5so-xae_0"))
      // console.log(stringToSubaccountBytes("uxi6s-eedvz-mgg63-2bcuy-fp5dh-2vswl-4xji2-he7zu-vszhg-wq5so-xae_1"))
      setBalance(parseFloat(balance)/Math.pow(10, parseInt(metadata?.["icrc1:decimals"])))
    } catch (error) {
      console.log(error)
    }
  }

  // async function getFundDetails(){
  //   try{
  //     let fundRes=await actor?.backendActor?.get_fund_details(spaces?.space_id)
  //     console.log("fund fetch res: ",fundRes)
  //     if(fundRes?.length>0){
  //       let newBalance=parseFloat(parseInt(fundRes[0]?.balance)/Math.pow(10,8))
  //       let locked=parseFloat(parseInt(fundRes[0]?.locked)/Math.pow(10,8))
  //       console.log("funds are avalaible : ",newBalance,locked)
  //       setBalance(newBalance)
  //       setLockedAm(locked)
  //       return
  //     }
  //   }catch(err){
  //     console.log("fetching funds err : ",err)
  //   }
  // }
  async function getFundDetails() {
    try {
      console.log("Spaces object:", spaces);
      console.log("Space ID:", spaces?.space_id);
  
      if (!spaces?.space_id) {
        console.error("Space ID is invalid or undefined.");
        return;
      }
  
      let fundRes = await actor?.backendActor?.get_fund_details(spaces?.space_id);
      console.log("Fund fetch response:", fundRes);
  
      if (fundRes?.length > 0) {
        const balanceRaw = fundRes[0]?.balance;
        const lockedRaw = fundRes[0]?.locked;
  
        if (balanceRaw == null || lockedRaw == null) {
          console.error("Invalid response data:", fundRes[0]);
          return;
        }
  
        let newBalance = parseFloat(parseInt(balanceRaw) / Math.pow(10, 8));
        let locked = parseFloat(parseInt(lockedRaw) / Math.pow(10, 8));
        console.log("Funds available:", newBalance, locked);
  
        setBalance(newBalance);
        setLockedAm(locked);
      } else {
        console.log("No funds available.");
      }
    } catch (err) {
      console.error("Fetching funds error:", err);
    }
  }
  

  async function depositAmount(){
    try{
      setLoading(true)
      let metadataRes=await actor?.ledgerActor?.icrc1_metadata()
      let metadata=formatTokenMetaData(metadataRes)
      let amnt=parseInt(Number(amount) * Math.pow(10, parseInt(metadata?.["icrc1:decimals"])))
      let transaction = {
        spender : { 
          owner: Principal.fromText(process.env.CANISTER_ID_ICP_AMBASSADOR_PROGRAM_BACKEND) ,
          subaccount: [] 
        },
        fee : [metadata?.["icrc1:fee"]],
        memo : [],
        from_subaccount : [],
        created_at_time : [],
        amount : amnt+metadata?.["icrc1:fee"],
        expected_allowance:[]
      };
      let approveRes=await actor?.ledgerActor?.icrc2_approve(transaction)
      console.log(approveRes)
      //call backend function to add funds here
      // let transferRes=await actor?.backendAction
      setAmount(0)
      setLoading(false)
      toast.success("transferred funds to the hub")
      getBalance()
    }catch(err){ 
      toast.error("Some error occurred")
      setLoading(false)
      console.log(err)
    }
  }

  async function addFunds() {
    try {
      setLoading(true)
      let finalAmount=Math.pow(10,8)*amount
      console.log(amount)
      // if(finalAmount>balance){
      //   toast.error("Ca")
      //   return
      // }
      let res=await actor?.backendActor?.add_funds(spaces?.space_id,finalAmount)
      console.log("add fund res : ",res,finalAmount)
      if(res?.Ok){
        toast.success("amount added")
        getFundDetails()
      }else{
        toast.error(""+res?.Err)
      }
      setLoading(false)
    } catch (err) {
      setLoading(false)
      console.log("error adding funds : ",err)
    }
  }

  useEffect(()=>{
    // getBalance()
    getFundDetails()
    console.log("balances useeffect : ",spaces,balance,actor?.ledgerActor)
  },[])
  if(loading){
    return(
      <div className='flex justify-center items-center h-screen'>
        <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-4 border-t-black" />
      </div>
    )
  }

  return (
    <div>
      <div className='flex flex-col   mx-20 my-10'>
        <div className=' flex flex-col'>
            <div className='font-semibold text-3xl mb-3'>
              Manage Hub Funds
            </div>
            <div className=' w-full border border-gray-300'></div>
        </div>
        <div className=' w-1/3'>
          
          <div className=' flex flex-col my-6'>
            <div className='font-semibold text-lg mb-3'>
              ICP hub India Crewsphere
            </div>

            <div className='font-semibold text-lg mb-3'>
              Hub Balance : {balance} ICP
            </div>
            <div className='font-semibold text-lg mb-3'>
              Locked amount : {lockedAm} ICP
            </div>
            
          </div>

          <div className=' flex items-center gap-4 my-3'>
            <div className='font-semibold text-md'>
              Deposit Amount (in ICP) : 
            </div>
            <div className='w-1/2 -mt-5'>
              <TextField value={amount} id="standard-basic" label="Amount" variant="standard" onChange={(e)=>parseFloat(setAmount(e.target.value))} />
            </div> 
          </div>

          <div className='flex justify-between items-center mt-8'>
            <button className='text-white bg-black flex justify-center items-center py-2 font-semibold  rounded px-6 cursor-pointer' onClick={addFunds}>Deposit</button>
            {/* <button className='text-white bg-black flex justify-center items-center py-2 font-semibold  rounded px-6 cursor-pointer'>Withdraw All</button> */}
          </div>
        </div>
        
        
      </div>
    </div>
  )
}

export default BalanceList
