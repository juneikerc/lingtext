import { Link } from "react-router";

export default function ButtonLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      to={href}
      className="inline-flex items-center justify-center rounded-full bg-[#0F9EDA] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-[#0F9EDA]/25 transition-all duration-200 hover:bg-[#0D8EC4] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0F9EDA]"
    >
      {children}
    </Link>
  );
}
