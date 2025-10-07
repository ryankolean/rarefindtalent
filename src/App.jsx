import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
import GoogleAnalytics from "@/components/GoogleAnalytics"

function App() {
  return (
    <>
      <GoogleAnalytics measurementId="G-XXXXXXXXXX" />
      <Pages />
      <Toaster />
    </>
  )
}

export default App 