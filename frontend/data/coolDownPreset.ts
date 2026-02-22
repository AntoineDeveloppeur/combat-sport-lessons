import { Preset } from "@/types"

export const coolDownPreset: Preset = {
  "étirements statiques": [{ text: "étirements statiques", min: 10, sec: 0 }],
  "marche lente": [{ text: "marche lente", min: 5, sec: 0 }],
}

export const coolDownPresetTitles = Object.keys(coolDownPreset)
