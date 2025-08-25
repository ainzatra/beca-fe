# Election Prescriptive Analysis Frontend Development Plan

## Project Overview

A web application for conducting prescriptive analysis for election campaigns. The system supports two user roles:

- **Admins**: Full access to manage campaigns, surveys, view analytics, and manage users
- **Surveyors**: Limited access to generate survey links and distribute surveys

## System Architecture

### User Roles & Permissions

- **Admin**: CRUD operations on campaigns/surveys, view analytics, manage surveyor accounts, access AI analysis
- **Surveyor**: Generate shareable survey links, view assigned surveys only

### Core Concepts

- **Campaigns**: Container for election analysis projects
- **Phases**: Each campaign has exactly 3 phases (Phase 1, Phase 2, Phase 3)
- **Surveys**: Each phase contains one survey with custom questions
- **Responses**: User submissions to surveys
- **AI Analysis**: Prescriptive analysis and recommendations based on collected data

## Page-by-Page Breakdown

### 1. Authentication Pages

#### Login Page (`/login`)

**Components needed:**

- `LoginForm` component with email/password fields
- Role-based redirect logic
- Remember me functionality
- Forgot password link

**Page Description:**
Simple login form with email and password fields. After authentication, redirect admins to dashboard and surveyors to their survey list.

---

### 2. Admin Pages

#### Admin Dashboard (`/admin/dashboard`)

**Components needed:**

- `DashboardStats` - Key metrics cards (total campaigns, active surveys, response count)
- `RecentActivity` - Timeline of recent actions
- `QuickActions` - Buttons for common tasks (create campaign, view analytics)
- `CampaignOverview` - Summary cards of active campaigns

**Page Description:**
Main overview page showing key statistics, recent activity, and quick access to important functions. Display metrics like total campaigns, active surveys, total responses, and recent survey activity.

#### Campaigns Page (`/admin/campaigns`)

**Components needed:**

- `CampaignCard` - Individual campaign display with title, status, progress
- `CreateCampaignModal` - Form to create new campaign
- `CampaignGrid` - Grid layout for campaign cards
- `SearchBar` - Filter campaigns by name/status
- `FilterDropdown` - Filter by campaign status (active, completed, draft)

**Page Description:**
Grid view of all campaigns displayed as cards. Each card shows campaign name, status, creation date, and progress indicator for the 3 phases. Include search and filter functionality. "Create New Campaign" button opens modal form.

#### Campaign Detail Page (`/admin/campaigns/[campaignId]`)

**Components needed:**

- `CampaignHeader` - Campaign title, status, and metadata
- `PhaseList` - List of 3 phases with their surveys
- `PhaseCard` - Individual phase display with survey status
- `SurveyPreview` - Quick preview of survey questions
- `ResponsesCount` - Number of responses per phase
- `AIAnalysisButton` - Trigger AI analysis when ready

**Page Description:**
Detailed view of a specific campaign showing all 3 phases. Each phase displays its survey status (draft, active, completed), response count, and quick actions. Include "Run AI Analysis" button when sufficient data is collected.

#### Survey Builder Page (`/admin/campaigns/[campaignId]/phases/[phaseId]/survey`)

**Components needed:**

- `SurveyEditor` - Main survey editing interface
- `QuestionBlock` - Individual question component
- `QuestionTypeSelector` - Dropdown for question types (radio, checkbox, textarea, etc.)
- `DefaultInfoSection` - Respondent information fields (name, address, etc.)
- `AddQuestionButton` - Add new question blocks
- `SurveyPreview` - Live preview of survey
- `SaveSurveyButton` - Save survey changes

**Page Description:**
Drag-and-drop survey builder interface. Default section for respondent information (name, address, contact details). Dynamic question blocks that can be added, removed, and reordered. Each question block allows setting title, question type, and options (for radio/checkbox).

#### Analytics Page (/admin/analytics)

**Components needed:**

- AnalyticsHeader - Page title, campaign selector, and date range filters
- CampaignSelector - Dropdown to select specific campaign for analysis
- DateRangeFilter - Filter analytics by specific time periods or phases

- #### AI-Powered Sentiment Analysis Section:
  - SentimentTrendChart - Line chart showing sentiment evolution across the 3 campaign phases
  - SentimentBreakdown - Pie charts and bar graphs showing positive/negative/neutral sentiment distribution
  - DemographicSentiment - Sentiment analysis broken down by age, location, gender, and other demographic factors
  - IssueSentiment - Sentiment toward specific policy positions and campaign issues
  - SocialMediaSentiment - Aggregated sentiment from Facebook posts, reactions, comments, and shares

- #### Predictive Modeling & Scenario Analysis:
  - ProbabilityRanges - Display likelihood ranges (e.g., "45-55% based on current data") rather than absolute predictions
  - ScenarioModeling - "What-if" analysis showing different outcome possibilities based on trend changes
  - TrendProjection - Projection of current sentiment trends with confidence intervals
  - ComparativeBenchmarking - Performance comparison against historical similar campaigns
  - MomentumIndicators - Early warning indicators for campaign momentum shifts

- #### Prescriptive Recommendations Engine:
  - WeakDemographicAlerts - AI-identified demographic segments showing declining support
  - MessagingRecommendations - Suggested campaign messaging based on sentiment patterns
  - OptimalTimingInsights - Recommended timing for campaign activities and announcements
  - PolicyPositionAnalysis - Which policy positions resonate most/least with target demographics
  - ChannelEffectiveness - Most effective communication channels based on engagement data

- #### Data Integration Dashboard:
  - SurveyDataAnalysis - Primary analysis from the 3-phase survey responses
  - SocialMediaInsights - Secondary validation from Facebook engagement metrics (reactions, comments, shares)
  - CrossPlatformCorrelation - Correlation analysis between survey sentiment and social media sentiment
  - DataQualityIndicators - Confidence levels and sample size indicators for all analysis

- #### Interactive Visualizations:
  - SentimentHeatmap - Geographic visualization of sentiment by region/district
  - EngagementMetrics - Social media engagement trends and viral content analysis
  - CompetitiveAnalysis - Sentiment comparison with opposing candidates (when data available)
  - IssuePerformanceMatrix - Visual matrix showing performance across different campaign issues

- #### Export and Reporting:
  - AnalyticsExport - Export comprehensive reports in PDF/Excel format
  - ExecutiveSummary - AI-generated executive summary with key insights and recommendations
  - ScheduledReports - Automated weekly/monthly analytics reports
  - CustomDashboard - Configurable dashboard for specific stakeholder needs

- #### Limitations and Disclaimers Section:
  - UncertaintyIndicators - Clear display of confidence intervals and data limitations
  - SampleBiasWarnings - Alerts about potential survey sample bias or social media representation gaps
  - ExternalFactorNotes - Acknowledgment of variables beyond sentiment (turnout, external events, late deciders)
  - MethodologyTransparency - Clear explanation of AI analysis methods and data sources

**Page Description:**
Comprehensive AI-powered analytics dashboard that transforms survey responses and social media data into actionable campaign insights. The page presents data-driven intelligence through multiple analysis layers:

**Primary Analysis**: Deep dive into survey responses across all 3 campaign phases, analyzing sentiment trends, demographic breakdowns, and issue-specific feedback.

**Social Media Intelligence**: Integration of Facebook engagement data (reactions, comments, shares) to validate survey findings and identify broader public sentiment patterns.

**Predictive Insights**: Probability-based scenario modeling that provides likelihood ranges rather than absolute predictions, helping campaigns understand potential outcomes under different conditions.

**Prescriptive Recommendations**: AI-generated strategic recommendations including messaging optimization, demographic targeting, timing strategies, and resource allocation suggestions.

**Interactive Visualizations**: Dynamic charts, heatmaps, and graphs that allow campaign managers to explore data from multiple angles and drill down into specific demographics or regions.

The dashboard emphasizes transparency about limitations and uncertainty, presenting insights as "data-driven intelligence for strategic decision-making" rather than guaranteed predictions. All analysis includes confidence intervals, sample size indicators, and clear disclaimers about external factors that could influence election outcomes.

**Key Features:**

- Real-time sentiment tracking across campaign phases
- Cross-platform data correlation (surveys + social media)
- Early warning system for campaign momentum shifts
- Automated insight generation with human-readable summaries
- Customizable reporting for different stakeholders
- Mobile-responsive design for on-the-go campaign management

#### Survey Responses Page (`/admin/surveys/[surveyId]/responses`)

**Components needed:**

- `ResponsesTable` - Paginated table of all responses
- `FilterBar` - Filters for date range, surveyor, phase
- `ResponseRow` - Individual response display
- `ExportResponses` - Export functionality for responses
- `SearchBox` - Search through responses
- `ResponseModal` - Detailed view of individual response

**Page Description:**
Data table showing all responses for a specific survey. Include filtering by date range, surveyor, and phase. Pagination for large datasets. Export functionality to CSV/Excel. Click on response to view detailed submission.

#### Users Management Page (`/admin/users`)

**Components needed:**

- `UsersList` - Table of all surveyors
- `CreateUserModal` - Form to create new surveyor account
- `UserActions` - Edit, suspend, delete user buttons
- `UserStatusBadge` - Visual indicator of user status (active, suspended)
- `BulkActions` - Select multiple users for bulk operations

**Page Description:**
Management interface for surveyor accounts. Table view with columns for name, email, status, campaigns assigned, last active. Actions to create, edit, suspend, or delete surveyor accounts. Bulk selection for mass operations.

---

### 3. Surveyor Pages

#### Surveyor Dashboard (`/surveyor/dashboard`)

**Components needed:**

- `AssignedSurveys` - List of surveys assigned to this surveyor
- `SurveyCard` - Individual survey with generate link button
- `RecentLinks` - Recently generated survey links
- `ResponsesCount` - Number of responses collected by this surveyor

**Page Description:**
Simple dashboard showing surveys assigned to the logged-in surveyor. Each survey card has a "Generate Link" button to create shareable survey URLs. Display recent activity and response count.

#### Survey Link Generator (`/surveyor/surveys/[surveyId]`)

**Components needed:**

- `SurveyInfo` - Survey details and description
- `LinkGenerator` - Generate unique survey links
- `GeneratedLinks` - List of previously generated links
- `ShareOptions` - Social media and email sharing options
- `QRCodeGenerator` - Generate QR codes for links

**Page Description:**
Interface to generate shareable survey links. Show survey information and generate unique URLs that track which surveyor shared them. Include options to share via social media, email, or generate QR codes for offline distribution.

---

### 4. Public Pages

#### Public Survey Page (`/survey/[uniqueId]`)

**Components needed:**

- `SurveyHeader` - Survey title and description
- `RespondentInfoForm` - Default fields for name, address, etc.
- `DynamicQuestions` - Render questions based on survey configuration
- `ProgressIndicator` - Show survey completion progress
- `SubmitButton` - Submit survey response
- `ThankYouMessage` - Post-submission confirmation

**Page Description:**
Public-facing survey form that respondents fill out. Clean, mobile-responsive design with progress indicator. Validate required fields before submission. Show thank you message after successful submission.

---

### 5. Shared Components

#### Navigation Components

- `AdminSidebar` - Navigation for admin pages
- `SurveyorSidebar` - Limited navigation for surveyors
- `TopBar` - User info and logout functionality

#### Common UI Components

- `LoadingSpinner` - Loading states
- `ConfirmationModal` - Confirm destructive actions
- `Toast` - Success/error notifications
- `Pagination` - Paginate large datasets
- `EmptyState` - When no data is available

---

## Technical Requirements

### Routing Structure

```
/login
/admin/dashboard
/admin/campaigns
/admin/campaigns/[campaignId]
/admin/campaigns/[campaignId]/phases/[phaseId]/survey
/admin/analytics
/admin/surveys/[surveyId]/responses
/admin/users
/surveyor/dashboard
/surveyor/surveys/[surveyId]
/survey/[uniqueId]
```

### State Management Needs

- User authentication state
- Campaign and survey data
- Form builder state for survey creation
- Filters and search states for data tables
- AI analysis results

### Key Features to Implement

1. Role-based access control
2. Dynamic form builder with drag-and-drop
3. Real-time response tracking
4. AI integration for data analysis
5. Export functionality for data
6. Mobile-responsive design
7. Link generation and tracking
8. Data visualization for analytics

### Integration Points

- Authentication system
- Database for campaigns, surveys, responses
- AI service for prescriptive analysis
- Email service for sharing surveys
- File export services (CSV, PDF)

This plan provides a comprehensive structure for building the election prescriptive analysis frontend with clear separation of concerns and detailed component requirements for each page.
