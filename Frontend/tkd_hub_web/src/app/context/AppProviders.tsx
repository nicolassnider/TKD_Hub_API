/**
 * AppProviders wraps all global context providers in a single component.
 * 
 * Summary:
 * - Keeps RootLayout clean and readable by avoiding deeply nested providers.
 * - Centralizes provider order for easy maintenance and updates.
 * - Ensures dependencies (like ApiConfig and Auth) are available to all nested contexts.
 * - Prevents "provider hell" as the number of contexts grows.
 * - Follows best practices for large React/Next.js apps with many global contexts.
 */
import { ApiConfigProvider } from "./ApiConfigContext";
import { AuthProvider } from "./AuthContext";
import { RoleProvider } from "./RoleContext";
import { UserProvider } from "./UserContext";
import { DojaangProvider } from "./DojaangContext";
import { CoachProvider } from "./CoachContext";
import { ClassProvider } from "./ClassContext";
import { StudentProvider } from "./StudentContext";
import { PromotionProvider } from "./PromotionContext";
import { RankProvider } from "./RankContext";
import { TulProvider } from "./TulContext";
import { BlogPostProvider } from "./BlogPostContext";
import { DashboardProvider } from "./DashboardContext";
import { PaymentProvider } from "./PaymentContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ApiConfigProvider>
      <AuthProvider>
        <RoleProvider>
          <UserProvider>
            <DojaangProvider>
              <CoachProvider>
                <StudentProvider>
                  <ClassProvider>
                    <PromotionProvider>
                      <RankProvider>
                        <TulProvider>
                          <BlogPostProvider>
                            <DashboardProvider>
                              <PaymentProvider>
                                {children}
                              </PaymentProvider>
                            </DashboardProvider>
                          </BlogPostProvider>
                        </TulProvider>
                      </RankProvider>
                    </PromotionProvider>
                  </ClassProvider>
                </StudentProvider>
              </CoachProvider>
            </DojaangProvider>
          </UserProvider>
        </RoleProvider>
      </AuthProvider>
    </ApiConfigProvider>
  );
}
