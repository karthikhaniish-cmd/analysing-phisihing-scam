import React, { useState } from 'react';
import { PageView, ScanRecord } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { DetectPage } from './components/DetectPage';
import { DashboardPage } from './components/DashboardPage';
import { HistoryPage } from './components/HistoryPage';
import { ModelPerformancePage } from './components/ModelPerformancePage';
import { AboutPage } from './components/AboutPage';
import { CodeViewerModal } from './components/CodeViewerModal';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedScan, setSelectedScan] = useState<ScanRecord | null>(null);
  const [isCodeViewerOpen, setIsCodeViewerOpen] = useState(false);

  const handleSelectScan = (scan: ScanRecord) => {
    setSelectedScan(scan);
    setCurrentPage('history');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b1120] text-slate-100 cyber-grid relative">
      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onOpenCodeViewer={() => setIsCodeViewerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            setCurrentPage={setCurrentPage}
            onOpenCodeViewer={() => setIsCodeViewerOpen(true)}
          />
        )}

        {currentPage === 'detect' && (
          <DetectPage setCurrentPage={setCurrentPage} />
        )}

        {currentPage === 'dashboard' && (
          <DashboardPage
            setCurrentPage={setCurrentPage}
            onSelectScan={handleSelectScan}
          />
        )}

        {currentPage === 'history' && (
          <HistoryPage
            setCurrentPage={setCurrentPage}
            selectedScan={selectedScan}
            setSelectedScan={setSelectedScan}
          />
        )}

        {currentPage === 'model-metrics' && (
          <ModelPerformancePage
            setCurrentPage={setCurrentPage}
            onOpenCodeViewer={() => setIsCodeViewerOpen(true)}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            setCurrentPage={setCurrentPage}
            onOpenCodeViewer={() => setIsCodeViewerOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        setCurrentPage={setCurrentPage}
        onOpenCodeViewer={() => setIsCodeViewerOpen(true)}
      />

      {/* Python Deliverables Modal */}
      <CodeViewerModal
        isOpen={isCodeViewerOpen}
        onClose={() => setIsCodeViewerOpen(false)}
      />
    </div>
  );
}
