// src/components/SellerManagement.js
import React, { useState , useEffect } from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Box,
  IconButton,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import {
  Visibility as ViewDetailsIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
} from "@mui/icons-material";
import {
  useApproveSellerMutation,
  useRejectSellerMutation,
} from "../../redux/regionalAdminApi"; // Ensure correct path

function SellerManagement({ sellersData, errorSellers, showSnackbar }) {
  const [sellers, setSellers] = useState(sellersData?.sellers || []);
  const [selectedSellerDetails, setSelectedSellerDetails] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [approveSeller] = useApproveSellerMutation();
  const [rejectSeller] = useRejectSellerMutation();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));

  useEffect(() => {
    if (sellersData?.success && sellersData.sellers) {
      setSellers(sellersData.sellers);
    }
  }, [sellersData]);

  const handleApprove = async (sellerId) => {
    // Optimistic update
    setSellers((prevSellers) =>
      prevSellers.map((seller) =>
        seller.id === sellerId ? { ...seller, status: "approving" } : seller
      )
    );

    try {
      await approveSeller(sellerId).unwrap();
      setSellers((prevSellers) =>
        prevSellers.map((seller) =>
          seller.id === sellerId ? { ...seller, status: "approved" } : seller
        )
      );
      showSnackbar("Seller approved successfully!", "success");
    } catch (error) {
      console.error("Failed to approve seller:", error);
      setSellers((prevSellers) =>
        prevSellers.map((seller) =>
          seller.id === sellerId ? { ...seller, status: "pending" } : seller // Revert on error
        )
      );
      showSnackbar("Failed to approve seller.", "error");
    }
  };

  const handleReject = async (sellerId) => {
    // Optimistic update
    setSellers((prevSellers) =>
      prevSellers.map((seller) =>
        seller.id === sellerId ? { ...seller, status: "rejecting" } : seller
      )
    );

    try {
        await rejectSeller({ sellerId: sellerId, reason: "" }).unwrap();
      setSellers((prevSellers) =>
        prevSellers.map((seller) =>
          seller.id === sellerId ? { ...seller, status: "rejected" } : seller
        )
      );
      showSnackbar("Seller rejected successfully!", "success");
    } catch (error) {
      console.error("Failed to reject seller:", error);
      setSellers((prevSellers) =>
        prevSellers.map((seller) =>
          seller.id === sellerId ? { ...seller, status: "pending" } : seller // Revert on error
        )
      );
      showSnackbar("Failed to reject seller.", "error");
    }
  };

  const handleViewDetails = (seller) => {
    setSelectedSellerDetails(seller);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedSellerDetails(null);
  };

  if (errorSellers) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography color="error">Error loading sellers. Please try again.</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Sellers in Your Region
      </Typography>
      {sellersData?.isLoading ? (
        <Typography>Loading sellers...</Typography>
      ) : (
        <TableContainer>
          <Table size={isSmallScreen ? "small" : "medium"}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>Sr. No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  Email
                </TableCell>
                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  Phone
                </TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Verification</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sellers.map((seller, index) => { 
                // console.log("Seller id" , seller.id);
                return(
                <TableRow key={seller.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{seller.name}</TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                    {seller.e_mail}
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                    {seller.phone_no}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        seller.status === "approving"
                          ? "Approving..."
                          : seller.status === "rejecting"
                          ? "Rejecting..."
                          : seller.status
                      }
                      size="small"
                      sx={{
                        backgroundColor:
                          seller.status === "pending"
                            ? "#fff9c4"
                            : seller.status === "approved"
                            ? "#e8f5e9"
                            : seller.status === "rejected"
                            ? "#ffebee"
                            : seller.status === "approving" ||
                              seller.status === "rejecting"
                            ? "#e0f7fa" // Light cyan for processing
                            : "default",
                        color:
                          seller.status === "pending"
                            ? "#ff8f00"
                            : seller.status === "approved"
                            ? "#2e7d32"
                            : seller.status === "rejected"
                            ? "#d32f2f"
                            : seller.status === "approving" ||
                              seller.status === "rejecting"
                            ? "#00838f" // Teal for processing
                            : "default",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleViewDetails(seller)}
                      sx={{ mr: 1 }}
                      startIcon={<ViewDetailsIcon />}
                    >
                      View Details
                    </Button>
                  </TableCell>
                  <TableCell>
                    {seller.status === "pending" ? (
                      <Box>
                        <Tooltip title="Approve">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleApprove(seller.id)}
                            sx={{ mr: 1 }}
                            disabled={
                              seller.status === "approving" ||
                              seller.status === "rejecting"
                            }
                          >
                            <ApproveIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleReject(seller.id)}
                            disabled={
                              seller.status === "approving" ||
                              seller.status === "rejecting"
                            }
                          >
                            <RejectIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ) : seller.status === "approved" ? (
                      <Chip
                        icon={<ApproveIcon fontSize="small" />}
                        label="Approved"
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    ) : seller.status === "rejected" ? (
                      <Chip
                        icon={<RejectIcon fontSize="small" />}
                        label="Rejected"
                        size="small"
                        color="error"
                        variant="outlined"
                      />
                    ) : (
                      <Typography variant="caption" color="textSecondary">
                        {seller.status}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Seller Details Modal */}
      {isDetailsOpen && selectedSellerDetails && (
        <Paper
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
            zIndex: 1000,
            maxWidth: isSmallScreen ? "90%" : 400,
            width: "90%",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Seller Details
          </Typography>
          <Typography>
            <strong>Name:</strong> {selectedSellerDetails.name}
          </Typography>
          <Typography>
            <strong>Email:</strong> {selectedSellerDetails.e_mail}
          </Typography>
          <Typography>
            <strong>Phone:</strong> {selectedSellerDetails.phone_no}
          </Typography>
          <Typography>
            <strong>Status:</strong> {selectedSellerDetails.status}
          </Typography>
          <Typography>
            <strong>Region:</strong> {selectedSellerDetails.region}
          </Typography>
          {selectedSellerDetails.address && (
            <>
              <Typography>
                <strong>Address:</strong> {selectedSellerDetails.address.first_line},{" "}
                {selectedSellerDetails.address.second_line},{" "}
                {selectedSellerDetails.address.city},{" "}
                {selectedSellerDetails.address.state} -{" "}
                {selectedSellerDetails.address.pin_code}
              </Typography>
            </>
          )}
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleCloseDetails}>Close</Button>
          </Box>
        </Paper>
      )}
    </Paper>
  );
}

export default SellerManagement;