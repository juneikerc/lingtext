export default function ProseContent({ html }: { html: string }) {
  return (
    <div
      className="prose prose-lg prose-gray dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-a:text-indigo-600 dark:prose-a:text-indigo-400"
      dangerouslySetInnerHTML={{
        __html: html || "",
      }}
    />
  );
}
