import React, { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    console.error('Error caught by boundary:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-lg border border-red-200 bg-red-50 space-y-3">
          <h2 className="text-lg font-bold text-red-700">⚠️ Error Terjadi</h2>
          <p className="text-sm text-red-600">{this.state.error?.message}</p>
          <div className="flex gap-2">
            <Button 
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white"
              size="sm"
            >
              Reload Halaman
            </Button>
            <Button 
              onClick={() => window.history.back()}
              variant="outline"
              size="sm"
            >
              Kembali
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
