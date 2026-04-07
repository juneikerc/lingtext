export default function ProseContent({ html }: { html: string }) {
  return (
    <div
      className="prose prose-lg prose-gray max-w-none prose-headings:text-gray-900 prose-a:text-indigo-600"
      dangerouslySetInnerHTML={{
        __html: html || "",
      }}
    />
  );
}
