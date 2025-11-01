export default function NotAllowedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        غير مسموح لك بالدخول
      </h1>
      <p className="text-neutral-700 dark:text-neutral-300 text-lg"></p>
      <a
        href="/"
        className="mt-6 px-6 py-3 rounded-xl bg-neutral-400 hover:bg-neutral-600 text-white text-md transition"
      >
        العودة إلى الرئيسية
      </a>
    </div>
  );
}
