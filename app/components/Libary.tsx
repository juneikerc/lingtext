import { LibraryBackupPanel } from "./library/LibraryBackupPanel";
import { LibraryFolderManager } from "./library/LibraryFolderManager";
import { LibraryLoadingSkeleton } from "./library/LibraryLoadingSkeleton";
import { LibraryTextForm } from "./library/LibraryTextForm";
import { LibraryTextGroups } from "./library/LibraryTextGroups";
import { useLibraryManager } from "./library/useLibraryManager";

export default function Library() {
  const library = useLibraryManager();

  if (library.isLoading) {
    return <LibraryLoadingSkeleton />;
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white px-4 py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#0F9EDA]/5 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[#0F9EDA]/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
            <span className="mr-2.5 h-2 w-2 rounded-full bg-[#0F9EDA]" />
            Biblioteca Personal
          </div>
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Tus propios <span className="text-[#0F9EDA]">Textos</span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-600">
            Crea tu colección personal de lecturas para aprender inglés de forma
            inmersiva
          </p>
        </div>

        <div className="space-y-12">
          <LibraryBackupPanel
            isExporting={library.isExporting}
            isImporting={library.isImporting}
            dbMessage={library.dbMessage}
            onExportDatabase={() => void library.handleExportDatabase()}
            onImportDatabase={() => void library.handleImportDatabase()}
          />

          <LibraryTextForm
            folders={library.folders}
            title={library.title}
            content={library.content}
            inputFormat={library.inputFormat}
            importUrl={library.importUrl}
            isImportingUrl={library.isImportingUrl}
            urlImportMessage={library.urlImportMessage}
            isEditing={library.isEditing}
            selectedFolderId={library.selectedFolderId}
            fileInputRef={library.fileInputRef}
            titleInputRef={library.titleInputRef}
            onTitleChange={library.setTitle}
            onContentChange={library.setContent}
            onInputFormatChange={library.setInputFormat}
            onImportUrlChange={library.setImportUrl}
            onSelectedFolderChange={library.setSelectedFolderId}
            onImportTxt={(event) => void library.onImportTxt(event)}
            onImportUrl={() => void library.onImportUrl()}
            onSubmitText={() => void library.onSubmitText()}
            onResetForm={library.resetFormState}
          />

          <LibraryFolderManager
            folders={library.folders}
            texts={library.texts}
            isCreatingFolder={library.isCreatingFolder}
            newFolderName={library.newFolderName}
            newFolderColor={library.newFolderColor}
            editingFolderId={library.editingFolderId}
            editFolderName={library.editFolderName}
            editFolderColor={library.editFolderColor}
            onCreateModeChange={library.setIsCreatingFolder}
            onNewFolderNameChange={library.setNewFolderName}
            onNewFolderColorChange={library.setNewFolderColor}
            onEditFolderNameChange={library.setEditFolderName}
            onEditFolderColorChange={library.setEditFolderColor}
            onEditingFolderChange={library.setEditingFolderId}
            onCreateFolder={() => void library.onCreateFolder()}
            onUpdateFolder={(folderId) => void library.onUpdateFolder(folderId)}
            onDeleteFolder={(folderId) => void library.onDeleteFolder(folderId)}
            onStartEditFolder={library.onStartEditFolder}
          />

          <LibraryTextGroups
            groups={library.groupedTexts()}
            folders={library.folders}
            texts={library.texts}
            titleInputRef={library.titleInputRef}
            onStartEdit={library.onStartEdit}
            onDeleteText={(id) => void library.onDeleteText(id)}
            onMoveTextToFolder={(textId, folderId) =>
              void library.onMoveTextToFolder(textId, folderId)
            }
            onAudioMenuAction={(textId, action) =>
              void library.onAudioMenuAction(textId, action)
            }
          />
        </div>
      </div>
    </section>
  );
}
