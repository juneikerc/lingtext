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
    <section className="relative overflow-hidden border-b border-gray-200 bg-white px-4 py-12 dark:border-gray-800 dark:bg-gray-950">
      <div className="absolute inset-0">
        <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-400/5"></div>
        <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl dark:bg-sky-400/5"></div>
      </div>

      <div className="relative mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            <span className="mr-2 h-2 w-2 rounded-full bg-indigo-500"></span>
            Biblioteca Personal
          </div>
          <h2 className="mb-4 text-4xl font-extrabold text-gray-900 dark:text-gray-100 md:text-5xl">
            Agrega tus propios{" "}
            <span className="text-indigo-600 dark:text-indigo-400">Textos</span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-400">
            Crea tu colección personal de lecturas para aprender inglés de forma
            inmersiva
          </p>
        </div>

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
    </section>
  );
}
