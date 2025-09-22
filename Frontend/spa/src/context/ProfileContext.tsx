import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useRole } from "./RoleContext";
import {
  UserProfile,
  CoachProfile,
  StudentProfile,
  CombinedProfile,
  PaymentInfo,
  ClassEnrollment,
  AttendanceRecord,
  ProfileStats,
  ProfileUpdateData,
  PaymentFormData,
  MercadopagoPayment,
  ProfilePermissions,
} from "../types/profile";
import { TrainingClass } from "../types/classes";

interface ProfileContextType {
  // Profile data
  profile: UserProfile | CoachProfile | StudentProfile | CombinedProfile | null;
  loading: boolean;
  error: string | null;

  // Coach-specific data
  managedClasses: TrainingClass[];

  // Student-specific data
  enrolledClass: TrainingClass | null;
  paymentHistory: PaymentInfo[];
  nextPayment: PaymentInfo | null;

  // Combined data
  attendanceHistory: AttendanceRecord[];
  profileStats: ProfileStats | null;

  // Actions
  fetchProfile: () => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<boolean>;
  fetchManagedClasses: () => Promise<void>;
  fetchEnrolledClass: () => Promise<void>;
  fetchPaymentHistory: () => Promise<void>;
  createPayment: (data: PaymentFormData) => Promise<MercadopagoPayment | null>;
  markAttendance: (
    classId: number,
    studentId: number,
    present: boolean,
    notes?: string,
  ) => Promise<boolean>;

  // Utilities
  getPermissions: () => ProfilePermissions;
  isCoach: () => boolean;
  isStudent: () => boolean;
  hasMultipleRoles: () => boolean;
  getDisplayName: () => string;
  getProfilePicture: () => string;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token, hasRole, effectiveRole, roleLoading } = useRole();

  // State
  const [profile, setProfile] = useState<
    UserProfile | CoachProfile | StudentProfile | CombinedProfile | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [managedClasses, setManagedClasses] = useState<TrainingClass[]>([]);
  const [enrolledClass, setEnrolledClass] = useState<TrainingClass | null>(
    null,
  );
  const [paymentHistory, setPaymentHistory] = useState<PaymentInfo[]>([]);
  const [nextPayment, setNextPayment] = useState<PaymentInfo | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<
    AttendanceRecord[]
  >([]);
  const [profileStats, setProfileStats] = useState<ProfileStats | null>(null);

  // API call helper
  const apiCall = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      const response = await fetch(`/api${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Request failed" }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return response.json();
    },
    [token],
  );

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      console.log("ProfileContext: Fetching profile data...");
      const response = await apiCall("/Users/me");
      console.log("ProfileContext: Raw API response:", response);

      // Handle API response format: { data: { ... } }
      const apiData = response.data || response;
      console.log("ProfileContext: Extracted API data:", apiData);

      // Fetch additional data if available
      let beltLevel = apiData.beltLevel;
      let dojaangName = apiData.dojaangName;

      // If we have currentRankId but no beltLevel, fetch rank info
      if (apiData.currentRankId && !beltLevel) {
        try {
          const rankResponse = await apiCall(`/Ranks/${apiData.currentRankId}`);
          const rankData = rankResponse.data || rankResponse;
          beltLevel = rankData.name;
        } catch (err) {
          console.warn("Could not fetch rank information:", err);
        }
      }

      // If we have dojaangId but no dojaangName, fetch dojaang info
      if (apiData.dojaangId && !dojaangName) {
        try {
          const dojaangResponse = await apiCall(
            `/Dojaangs/${apiData.dojaangId}`,
          );
          const dojaangData = dojaangResponse.data || dojaangResponse;
          dojaangName = dojaangData.name;
        } catch (err) {
          console.warn("Could not fetch dojaang information:", err);
        }
      }

      // Map API response to our UserProfile interface
      const profileData: UserProfile = {
        id: apiData.id,
        firstName: apiData.firstName,
        lastName: apiData.lastName,
        email: apiData.email,
        phoneNumber: apiData.phoneNumber,
        dateOfBirth: apiData.dateOfBirth,
        profilePictureUrl: apiData.profilePictureUrl,
        membershipStartDate: apiData.joinDate,
        membershipStatus: apiData.isActive ? "Active" : "Inactive",
        dojaangId: apiData.dojaangId,
        dojaangName: dojaangName,
        beltLevel: beltLevel,
        roles: apiData.roles || [],
        emergencyContact: apiData.emergencyContact,
        emergencyPhone: apiData.emergencyPhone,
      };

      setProfile(profileData);

      // Calculate stats based on role
      const stats: ProfileStats = {
        totalClasses: 0,
        attendanceRate: 0,
        upcomingClasses: [],
        recentPayments: [],
        attendanceHistory: [],
      };

      if (hasRole("Coach") && apiData.managedClasses) {
        stats.totalClasses = apiData.managedClasses?.length || 0;
        stats.totalStudents = apiData.managedClasses?.reduce(
          (sum: number, cls: any) => sum + (cls.enrolledStudents?.length || 0),
          0,
        );
        stats.upcomingClasses = apiData.managedClasses?.slice(0, 3) || [];
      }

      if (hasRole("Student") && apiData.attendanceRate) {
        stats.attendanceRate = apiData.attendanceRate || 0;
        stats.totalClasses = 1; // Students attend one class
      }

      setProfileStats(stats);
    } catch (err) {
      console.error("ProfileContext: API call failed:", err);
      console.warn(
        "ProfileContext: Falling back to mock profile data for development",
      );

      // Provide mock data when API is not available (development mode)
      const mockProfile: UserProfile = {
        id: 1,
        firstName: "Demo",
        lastName: "User",
        email: "demo@tkdhub.com",
        phoneNumber: "+1 (555) 123-4567",
        dateOfBirth: "1990-01-01",
        emergencyContact: "Jane Doe",
        emergencyPhone: "+1 (555) 987-6543",
        profilePictureUrl: undefined,
        membershipStartDate: "2024-01-15",
        membershipStatus: "Active",
        dojaangName: "Demo Dojaang",
        beltLevel: "Black Belt 1st Dan",
        roles: ["Student"],
      };

      setProfile(mockProfile);

      // Mock stats
      const mockStats: ProfileStats = {
        totalClasses: 1,
        attendanceRate: 85,
        upcomingClasses: [],
        recentPayments: [],
        attendanceHistory: [],
      };

      setProfileStats(mockStats);
      setError(null); // Clear error when using mock data
    } finally {
      setLoading(false);
    }
  }, [token, hasRole, apiCall]);

  // Update profile
  const updateProfile = useCallback(
    async (data: ProfileUpdateData): Promise<boolean> => {
      if (!token) return false;

      try {
        setLoading(true);
        await apiCall("/profile", {
          method: "PUT",
          body: JSON.stringify(data),
        });

        // Refresh profile data
        await fetchProfile();
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update profile",
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [token, apiCall, fetchProfile],
  );

  // Fetch managed classes (for coaches)
  const fetchManagedClasses = useCallback(async () => {
    if (!token || !hasRole("Coach")) return;

    try {
      const data = await apiCall("/profile/managed-classes");
      setManagedClasses(data as TrainingClass[]);
    } catch (err) {
      console.warn(
        "API not available, using empty managed classes for development",
      );
      setManagedClasses([]);
    }
  }, [token, hasRole, apiCall]);

  // Fetch enrolled class (for students)
  const fetchEnrolledClass = useCallback(async () => {
    if (!token || !hasRole("Student")) return;

    try {
      const data = await apiCall("/profile/enrolled-class");
      setEnrolledClass(data as TrainingClass);
    } catch (err) {
      console.warn(
        "API not available, using mock enrolled class for development",
      );
      // Mock enrolled class for development
      const mockClass: TrainingClass = {
        id: 1,
        name: "Demo Taekwondo Class",
        dojaangId: 1,
        dojaangName: "Demo Dojaang",
        coachId: 1,
        coachName: "Demo Coach",
        schedules: [],
        studentCount: 15,
        enrolledStudents: [],
        isActive: true,
      };
      setEnrolledClass(mockClass);
    }
  }, [token, hasRole, apiCall]);

  // Fetch payment history
  const fetchPaymentHistory = useCallback(async () => {
    if (!token || !hasRole("Student")) return;

    try {
      const data = await apiCall("/profile/payments");
      const payments = data as PaymentInfo[];
      setPaymentHistory(payments);

      // Find next payment due
      const upcoming = payments.find(
        (p) => p.status === "Pending" && new Date(p.dueDate) > new Date(),
      );
      setNextPayment(upcoming || null);
    } catch (err) {
      console.warn(
        "API not available, using empty payment history for development",
      );
      setPaymentHistory([]);
      setNextPayment(null);
    }
  }, [token, hasRole, apiCall]);

  // Create payment
  const createPayment = useCallback(
    async (data: PaymentFormData): Promise<MercadopagoPayment | null> => {
      if (!token || !hasRole("Student")) return null;

      try {
        setLoading(true);
        const response = await apiCall("/MercadoPago/create-preference", {
          method: "POST",
          body: JSON.stringify(data),
        });

        // Refresh payment history
        await fetchPaymentHistory();

        return response as MercadopagoPayment;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create payment",
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, hasRole, apiCall, fetchPaymentHistory],
  );

  // Mark attendance (for coaches)
  const markAttendance = useCallback(
    async (
      classId: number,
      studentId: number,
      present: boolean,
      notes?: string,
    ): Promise<boolean> => {
      if (!token || !hasRole("Coach")) return false;

      try {
        await apiCall("/attendance", {
          method: "POST",
          body: JSON.stringify({
            classId,
            studentId,
            present,
            notes,
            date: new Date().toISOString().split("T")[0], // Today's date
          }),
        });

        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to mark attendance",
        );
        return false;
      }
    },
    [token, hasRole, apiCall],
  );

  // Get permissions based on role
  const getPermissions = useCallback((): ProfilePermissions => {
    const role = effectiveRole();

    return {
      canEditProfile: true, // All users can edit their profile
      canViewPayments: hasRole("Student") || hasRole("Admin"),
      canMakePayments: hasRole("Student"),
      canViewClasses: true, // All users can view their classes
      canManageClasses: hasRole("Coach") || hasRole("Admin"),
      canViewStudents: hasRole("Coach") || hasRole("Admin"),
      canMarkAttendance: hasRole("Coach") || hasRole("Admin"),
    };
  }, [effectiveRole, hasRole]);

  // Utility functions
  const isCoach = useCallback(() => hasRole("Coach"), [hasRole]);
  const isStudent = useCallback(() => hasRole("Student"), [hasRole]);
  const hasMultipleRoles = useCallback(() => {
    return hasRole("Coach") && hasRole("Student");
  }, [hasRole]);

  const getDisplayName = useCallback(() => {
    if (!profile) return "User";
    return `${profile.firstName} ${profile.lastName}`;
  }, [profile]);

  const getProfilePicture = useCallback(() => {
    return profile?.profilePictureUrl || "/default-avatar.png";
  }, [profile]);

  // Fetch initial data when token changes and role loading is complete
  useEffect(() => {
    if (roleLoading) return; // Wait for role loading to complete

    if (token) {
      console.log("ProfileContext: Token available, fetching profile data...");
      fetchProfile();

      if (hasRole("Coach")) {
        fetchManagedClasses();
      }

      if (hasRole("Student")) {
        fetchEnrolledClass();
        fetchPaymentHistory();
      }
    } else {
      console.log("ProfileContext: No token, clearing profile data");
      // Clear data when token is removed
      setProfile(null);
      setManagedClasses([]);
      setEnrolledClass(null);
      setPaymentHistory([]);
      setNextPayment(null);
      setAttendanceHistory([]);
      setProfileStats(null);
    }
  }, [
    token,
    roleLoading,
    hasRole,
    fetchProfile,
    fetchManagedClasses,
    fetchEnrolledClass,
    fetchPaymentHistory,
  ]);

  const contextValue: ProfileContextType = {
    // Profile data
    profile,
    loading,
    error,

    // Coach-specific data
    managedClasses,

    // Student-specific data
    enrolledClass,
    paymentHistory,
    nextPayment,

    // Combined data
    attendanceHistory,
    profileStats,

    // Actions
    fetchProfile,
    updateProfile,
    fetchManagedClasses,
    fetchEnrolledClass,
    fetchPaymentHistory,
    createPayment,
    markAttendance,

    // Utilities
    getPermissions,
    isCoach,
    isStudent,
    hasMultipleRoles,
    getDisplayName,
    getProfilePicture,
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
