interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function LoadingSpinner({ 
  message = "Cargando...", 
  size = "md",
  className = "" 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className={`${sizeClasses[size]} border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4`}></div>
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
}
