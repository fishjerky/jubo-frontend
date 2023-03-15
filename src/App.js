import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import ButtonAppBar from './ButtonAppBar'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import { blue } from '@mui/material/colors';
import PersonIcon from '@mui/icons-material/Person';

function App() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://localhost:8080/patients');
      const json = await response.json();
      setPatients(json.data);
    }
    fetchData();
  }, []);

  const handlePatientClick = async (patient) => {
    setSelectedPatient(patient);
    const response = await fetch(`http://localhost:8080/order/${patient.OrderId}`);
    const json = await response.json();
    setSelectedOrder(json.data);
    setOrderMessage(json.data.Message);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleOrderSave = async () => {
    const response = await fetch(`http://localhost:8080/order/${selectedOrder.Id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...selectedOrder, Message: orderMessage })
    });
    const json = await response.json();
    setSelectedOrder(json.data);
    setOpenDialog(false);
  };

  const handleOrderMessageChange = (event) => {
    setOrderMessage(event.target.value);
  };

  return (
    <div>
      <ButtonAppBar />
      <h1>Patients</h1>
        <nav aria-label="main mailbox folders">
          <List>
            {patients.map(patient => (
                <ListItem disablePadding>
                <ListItemButton  key={patient.Id}  onClick={() =>handlePatientClick(patient)}>
                     <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
                  <ListItemText primary={patient.Name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </nav>
      
     
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Order for {selectedPatient ? selectedPatient.Name : ''}</DialogTitle>
        <DialogContent>
          <DialogContentText>Message:</DialogContentText>
          <input type="text" value={orderMessage} onChange={handleOrderMessageChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleOrderSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;
