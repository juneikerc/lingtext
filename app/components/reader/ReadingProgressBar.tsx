interface ReadingProgressBarProps {
  progress: number;
  show?: boolean;
}

export default function ReadingProgressBar({
  progress,
  show = true,
}: ReadingProgressBarProps) {
  if (!show || progress <= 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-30 h-1 bg-gray-200 dark:bg-gray-700">
      <div
        className="h-full bg-[#0F9EDA] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
      <div className="absolute -bottom-8 right-4 flex items-center gap-1.5 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-3 py-1 shadow-sm">
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
          {progress}%
        </span>
      </div>
    </div>
  );
}
