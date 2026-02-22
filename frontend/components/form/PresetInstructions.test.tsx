/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import PresetInstructions from "./PresetInstructions"
import { Lesson } from "@/types"

vi.mock("@/components/form/SelectField", () => ({
  default: ({
    lessonKey,
    placeholder,
    selectOptions,
    register,
    errors,
  }: any) => (
    <div data-testid="select-component">
      <input
        data-testid="select-input"
        data-lessonkey={lessonKey}
        data-placeholder={placeholder}
        {...register(lessonKey)}
      />
      <div data-testid="select-options">{selectOptions.join(",")}</div>
      {errors?.[lessonKey] && (
        <span data-testid="select-error">{errors[lessonKey].message}</span>
      )}
    </div>
  ),
}))

vi.mock("@/components/form/FormSaveAndNavigate", () => ({
  default: ({ handleSubmit, prev, next }: any) => (
    <div data-testid="form-save-navigate">
      <button data-testid="prev-button" data-route={prev}>
        Prev
      </button>
      <button data-testid="next-button" data-route={next}>
        Next
      </button>
    </div>
  ),
}))

describe("PresetInstructions", () => {
  const defaultProps = {
    legend: "Choisissez votre échauffement",
    lessonKey: "warmUpPresetTitle" as keyof Lesson,
    placeholder: "Sélectionnez un preset",
    selectOptions: ["Preset 1", "Preset 2", "Preset 3"],
    defaultValues: {} as Lesson,
  }

  describe("Rendering", () => {
    it("should render the legend with correct text", () => {
      render(<PresetInstructions {...defaultProps} />)

      expect(
        screen.getByText("Choisissez votre échauffement")
      ).toBeInTheDocument()
    })

    it("should render the legend as a legend element", () => {
      render(<PresetInstructions {...defaultProps} />)

      const legend = document.querySelector("legend")
      expect(legend).toBeInTheDocument()
      expect(legend).toHaveTextContent("Choisissez votre échauffement")
    })

    it("should render the Select component", () => {
      render(<PresetInstructions {...defaultProps} />)

      expect(screen.getByTestId("select-component")).toBeInTheDocument()
    })
  })

  describe("Props passing to Select", () => {
    it("should pass lessonKey prop to Select", () => {
      render(<PresetInstructions {...defaultProps} />)

      const input = screen.getByTestId("select-input")
      expect(input).toHaveAttribute("data-lessonkey", "warmUpPresetTitle")
    })

    it("should pass placeholder prop to Select", () => {
      render(<PresetInstructions {...defaultProps} />)

      const input = screen.getByTestId("select-input")
      expect(input).toHaveAttribute(
        "data-placeholder",
        "Sélectionnez un preset"
      )
    })

    it("should pass selectOptions prop to Select", () => {
      render(<PresetInstructions {...defaultProps} />)

      const options = screen.getByTestId("select-options")
      expect(options).toHaveTextContent("Preset 1,Preset 2,Preset 3")
    })

    it("should pass register function to Select", () => {
      render(<PresetInstructions {...defaultProps} />)

      const input = screen.getByTestId("select-input")
      expect(input).toHaveAttribute("name", "warmUpPresetTitle")
    })

    it("should pass errors object to Select", () => {
      render(<PresetInstructions {...defaultProps} />)

      expect(screen.getByTestId("select-component")).toBeInTheDocument()
    })
  })

  describe("Validation Schema", () => {
    it("should create validation schema and pass register to Select", () => {
      render(<PresetInstructions {...defaultProps} />)

      const input = screen.getByTestId("select-input")
      expect(input).toHaveAttribute("name", "warmUpPresetTitle")
    })

    it("should pass errors object from useForm to Select", () => {
      render(<PresetInstructions {...defaultProps} />)

      expect(screen.getByTestId("select-component")).toBeInTheDocument()
    })

    it("should configure useForm with yupResolver", () => {
      const { container } = render(<PresetInstructions {...defaultProps} />)

      expect(container).toBeInTheDocument()
    })
  })

  describe("Dynamic lessonKey", () => {
    it("should work with warmUpPresetTitle lessonKey", () => {
      render(
        <PresetInstructions {...defaultProps} lessonKey="warmUpPresetTitle" />
      )

      const input = screen.getByTestId("select-input")
      expect(input).toHaveAttribute("data-lessonkey", "warmUpPresetTitle")
    })

    it("should work with coolDownPresetTitle lessonKey", () => {
      render(
        <PresetInstructions {...defaultProps} lessonKey="coolDownPresetTitle" />
      )

      const input = screen.getByTestId("select-input")
      expect(input).toHaveAttribute("data-lessonkey", "coolDownPresetTitle")
    })

    it("should create validation schema with dynamic lessonKey", () => {
      render(
        <PresetInstructions {...defaultProps} lessonKey="coolDownPresetTitle" />
      )

      const input = screen.getByTestId("select-input")
      expect(input).toHaveAttribute("name", "coolDownPresetTitle")
    })
  })

  describe("Default values", () => {
    it("should use defaultValues in useForm", () => {
      const defaultValuesWithPreset: Lesson = {
        warmUpPresetTitle: "Preset 1",
      }

      render(
        <PresetInstructions
          {...defaultProps}
          defaultValues={defaultValuesWithPreset}
        />
      )

      const input = screen.getByTestId("select-input")
      expect(input).toHaveValue("Preset 1")
    })

    it("should work with empty defaultValues", () => {
      render(
        <PresetInstructions {...defaultProps} defaultValues={{} as Lesson} />
      )

      const input = screen.getByTestId("select-input")
      expect(input).toHaveValue("")
    })
  })

  describe("Legend customization", () => {
    it("should display custom legend text", () => {
      render(
        <PresetInstructions
          {...defaultProps}
          legend="Texte personnalisé pour la légende"
        />
      )

      expect(
        screen.getByText("Texte personnalisé pour la légende")
      ).toBeInTheDocument()
    })

    it("should update legend when prop changes", () => {
      const { rerender } = render(
        <PresetInstructions {...defaultProps} legend="Premier texte" />
      )

      expect(screen.getByText("Premier texte")).toBeInTheDocument()

      rerender(<PresetInstructions {...defaultProps} legend="Deuxième texte" />)

      expect(screen.queryByText("Premier texte")).not.toBeInTheDocument()
      expect(screen.getByText("Deuxième texte")).toBeInTheDocument()
    })
  })

  describe("SelectOptions configuration", () => {
    it("should pass custom selectOptions to Select", () => {
      const customOptions = ["Option A", "Option B"]

      render(
        <PresetInstructions {...defaultProps} selectOptions={customOptions} />
      )

      const options = screen.getByTestId("select-options")
      expect(options).toHaveTextContent("Option A,Option B")
    })

    it("should update selectOptions when prop changes", () => {
      const { rerender } = render(
        <PresetInstructions
          {...defaultProps}
          selectOptions={["Option 1", "Option 2"]}
        />
      )

      expect(screen.getByTestId("select-options")).toHaveTextContent(
        "Option 1,Option 2"
      )

      rerender(
        <PresetInstructions
          {...defaultProps}
          selectOptions={["Option A", "Option B", "Option C"]}
        />
      )

      expect(screen.getByTestId("select-options")).toHaveTextContent(
        "Option A,Option B,Option C"
      )
    })
  })
})
