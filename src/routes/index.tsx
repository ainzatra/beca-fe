import { createFileRoute } from '@tanstack/react-router'
import { LoginPage } from '@/pages/LoginPage'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return <div>
    <LoginPage />
  </div>
}
