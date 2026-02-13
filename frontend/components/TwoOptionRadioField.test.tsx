import TwoOptionRadioField from "./TwoOptionRadioField"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

describe("TwoOptionRadioField", () => {
  // Mock props
  const mockWatch = vi.fn()
  const mockSetValue = vi.fn()

  const defaultProps = {
    name: "warmUp" as const,
    legend: "Choisissez une option",
    title1: "Option personnalisée",
    title2: "Option prédéfinie",
    subtitle2: "Utiliser un modèle existant",
    watch: mockWatch,
    setValue: mockSetValue,
    errors: {},
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Default value: "custom"
    mockWatch.mockReturnValue("custom")
  })

  it("default value is custom", () => {
    // Arrange
    render(<TwoOptionRadioField {...defaultProps} />)

    // Assert
    const customRadio = screen.getByRole("radio", {
      name: /option personnalisée/i,
    })
    const presetRadio = screen.getByRole("radio", {
      name: /option prédéfinie/i,
    })

    expect(customRadio).toBeChecked()
    expect(presetRadio).not.toBeChecked()
  })

  describe("choice changes when clicking on any part of the field", () => {
    it("click on FieldLabel changes selection", async () => {
      // Arrange
      const user = userEvent.setup()
      render(<TwoOptionRadioField {...defaultProps} />)

      // Act - Click on "preset" label
      const presetLabel = screen.getByLabelText(/option prédéfinie/i)
      await user.click(presetLabel)

      // Assert
      expect(mockSetValue).toHaveBeenCalledWith("warmUp", "preset")
    })

    it("click on FieldTitle changes selection", async () => {
      // Arrange
      const user = userEvent.setup()
      render(<TwoOptionRadioField {...defaultProps} />)

      // Act - Click on title
      const presetTitle = screen.getByText(/option prédéfinie/i)
      await user.click(presetTitle)

      // Assert
      expect(mockSetValue).toHaveBeenCalledWith("warmUp", "preset")
    })

    it("click on FieldDescription changes selection", async () => {
      // Arrange
      const user = userEvent.setup()
      render(<TwoOptionRadioField {...defaultProps} />)

      // Act - Click on description
      const presetDescription = screen.getByText(/utiliser un modèle existant/i)
      await user.click(presetDescription)

      // Assert
      expect(mockSetValue).toHaveBeenCalledWith("warmUp", "preset")
    })

    it("click on RadioGroupItem changes selection", async () => {
      // Arrange
      const user = userEvent.setup()
      render(<TwoOptionRadioField {...defaultProps} />)

      // Act - Click directly on radio button
      const presetRadio = screen.getByRole("radio", {
        name: /option prédéfinie/i,
      })
      await user.click(presetRadio)

      // Assert
      expect(mockSetValue).toHaveBeenCalledWith("warmUp", "preset")
    })
  })

  it("can change from preset to custom", async () => {
    // Arrange
    const user = userEvent.setup()
    mockWatch.mockReturnValue("preset") // Start with preset
    render(<TwoOptionRadioField {...defaultProps} />)

    // Act - Click on "custom"
    const customRadio = screen.getByRole("radio", {
      name: /option personnalisée/i,
    })
    await user.click(customRadio)

    // Assert
    expect(mockSetValue).toHaveBeenCalledWith("warmUp", "custom")
  })

  it("displays error message when present", () => {
    // Arrange
    const propsWithError = {
      ...defaultProps,
      errors: {
        warmUp: { message: "Ce champ est requis", type: "required" },
      },
    }

    render(<TwoOptionRadioField {...propsWithError} />)

    // Assert
    expect(screen.getByText(/ce champ est requis/i)).toBeInTheDocument()
  })
})
