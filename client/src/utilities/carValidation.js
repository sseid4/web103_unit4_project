export const customizationOptions = {
    exteriorColor: [
        { value: 'red', label: 'Red', price: 0, hex: '#b91c1c' },
        { value: 'blue', label: 'Blue', price: 500, hex: '#2563eb' },
        { value: 'black', label: 'Black', price: 750, hex: '#171717' },
        { value: 'silver', label: 'Silver', price: 1000, hex: '#a8a29e' }
    ],
    wheelStyle: [
        { value: 'standard', label: 'Standard wheels', price: 0 },
        { value: 'sport', label: 'Sport wheels', price: 1500 },
        { value: 'offroad', label: 'Off-road wheels', price: 2200 }
    ],
    interior: [
        { value: 'cloth', label: 'Cloth', price: 0 },
        { value: 'leather', label: 'Leather', price: 1800 },
        { value: 'carbon', label: 'Carbon fiber', price: 3200 }
    ],
    trimPackage: [
        { value: 'basic', label: 'Basic', price: 0 },
        { value: 'premium', label: 'Premium', price: 2500 },
        { value: 'performance', label: 'Performance', price: 4500 }
    ]
}

export const defaultCustomization = {
    exteriorColor: 'red',
    wheelStyle: 'standard',
    interior: 'cloth',
    trimPackage: 'basic'
}

export const validateCar = ({
    make,
    model,
    year,
    image,
    description,
    exteriorColor,
    wheelStyle,
    interior,
    trimPackage
}) => {
    const errors = {}
    const currentYear = new Date().getFullYear()

    if (!make.trim()) errors.make = 'Make is required.'
    if (!model.trim()) errors.model = 'Model is required.'
    if (!year || Number(year) < 1886 || Number(year) > currentYear + 1) {
        errors.year = `Year must be between 1886 and ${currentYear + 1}.`
    }
    if (!image.trim()) errors.image = 'Image URL is required.'
    if (!description.trim()) errors.description = 'Description is required.'
    if (!customizationOptions.exteriorColor.some((option) => option.value === exteriorColor)) {
        errors.exteriorColor = 'Choose a valid exterior color.'
    }
    if (!customizationOptions.wheelStyle.some((option) => option.value === wheelStyle)) {
        errors.wheelStyle = 'Choose a valid wheel style.'
    }
    if (!customizationOptions.interior.some((option) => option.value === interior)) {
        errors.interior = 'Choose a valid interior.'
    }
    if (!customizationOptions.trimPackage.some((option) => option.value === trimPackage)) {
        errors.trimPackage = 'Choose a valid trim package.'
    }
    if (trimPackage === 'performance' && wheelStyle === 'standard') {
        errors.customization = 'Performance trim requires sport or off-road wheels.'
    }

    return errors
}

const optionPrice = (options, value) =>
    options.find((option) => option.value === value)?.price || 0

export const calculatePrice = ({
    year,
    exteriorColor = defaultCustomization.exteriorColor,
    wheelStyle = defaultCustomization.wheelStyle,
    interior = defaultCustomization.interior,
    trimPackage = defaultCustomization.trimPackage
}) => {
    const age = Math.max(0, new Date().getFullYear() - Number(year))
    const basePrice = Math.max(5000, 45000 - age * 2500)

    return basePrice +
        optionPrice(customizationOptions.exteriorColor, exteriorColor) +
        optionPrice(customizationOptions.wheelStyle, wheelStyle) +
        optionPrice(customizationOptions.interior, interior) +
        optionPrice(customizationOptions.trimPackage, trimPackage)
}
