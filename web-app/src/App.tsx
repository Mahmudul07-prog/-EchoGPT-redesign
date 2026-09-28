import { Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { useThemeEffect } from "./hooks/useThemeEffect";
import ChatPage from "./pages/ChatPage";
import HistoryPage from "./pages/HistoryPage";
import ComparePage from "./pages/ComparePage";
import ConnectorsPage from "./pages/ConnectorsPage";
import StorePage from "./pages/StorePage";
import ImageStudioPage from "./pages/ImageStudioPage";
import VideoStudioPage from "./pages/VideoStudioPage";
import AiTasksPage from "./pages/AiTasksPage";
import JobAnalysisPage from "./pages/JobAnalysisPage";
import SopBuilderPage from "./pages/SopBuilderPage";
import SettingsPage from "./pages/SettingsPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import SupportPage from "./pages/SupportPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  useThemeEffect();

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<ChatPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/connectors" element={<ConnectorsPage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/image-studio" element={<ImageStudioPage />} />
        <Route path="/video-studio" element={<VideoStudioPage />} />
        <Route path="/ai-tasks" element={<AiTasksPage />} />
        <Route path="/ai-tasks/job-analysis" element={<JobAnalysisPage />} />
        <Route path="/ai-tasks/sop-builder" element={<SopBuilderPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
