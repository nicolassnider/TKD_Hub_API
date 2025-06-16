export type CreatePromotionDto = {
	studentId: number;
	rankId: number;
	promotionDate: string; // ISO date string, e.g. "2025-06-15T21:53:06.830Z"
	coachId: number;
	notes?: string;
	dojaangId: number;
};
