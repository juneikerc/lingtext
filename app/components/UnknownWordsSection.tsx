import { useState } from "react";

import { exportUnknownWordsCsv } from "~/utils/anki";

import StoryGenerator from "./StoryGenerator";
import { StudyLibraryEmptyState } from "./study-library/StudyLibraryEmptyState";
import { StudyLibraryHeader } from "./study-library/StudyLibraryHeader";
import { StudyLibraryList } from "./study-library/StudyLibraryList";
import { StudyLibrarySummary } from "./study-library/StudyLibrarySummary";
import type { UnknownWordsSectionProps } from "./study-library/types";
import { useStudyLibrary } from "./study-library/useStudyLibrary";

export default function UnknownWordsSection(props: UnknownWordsSectionProps) {
  const [showStoryGenerator, setShowStoryGenerator] = useState(false);
  const {
    selectedWords,
    searchQuery,
    setSearchQuery,
    activeView,
    setActiveView,
    sortBy,
    setSortBy,
    newCardsInput,
    setNewCardsInput,
    isSavingNewCardsLimit,
    showAlphaWarning,
    setShowAlphaWarning,
    stats,
    viewCounts,
    sortedWords,
    visibleWords,
    selectedEntries,
    selectedInViewCount,
    hasMoreItems,
    isStoryDisabled,
    isBulkProcessing,
    activeSortLabel,
    activeViewLabel,
    toggleWordSelection,
    selectFilteredWords,
    clearSelection,
    handleSingleDelete,
    handleBulkDelete,
    handlePlayAudio,
    persistNewCardsLimit,
    loadMore,
  } = useStudyLibrary(props);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 left-1/3 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl"></div>
          <div className="absolute -bottom-24 right-1/3 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <StudyLibraryHeader
            activeView={activeView}
            activeViewLabel={activeViewLabel}
            showAlphaWarning={showAlphaWarning}
            onCloseAlphaWarning={() => setShowAlphaWarning(false)}
            onExportLibrary={() => void exportUnknownWordsCsv(props.words)}
          />

          {props.words.length === 0 ? (
            <StudyLibraryEmptyState />
          ) : (
            <div className="space-y-6">
              <StudyLibrarySummary
                stats={stats}
                newCardsPerDay={props.newCardsPerDay}
                newCardsInput={newCardsInput}
                onNewCardsInputChange={setNewCardsInput}
                onPersistNewCardsLimit={() => void persistNewCardsLimit()}
                isSavingNewCardsLimit={isSavingNewCardsLimit}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                activeView={activeView}
                onActiveViewChange={setActiveView}
                viewCounts={viewCounts}
                selectedCount={selectedWords.size}
                resultsCount={sortedWords.length}
                activeViewLabel={activeViewLabel}
                activeSortLabel={activeSortLabel}
                onSelectFilteredWords={selectFilteredWords}
                onClearSelection={clearSelection}
                onExportSelection={() =>
                  void exportUnknownWordsCsv(selectedEntries)
                }
                onOpenStoryGenerator={() => setShowStoryGenerator(true)}
                onDeleteSelection={() => void handleBulkDelete()}
                isStoryDisabled={isStoryDisabled}
                isBulkProcessing={isBulkProcessing}
              />

              <StudyLibraryList
                words={sortedWords}
                visibleWords={visibleWords}
                visibleCount={visibleWords.length}
                selectedInViewCount={selectedInViewCount}
                selectedWords={selectedWords}
                hasMoreItems={hasMoreItems}
                onToggleWordSelection={toggleWordSelection}
                onPlayAudio={handlePlayAudio}
                onDeleteWord={handleSingleDelete}
                onLoadMore={loadMore}
                onClearSearch={() => setSearchQuery("")}
                onResetView={() => setActiveView("all")}
              />
            </div>
          )}
        </div>
      </div>

      {showStoryGenerator ? (
        <StoryGenerator
          selectedWords={Array.from(selectedWords)}
          words={props.words}
          onClose={() => setShowStoryGenerator(false)}
          onSuccess={clearSelection}
        />
      ) : null}
    </div>
  );
}
