import { Preset } from "@/types"

export const warmUpPreset: Preset = {
  shadowBoxing: [{ text: "shadowBoxing", min: 15, sec: 20 }],
  "course à pied": [{ text: "course à pied", min: 10, sec: 0 }],
}

export const warmUpPresetTitles = Object.keys(warmUpPreset)
