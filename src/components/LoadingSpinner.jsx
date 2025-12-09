import { ChefHat } from 'lucide-react'

export default function LoadingSpinner({ message = 'Chargement...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-4 border-primary-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <ChefHat className="w-6 h-6 text-primary-600" />
        </div>
      </div>
      <p className="text-secondary-600">{message}</p>
    </div>
  )
}
