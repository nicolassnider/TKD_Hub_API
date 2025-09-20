import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  Skeleton,
  TextField,
  InputAdornment,
  Grid,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useClassContext } from '../context/ClassContext';
import { StudentForAssignment } from '../types/classes';

interface StudentAssignmentProps {
  open: boolean;
  onClose: () => void;
  classId: number;
  className: string;
}

export const StudentAssignment: React.FC<StudentAssignmentProps> = ({
  open,
  onClose,
  classId,
  className
}) => {
  const {
    enrolledStudents,
    availableStudents,
    loading,
    error,
    fetchStudentsForClass,
    fetchAvailableStudents,
    assignStudentToClass,
    removeStudentFromClass,
  } = useClassContext();

  const [searchEnrolled, setSearchEnrolled] = useState('');
  const [searchAvailable, setSearchAvailable] = useState('');
  const [assigningStudent, setAssigningStudent] = useState<number | null>(null);
  const [removingStudent, setRemovingStudent] = useState<number | null>(null);

  useEffect(() => {
    if (open && classId) {
      fetchStudentsForClass(classId);
      fetchAvailableStudents(classId);
    }
  }, [open, classId, fetchStudentsForClass, fetchAvailableStudents]);

  const handleAssignStudent = async (studentId: number) => {
    try {
      setAssigningStudent(studentId);
      await assignStudentToClass(studentId, classId);
    } catch (error) {
      console.error('Error assigning student:', error);
    } finally {
      setAssigningStudent(null);
    }
  };

  const handleRemoveStudent = async (studentId: number) => {
    try {
      setRemovingStudent(studentId);
      await removeStudentFromClass(studentId, classId);
    } catch (error) {
      console.error('Error removing student:', error);
    } finally {
      setRemovingStudent(null);
    }
  };

  const filterStudents = (students: StudentForAssignment[], searchTerm: string) => {
    if (!searchTerm) return students;
    
    const term = searchTerm.toLowerCase();
    return students.filter(student => 
      student.firstName.toLowerCase().includes(term) ||
      student.lastName.toLowerCase().includes(term) ||
      student.email?.toLowerCase().includes(term) ||
      student.dojaangName?.toLowerCase().includes(term)
    );
  };

  const filteredEnrolledStudents = filterStudents(enrolledStudents, searchEnrolled);
  const filteredAvailableStudents = filterStudents(availableStudents, searchAvailable);

  const getStudentInitials = (student: StudentForAssignment) => {
    return `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`;
  };

  const formatEnrollmentDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { height: '80vh' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonAddIcon />
          Manage Students - {className}
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container sx={{ flexGrow: 1, height: '100%' }}>
          {/* Enrolled Students */}
          <Grid item xs={12} md={6} sx={{ borderRight: { md: 1 }, borderColor: 'divider' }}>
            <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CheckCircleIcon color="success" />
                <Typography variant="h6">
                  Enrolled Students ({enrolledStudents.length})
                </Typography>
              </Box>

              <TextField
                placeholder="Search enrolled students..."
                value={searchEnrolled}
                onChange={(e) => setSearchEnrolled(e.target.value)}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />

              {loading ? (
                <Box>
                  {[...Array(3)].map((_, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Skeleton variant="circular" width={40} height={40} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="40%" />
                      </Box>
                      <Skeleton variant="rectangular" width={24} height={24} />
                    </Box>
                  ))}
                </Box>
              ) : filteredEnrolledStudents.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                  <SchoolIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                  <Typography variant="body2">
                    {searchEnrolled ? 'No students match your search' : 'No students enrolled yet'}
                  </Typography>
                </Box>
              ) : (
                <List sx={{ flexGrow: 1, overflow: 'auto' }}>
                  {filteredEnrolledStudents.map((student) => (
                    <ListItem
                      key={student.id}
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        mb: 1,
                        bgcolor: 'success.50',
                      }}
                    >
                      <Avatar sx={{ mr: 2, bgcolor: 'success.main' }}>
                        {getStudentInitials(student)}
                      </Avatar>
                      <ListItemText
                        primary={`${student.firstName} ${student.lastName}`}
                        secondary={
                          <Box>
                            {student.email && (
                              <Typography variant="caption" display="block">
                                {student.email}
                              </Typography>
                            )}
                            {student.dojaangName && (
                              <Chip 
                                label={student.dojaangName} 
                                size="small" 
                                variant="outlined"
                                sx={{ mt: 0.5 }}
                              />
                            )}
                            {student.enrolledAt && (
                              <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                Enrolled: {formatEnrollmentDate(student.enrolledAt)}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveStudent(student.id)}
                          disabled={removingStudent === student.id}
                          color="error"
                          size="small"
                        >
                          <RemoveIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Grid>

          {/* Available Students */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PersonIcon color="primary" />
                <Typography variant="h6">
                  Available Students ({availableStudents.length})
                </Typography>
              </Box>

              <TextField
                placeholder="Search available students..."
                value={searchAvailable}
                onChange={(e) => setSearchAvailable(e.target.value)}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />

              {loading ? (
                <Box>
                  {[...Array(3)].map((_, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Skeleton variant="circular" width={40} height={40} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="40%" />
                      </Box>
                      <Skeleton variant="rectangular" width={24} height={24} />
                    </Box>
                  ))}
                </Box>
              ) : filteredAvailableStudents.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                  <PersonIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                  <Typography variant="body2">
                    {searchAvailable ? 'No students match your search' : 'No available students'}
                  </Typography>
                </Box>
              ) : (
                <List sx={{ flexGrow: 1, overflow: 'auto' }}>
                  {filteredAvailableStudents.map((student) => (
                    <ListItem
                      key={student.id}
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        mb: 1,
                        bgcolor: 'background.default',
                      }}
                    >
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        {getStudentInitials(student)}
                      </Avatar>
                      <ListItemText
                        primary={`${student.firstName} ${student.lastName}`}
                        secondary={
                          <Box>
                            {student.email && (
                              <Typography variant="caption" display="block">
                                {student.email}
                              </Typography>
                            )}
                            {student.dojaangName && (
                              <Chip 
                                label={student.dojaangName} 
                                size="small" 
                                variant="outlined"
                                sx={{ mt: 0.5 }}
                              />
                            )}
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleAssignStudent(student.id)}
                          disabled={assigningStudent === student.id}
                          color="primary"
                          size="small"
                        >
                          <AddIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
