import type { ReactNode } from "react"

interface ContactInfoProps {
  icon: ReactNode
  title: string
  content: ReactNode
  subtitle: string
}

export function ContactInfo({ icon, title, content, subtitle }: ContactInfoProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-start space-x-4">
        <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
          <div className="text-blue-600">{icon}</div>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
          <div className="text-gray-800 font-medium mb-1">{content}</div>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}
