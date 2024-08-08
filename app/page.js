'use client'
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { AppBar, Toolbar, Box, Typography, Stack, Modal, TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material'
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc } from 'firebase/firestore'

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [itemQuantity, setItemQuantity] = useState(1) // State to hold the quantity input
  const [itemUnit, setItemUnit] = useState('') // State to hold the unit type
  const [searchQuery, setSearchQuery] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data()
      })
    })
    setInventory(inventoryList)
  }

  const addItem = async (item, quantity, unit) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity: existingQuantity } = docSnap.data()
      await setDoc(docRef, { quantity: existingQuantity + quantity, unit }) // Update with the existing unit
    } else {
      await setDoc(docRef, { quantity, unit })
    }

    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1, unit: docSnap.data().unit })
      }
    }

    await updateInventory()
  }

  // New function to delete an item entirely
  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    await deleteDoc(docRef)
    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // Filter inventory based on search query
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Box
      width="100vw"
      height="100vh"
      display='flex'
      flexDirection='column'
      bgcolor='#333'  // Dark background
    >
      {/* Navigation Bar */}
      <AppBar position="static" sx={{ bgcolor: '#000' }}>  {/* Black AppBar */}
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            CHINGOS SUPERMARKET
          </Typography>
        </Toolbar>
      </AppBar>

      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={500}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              label="Item Name"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            />
            <TextField
              variant="outlined"
              label="Quantity"
              type="number"
              value={itemQuantity}
              onChange={(e) => {
                const quantity = Math.max(1, parseInt(e.target.value, 10) || 1) // Ensuring quantity is at least 1
                setItemQuantity(quantity)
              }}
            />
            <FormControl fullWidth>
              <InputLabel>Unit</InputLabel>
              <Select
                value={itemUnit}
                label="Unit"
                onChange={(e) => setItemUnit(e.target.value)}
              >
                <MenuItem value={'bunches'}>Bunches</MenuItem>
                <MenuItem value={'pounds'}>Pounds</MenuItem>
                <MenuItem value={'loaves'}>Loaves</MenuItem>
                <MenuItem value={'packs'}>Packs</MenuItem>
                <MenuItem value={'bags'}>Bags</MenuItem>
                <MenuItem value={'units'}>Units</MenuItem>
                <MenuItem value={'jars'}>Jars</MenuItem>
                <MenuItem value={'cans'}>Cans</MenuItem>
                <MenuItem value={'boxes'}>Boxes</MenuItem>
                <MenuItem value={'bottles'}>Bottles</MenuItem>
                {/* Add more units as needed */}
              </Select>
            </FormControl>
          </Stack>
          <Button variant="outlined" onClick={() => {
            if (itemName && itemQuantity > 0 && itemUnit) {
              addItem(itemName, itemQuantity, itemUnit)
              setItemName('')
              setItemQuantity(1)
              setItemUnit('')
              handleClose()
            }
          }}
          >Add</Button>
        </Box>
      </Modal>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="100%"
        p={2}
        flexGrow={1}
        overflow="hidden"
      >
        <Button variant="contained" onClick={handleOpen} sx={{ mb: 2, bgcolor: '#000' }}>  {/* Black button */}
          Add New Item
        </Button>
        <TextField
          variant="outlined"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ marginBottom: 2, width: '800px', bgcolor: '#fff' }}  // White background for the search input
        />
        <Box width="800px" border={'1px solid #000'} borderRadius={2} overflow="hidden">  {/* Black border */}
          <Box
            height="60px"
            bgcolor='#000'  // Black background
            display='flex'
            justifyContent='center'
            alignItems='center'

            sx={{ borderBottom: '1px solid #fff' }}
          >
            <Typography variant='h5' color='#fff' textAlign='center'>
              Inventory Items
            </Typography>
          </Box>
          <Stack width="800px" maxHeight="calc(100vh - 200px)" spacing={1} sx={{ overflowY: 'auto' }}>
            {filteredInventory.map(({ name, quantity, unit }) => (
              <Box
                key={name}
                width="100%"
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                bgcolor='#444'  // Dark grey background
                paddingX={3}
                paddingY={2}
                sx={{
                  borderBottom: '1px solid #555',
                }}
              >
                <Typography variant="body1" color="#fff" sx={{ flexGrow: 1 }}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant='body1' color='#fff' sx={{ minWidth: '100px', textAlign: 'center' }}>
                  {quantity} {unit} {/* Display quantity and unit */}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button variant="outlined" sx={{ color: '#fff', borderColor: '#fff' }} onClick={() => addItem(name, 1, unit)}>
                    Add
                  </Button>
                  <Button variant="outlined" sx={{ color: '#fff', borderColor: '#fff' }} onClick={() => removeItem(name)}>
                    Remove
                  </Button>
                  <Button variant="outlined" sx={{ color: '#fff', borderColor: '#fff' }} onClick={() => deleteItem(name)}>
                    Delete
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
