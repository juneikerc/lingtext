import { LibraryBackupPanel } from "./library/LibraryBackupPanel";
import { LibraryFolderManager } from "./library/LibraryFolderManager";
import { LibraryLoadingSkeleton } from "./library/LibraryLoadingSkeleton";
import { LibraryTextForm } from "./library/LibraryTextForm";
import { LibraryTextGroups } from "./library/LibraryTextGroups";
import { useLibraryManager } from "./library/useLibraryManager";

function BookOpenIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5v-16ZM20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5v-16Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path
        d="m5 12 4 4L19 6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function HelpPanel() {
  const tips = [
    "Usa textos que te interesen para mantener la motivación.",
    "Asegúrate de que el contenido esté en inglés.",
    "Los archivos .txt sin formato funcionan mejor.",
    "Puedes editar y ajustar la lectura después de importarla.",
  ];

  return (
    <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/10 text-[#0F9EDA]">
            <BookOpenIcon />
          </div>
          <h3 className="font-bold text-gray-900">Consejos para importar</h3>
        </div>
        <div className="space-y-4">
          {tips.map((tip) => (
            <div
              key={tip}
              className="flex gap-3 text-sm leading-relaxed text-gray-600"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0F9EDA] text-white">
                <CheckIcon />
              </span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/10 text-[#0F9EDA]">
            <BookOpenIcon />
          </div>
          <h3 className="font-bold text-gray-900">Formatos compatibles</h3>
        </div>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-center justify-between gap-3">
            <span>Archivo de texto</span>
            <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">
              .txt
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Importación desde web</span>
            <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">
              URL
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Texto con formato</span>
            <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">
              Markdown
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function HeroIllustration() {
  return (
    <div className="relative hidden min-h-64 lg:block" aria-hidden="true">
      <div className="absolute right-0 top-2 h-56 w-72 rounded-[4rem] bg-[#0F9EDA]/5 blur-2xl" />
      <div className="absolute right-20 top-8 h-44 w-60 rounded-[3rem] bg-gray-100/80" />
      <div className="absolute right-28 top-16 w-56 rounded-3xl border border-gray-200 bg-white p-6 shadow-lg">
        <div className="mb-5 flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-gray-200" />
          <span className="h-2 w-2 rounded-full bg-gray-200" />
          <span className="h-2 w-2 rounded-full bg-gray-200" />
        </div>
        <div className="mb-4 text-4xl font-bold text-[#0F9EDA]">Aa</div>
        <div className="space-y-3">
          <div className="h-2.5 rounded-full bg-gray-100" />
          <div className="h-2.5 w-10/12 rounded-full bg-gray-100" />
          <div className="h-2.5 w-8/12 rounded-full bg-gray-100" />
        </div>
      </div>
      <div className="absolute right-10 top-12 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0F9EDA] text-white shadow-lg">
        <BookOpenIcon />
      </div>
      <div className="absolute right-6 top-32 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg">
        <span className="h-5 w-5 rounded-sm border-2 border-white" />
      </div>
    </div>
  );
}

export default function Library() {
  const library = useLibraryManager();

  if (library.isLoading) {
    return <LibraryLoadingSkeleton />;
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white px-4 py-12 sm:py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-6 h-72 w-72 rounded-full bg-[#0F9EDA]/5 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-[#0F9EDA]/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div>
            <div className="mb-6 inline-flex items-center rounded-full border border-[#0F9EDA]/20 bg-[#0F9EDA]/5 px-4 py-2 text-sm font-medium text-[#0F9EDA]">
              <span className="mr-2.5 h-2 w-2 rounded-full bg-[#0F9EDA]" />
              Biblioteca personal
            </div>
            <h1 className="mb-5 max-w-3xl text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Crea y organiza tus{" "}
              <span className="text-[#0F9EDA]">lecturas</span>
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-gray-600">
              Agrega contenido a tu biblioteca pegando texto, subiendo un
              archivo o importando desde una URL. Tú eliges.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 text-sm text-gray-600">
              <span className="rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm">
                {library.texts.length} lecturas
              </span>
              <span className="rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm">
                {library.folders.length} carpetas
              </span>
            </div>
          </div>
          <HeroIllustration />
        </div>

        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
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
            <HelpPanel />
          </div>

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

          <LibraryBackupPanel
            isExporting={library.isExporting}
            isImporting={library.isImporting}
            dbMessage={library.dbMessage}
            onExportDatabase={() => void library.handleExportDatabase()}
            onImportDatabase={() => void library.handleImportDatabase()}
          />
        </div>
      </div>
    </section>
  );
}
