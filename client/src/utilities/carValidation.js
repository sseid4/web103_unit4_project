export const customizationOptions = {
    exteriorColor: [
        { value: 'red', label: 'Red', price: 0, hex: '#b91c1c' },
        { value: 'blue', label: 'Blue', price: 500, hex: '#2563eb' },
        { value: 'black', label: 'Black', price: 750, hex: '#171717' },
        { value: 'silver', label: 'Silver', price: 1000, hex: '#a8a29e' }
    ],
    wheelStyle: [
        { value: 'standard', label: 'Standard wheels', price: 0, hex: '#3f3f46', icon: '🛞' },
        { value: 'sport', label: 'Sport wheels', price: 1500, hex: '#7f1d1d', icon: '🏁' },
        { value: 'offroad', label: 'Off-road wheels', price: 2200, hex: '#57534e', icon: '⛰️' }
    ],
    interior: [
        { value: 'cloth', label: 'Cloth', price: 0, hex: '#78716c', icon: '🧵' },
        { value: 'leather', label: 'Leather', price: 1800, hex: '#7c2d12', icon: '💺' },
        { value: 'carbon', label: 'Carbon fiber', price: 3200, hex: '#27272a', icon: '🖤' }
    ],
    trimPackage: [
        { value: 'basic', label: 'Basic', price: 0, hex: '#52525b', icon: '🚗' },
        { value: 'premium', label: 'Premium', price: 2500, hex: '#a16207', icon: '⭐' },
        { value: 'performance', label: 'Performance', price: 4500, hex: '#991b1b', icon: '⚡' }
    ]
}

export const customizationCategories = [
    { field: 'exteriorColor', label: 'Exterior', icon: '🖌️' },
    { field: 'wheelStyle', label: 'Wheels', icon: '🛞' },
    { field: 'interior', label: 'Interior', icon: '💺' },
    { field: 'trimPackage', label: 'Trim', icon: '😎' }
]

export const findOption = (field, value) =>
    customizationOptions[field].find((option) => option.value === value)

// Returns a reason the option can't be combined with the current build, or ''
export const getOptionConflict = (field, value, car) => {
    if (field === 'trimPackage' && value === 'performance' && car.wheelStyle === 'standard') {
        return 'Needs sport or off-road wheels'
    }
    if (field === 'wheelStyle' && value === 'standard' && car.trimPackage === 'performance') {
        return 'Not with performance trim'
    }
    return ''
}

// Maps a car row from the database (snake_case) to the form's field names
export const toCustomization = (car) => ({
    exteriorColor: car.exterior_color || defaultCustomization.exteriorColor,
    wheelStyle: car.wheel_style || defaultCustomization.wheelStyle,
    interior: car.interior || defaultCustomization.interior,
    trimPackage: car.trim_package || defaultCustomization.trimPackage
})

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
