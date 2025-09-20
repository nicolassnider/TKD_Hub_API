import React from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Paper,
  Divider,
} from "@mui/material";
import { EmojiEvents } from "@mui/icons-material";

import { PromotionDto } from "../types/api";
import { useApiItems } from "hooks/useApiItems";

export default function StudentPromotionHistory() {
  const { studentId } = useParams<{ studentId: string }>();

  const {
    items: promotions,
    loading: promotionsLoading,
    error,
  } = useApiItems<PromotionDto>(`/api/Promotions/student/${studentId}`);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (promotionsLoading) {
    return <div>Loading promotion history...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error loading promotion history: {error}
      </div>
    );
  }

  const sortedPromotions = promotions.sort(
    (a, b) =>
      new Date(b.promotionDate).getTime() - new Date(a.promotionDate).getTime(),
  );

  return (
    <div>
      <h2 className="page-title">Promotion History</h2>

      {sortedPromotions.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary">
              No promotion history found for this student.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {sortedPromotions.map((promotion, index) => (
            <Paper key={promotion.id} elevation={2} sx={{ p: 3 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <EmojiEvents color="primary" />
                <Typography variant="h6" component="h3">
                  Promoted to {promotion.rankName}
                </Typography>
                <Chip
                  label={formatDate(promotion.promotionDate)}
                  size="small"
                  color="primary"
                />
              </Box>

              <Box sx={{ ml: 4 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  <strong>Student:</strong> {promotion.studentName}
                </Typography>

                {promotion.notes && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Notes:</strong> {promotion.notes}
                  </Typography>
                )}
              </Box>

              {index < sortedPromotions.length - 1 && (
                <Divider sx={{ mt: 2 }} />
              )}
            </Paper>
          ))}
        </Box>
      )}
    </div>
  );
}
