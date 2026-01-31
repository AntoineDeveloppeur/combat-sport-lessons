import { AppProvider } from "./state"
import Contact from "./form/contact/page"
import { Stepper } from "../components/Stepper"

export default function Home() {
  return (
    <AppProvider>
      <Stepper />
      <Contact />
    </AppProvider>
  )
}
