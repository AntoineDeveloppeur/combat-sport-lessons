import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AppProvider } from "./state.tsx"
import { Contact } from "./Steps/Contact"
import { Education } from "./Steps/Education"
import { About } from "./Steps/About"
import { Confirm } from "./Steps/Confirm"
import { Stepper } from "../components/Stepper.js"

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <AppProvider>
          <Router>
            <Stepper />
            <Routes>
              <Route
                path="/"
                element={<Contact />}
              />
              <Route
                path="/education"
                element={<Education />}
              />
              <Route
                path="/about"
                element={<About />}
              />
              <Route
                path="/confirm"
                element={<Confirm />}
              />
            </Routes>
          </Router>
        </AppProvider>
      </main>
    </div>
  )
}
