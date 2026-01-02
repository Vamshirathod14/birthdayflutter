import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Container,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Paper
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Cake as CakeIcon,
  School as SchoolIcon,
  ConfirmationNumber as TicketIcon,
  Image as ImageIcon,
  CalendarToday as DateIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';
import './App.css';

function App() {
  const [birthdays, setBirthdays] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    section: '',
    hallTicketNumber: '',
    photo: '',
    birthDate: ''
  });
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [previewImage, setPreviewImage] = useState('');

  const classes = ['CSE', 'AIML', 'ECE', 'EEE'];
  const sections = ['A', 'B', 'C', 'D'];

  useEffect(() => {
    fetchBirthdays();
  }, []);

  const fetchBirthdays = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://birthdayflutter-backend.onrender.com/api/birthdays');
      setBirthdays(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching birthdays:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch birthdays',
        severity: 'error'
      });
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({
          ...prev,
          photo: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://birthdayflutter-backend.onrender.com/api/birthdays', formData);
      fetchBirthdays();
      setFormData({
        name: '',
        class: '',
        section: '',
        hallTicketNumber: '',
        photo: '',
        birthDate: ''
      });
      setPreviewImage('');
      setSnackbar({
        open: true,
        message: 'Birthday added successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error adding birthday:', error);
      setSnackbar({
        open: true,
        message: 'Failed to add birthday',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://birthdayflutter-backend.onrender.com/api/birthdays/${id}`);
      fetchBirthdays();
      setSnackbar({
        open: true,
        message: 'Birthday deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting birthday:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete birthday',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <div className="admin-app">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="admin-header"
      >
        <Typography variant="h3" component="h1" className="admin-title">
          🎂 Birthday Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" className="admin-subtitle">
          Developed by Vamshi
        </Typography>
      </motion.div>

      <Container maxWidth="lg" className="admin-container">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Paper elevation={3} className="form-paper">
            <Typography variant="h5" component="h2" className="form-title">
              <AddIcon fontSize="large" /> Add New Birthday
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} className="admin-form">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <CakeIcon color="action" sx={{ mr: 1 }} />
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Class</InputLabel>
                    <Select
                      name="class"
                      value={formData.class}
                      onChange={handleChange}
                      required
                    >
                      {classes.map(cls => (
                        <MenuItem key={cls} value={cls}>
                          {cls}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Section</InputLabel>
                    <Select
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      required
                    >
                      {sections.map(sec => (
                        <MenuItem key={sec} value={sec}>
                          {sec}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Hall Ticket Number"
                    name="hallTicketNumber"
                    value={formData.hallTicketNumber}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <TicketIcon color="action" sx={{ mr: 1 }} />
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="photo-upload"
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="photo-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      fullWidth
                      startIcon={<UploadIcon />}
                      sx={{ mb: 2 }}
                    >
                      Upload Photo
                    </Button>
                  </label>
                  {previewImage && (
                    <Box sx={{ width: '100%', mb: 2, textAlign: 'center' }}>
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        style={{ 
                          maxHeight: '200px',
                          maxWidth: '100%',
                          borderRadius: '8px',
                          border: '1px solid #ddd'
                        }}
                      />
                    </Box>
                  )}
                  <TextField
                    fullWidth
                    label="Or enter image URL"
                    name="photo"
                    value={formData.photo}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <ImageIcon color="action" sx={{ mr: 1 }} />
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Birth Date"
                    type="date"
                    name="birthDate"
                    InputLabelProps={{ shrink: true }}
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <DateIcon color="action" sx={{ mr: 1 }} />
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    className="submit-button"
                    startIcon={<AddIcon />}
                  >
                    Add Birthday
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="birthday-list-section"
        >
          <Typography variant="h4" component="h2" className="list-title">
            🎈 Birthday Records
          </Typography>
          
          {loading ? (
            <Box className="loading-container">
              <CircularProgress size={60} thickness={4} />
              <Typography variant="h6" mt={2}>
                Loading birthdays...
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3} className="birthday-grid">
              <AnimatePresence>
                {birthdays.map((birthday) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={birthday._id}
                    component={motion.div}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="birthday-card">
                      <CardMedia
                        component="img"
                        height="250"
                        image={birthday.photo || 'https://via.placeholder.com/300x400?text=No+Image'}
                        alt={birthday.name}
                        className="card-media"
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {birthday.name}
                        </Typography>
                        <Box className="detail-item">
                          <SchoolIcon color="action" fontSize="small" />
                          <Typography variant="body2" color="text.secondary">
                            {birthday.class} - Section {birthday.section}
                          </Typography>
                        </Box>
                        <Box className="detail-item">
                          <TicketIcon color="action" fontSize="small" />
                          <Typography variant="body2" color="text.secondary">
                            {birthday.hallTicketNumber}
                          </Typography>
                        </Box>
                        <Box className="detail-item">
                          <DateIcon color="action" fontSize="small" />
                          <Typography variant="body2" color="text.secondary">
                            {new Date(birthday.birthDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </CardContent>
                      <Box className="card-actions">
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleDelete(birthday._id)}
                          color="error"
                          className="delete-button"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          )}
        </motion.div>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
