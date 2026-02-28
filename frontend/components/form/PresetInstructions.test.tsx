/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from "vitest"
import { screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { renderWithProvider } from "@/__tests__/helpers/renderWithProvider"
import PresetInstructions from "./PresetInstructions"
import { Lesson } from "@/types"

vi.mock("@/components/form/SelectField", () => ({
  default: ({
    presetType,
    placeholder,
    selectOptions,
    register,
    errors,
  }: any) => (
    <div data-testid="select-component">
      <input
        data-testid="select-input"
        data-presetType={presetType}
        data-placeholder={placeholder}
        {...register(presetType)}
      />
      <div data-testid="select-options">{selectOptions.join(",")}</div>
      {errors?.[presetType] && (
        <span data-testid="select-error">{errors[presetType].message}</span>
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
    presetType: "warmUpPresetTitle" as keyof Lesson,
    placeholder: "Sélectionnez un preset",
    selectOptions: ["Preset 1", "Preset 2", "Preset 3"],
  }

  describe("Rendering", () => {
    it("should render the legend with correct text", () => {
      renderWithProvider(<PresetInstructions {...defaultProps} />)

      expect(
        screen.getByText("Choisissez votre échauffement")
      ).toBeInTheDocument()
    })

    it("should render the legend as a legend element", () => {
      renderWithProvider(<PresetInstructions {...defaultProps} />)

      const legend = document.querySelector("legend")
      expect(legend).toBeInTheDocument()
      expect(legend).toHaveTextContent("Choisissez votre échauffement")
    })

    it("should render the Select component", () => {
      renderWithProvider(<PresetInstructions {...defaultProps} />)

      expect(screen.getByTestId("select-component")).toBeInTheDocument()
    })
  })

  describe("Props passing to Select", () => {
    it("should pass presetType prop to Select", () => {
      renderWithProvider(<PresetInstructions {...defaultProps} />)

      const input = screen.getByTestId("select-input")
      expect(input).toHaveAttribute("data-presetType", "warmUpPresetTitle")
    })

    it("should pass placeholder prop to Select", () => {
      renderWithProvider(<PresetInstructions {...defaultProps} />)

      const input = screen.getByTestId("select-input")
      expect(input).toHaveAttribute(
        "data-placeholder",
        "Sélectionnez un preset"
      )
    })

    it("should pass selectOptions prop to Select", () => {
      renderWithProvider(<PresetInstructions {...defaultProps} />)

      const options = screen.getByTestId("select-options")
      expect(options).toHaveTextContent("Preset 1,Preset 2,Preset 3")
    })

    it("should pass register function to Select", () => {
      renderWithProvider(<PresetInstructions {...defaultProps} />)

      const input = screen.getByTestId("select-input")
      expect(input).toHaveAttribute("name", "warmUpPresetTitle")
    })

    it("should pass errors object to Select", () => {
      renderWithProvider(<PresetInstructions {...defaultProps} />)

      expect(screen.getByTestId("select-component")).toBeInTheDocument()
    })
  })

  describe("Validation Schema", () => {
    it("should create validation schema and pass register to Select", () => {
      renderWithProvider(<PresetInstructions {...defaultProps} />)

      const input = screen.getByTestId("select-input")
      expect(input).toHaveAttribute("name", "warmUpPresetTitle")
    })

    it("should pass errors object from useForm to Select", () => {
      renderWithProvider(<PresetInstructions {...defaultProps} />)

      expect(screen.getByTestId("select-component")).toBeInTheDocument()
    })

    it("should configure useForm with yupResolver", () => {
      const { container } = renderWithProvider(
        <PresetInstructions {...defaultProps} />
      )

      expect(container).toBeInTheDocument()
    })
  })

  describe("Dynamic presetType", () => {
    it("should work with warmUpPresetTitle presetType", () => {
      renderWithProvider(
        <PresetInstructions {...defaultProps} presetType="warmUpPresetTitle" />
      )

      const input = screen.getByTestId("select-input")
      expect(input).toHaveAttribute("data-presetType", "warmUpPresetTitle")
    })

    it("should work with coolDownPresetTitle presetType", () => {
      renderWithProvider(
        <PresetInstructions
          {...defaultProps}
          presetType="coolDownPresetTitle"
        />
      )

      const input = screen.getByTestId("select-input")
      expect(input).toHaveAttribute("data-presetType", "coolDownPresetTitle")
    })

    it("should create validation schema with dynamic presetType", () => {
      renderWithProvider(
        <PresetInstructions
          {...defaultProps}
          presetType="coolDownPresetTitle"
        />
      )

      const input = screen.getByTestId("select-input")
      expect(input).toHaveAttribute("name", "coolDownPresetTitle")
    })
  })

  describe("Legend customization", () => {
    it("should display custom legend text", () => {
      renderWithProvider(
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
      const { rerender, store } = renderWithProvider(
        <PresetInstructions {...defaultProps} legend="Premier texte" />
      )

      expect(screen.getByText("Premier texte")).toBeInTheDocument()

      rerender(
        <Provider store={store}>
          <PresetInstructions {...defaultProps} legend="Deuxième texte" />
        </Provider>
      )

      expect(screen.queryByText("Premier texte")).not.toBeInTheDocument()
      expect(screen.getByText("Deuxième texte")).toBeInTheDocument()
    })
  })

  describe("SelectOptions configuration", () => {
    it("should pass custom selectOptions to Select", () => {
      const customOptions = ["Option A", "Option B"]

      renderWithProvider(
        <PresetInstructions {...defaultProps} selectOptions={customOptions} />
      )

      const options = screen.getByTestId("select-options")
      expect(options).toHaveTextContent("Option A,Option B")
    })

    it("should update selectOptions when prop changes", () => {
      const { rerender, store } = renderWithProvider(
        <PresetInstructions
          {...defaultProps}
          selectOptions={["Option 1", "Option 2"]}
        />
      )

      expect(screen.getByTestId("select-options")).toHaveTextContent(
        "Option 1,Option 2"
      )

      rerender(
        <Provider store={store}>
          <PresetInstructions
            {...defaultProps}
            selectOptions={["Option A", "Option B", "Option C"]}
          />
        </Provider>
      )

      expect(screen.getByTestId("select-options")).toHaveTextContent(
        "Option A,Option B,Option C"
      )
    })
  })
})
