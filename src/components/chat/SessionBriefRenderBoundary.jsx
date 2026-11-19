import { Component } from 'react'

export default class SessionBriefRenderBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error) {
    console.error('Session Brief could not render:', error?.message || 'Unknown render error')
  }

  render() {
    if (this.state.error) {
      return (
        <section role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          Session Brief could not be displayed. {this.state.error.message}
        </section>
      )
    }
    return this.props.children
  }
}
