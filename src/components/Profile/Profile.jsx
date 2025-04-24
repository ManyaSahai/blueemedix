// src/components/Profile/Profile.jsx
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    CircularProgress,
    Alert,
    Box,
    Grid,
} from '@mui/material';

function Profile({ open, onClose, userData, loading, error }) {
    if (loading) {
        return (
            <Dialog open={open} onClose={onClose}>
                <DialogContent sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <CircularProgress />
                </DialogContent>
            </Dialog>
        );
    }

    if (error) {
        return (
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Profile</DialogTitle>
                <DialogContent>
                    <Alert severity="error">Error loading profile information.</Alert>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Your Profile</DialogTitle>
            <DialogContent>
                {userData && (
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1"><strong>Name:</strong></Typography>
                            <Typography>{userData.name}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1"><strong>Email:</strong></Typography>
                            <Typography>{userData.e_mail}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1"><strong>Role:</strong></Typography>
                            <Typography>{userData.role}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1"><strong>Phone:</strong></Typography>
                            <Typography>{userData.phone_no}</Typography>
                        </Grid>
                        {userData.gender && (
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1"><strong>Gender:</strong></Typography>
                                <Typography>{userData.gender}</Typography>
                            </Grid>
                        )}
                        {userData.date_of_birth && (
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1"><strong>Date of Birth:</strong></Typography>
                                <Typography>{new Date(userData.date_of_birth).toLocaleDateString()}</Typography>
                            </Grid>
                        )}
                        {userData.region && (
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1"><strong>Region:</strong></Typography>
                                <Typography>{userData.region}</Typography>
                            </Grid>
                        )}
                        {userData.address && (
                            <Grid item xs={12}>
                                <Typography variant="subtitle1"><strong>Address:</strong></Typography>
                                <Typography>{userData.address.first_line}</Typography>
                                {userData.address.second_line && <Typography>{userData.address.second_line}</Typography>}
                                <Typography>{`${userData.address.city}, ${userData.address.state} ${userData.address.pin_code}`}</Typography>
                            </Grid>
                        )}
                        {userData.verification_status && (
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1"><strong>Verification Status:</strong></Typography>
                                <Typography>{userData.verification_status}</Typography>
                            </Grid>
                        )}
                        {userData.verified_by && (
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1"><strong>Verified By:</strong></Typography>
                                <Typography>{userData.verified_by}</Typography>
                            </Grid>
                        )}
                        {userData.verification_date && (
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1"><strong>Verification Date:</strong></Typography>
                                <Typography>{new Date(userData.verification_date).toLocaleDateString()}</Typography>
                            </Grid>
                        )}
                        {userData.desc && (
                            <Grid item xs={12}>
                                <Typography variant="subtitle1"><strong>Description:</strong></Typography>
                                <Typography>{userData.desc}</Typography>
                            </Grid>
                        )}
                        {userData.complaints && (
                            <Grid item xs={12}>
                                <Typography variant="subtitle1"><strong>Complaints:</strong></Typography>
                                <Typography>{userData.complaints}</Typography>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Created At: {new Date(userData.created_at).toLocaleString()}
                            </Typography>
                            <Typography variant="subtitle2" color="textSecondary">
                                Updated At: {new Date(userData.updated_at).toLocaleString()}
                            </Typography>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default Profile;