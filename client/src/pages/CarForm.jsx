import React, { useState } from 'react'
import {
    validateCar,
    calculatePrice,
    customizationCategories,
    defaultCustomization
} from '../utilities/carValidation'
import OptionPicker from '../components/OptionPicker'
import CarOptionTiles from '../components/CarOptionTiles'
import '../App.css'
import '../css/Customize.css'

export const emptyCar = {
    make: '',
    model: '',
    year: '',
    image: '',
    description: '',
    ...defaultCustomization
}

const CarForm = ({ initialCar = emptyCar, submitLabel, onSubmit }) => {
    const [car, setCar] = useState({ ...emptyCar, ...initialCar })
    const [errors, setErrors] = useState({})
    const [requestError, setRequestError] = useState('')
    const [openCategory, setOpenCategory] = useState(null)

    const handleChange = ({ target }) => {
        setCar((currentCar) => ({ ...currentCar, [target.name]: target.value }))
        setErrors((currentErrors) => ({ ...currentErrors, [target.name]: '' }))
    }

    const handleSelectOption = (field, value) => {
        setCar((currentCar) => ({ ...currentCar, [field]: value }))
        setErrors((currentErrors) => ({ ...currentErrors, [field]: '', customization: '' }))
    }

    const renderInput = (name, label, props = {}) => (
        <label className={name === 'description' ? 'full-width' : ''}>
            {label}
            {name === 'description'
                ? <textarea name={name} value={car[name]} onChange={handleChange} {...props} />
                : <input name={name} value={car[name]} onChange={handleChange} {...props} />}
            {errors[name] && <small className='form-error'>{errors[name]}</small>}
        </label>
    )

    const handleSubmit = async (event) => {
        event.preventDefault()
        const validationErrors = validateCar(car)

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        try {
            setRequestError('')
            await onSubmit({ ...car, year: Number(car.year) })
        } catch (error) {
            setRequestError(error.message)
        }
    }

    const optionErrors = customizationCategories
        .map(({ field }) => errors[field])
        .concat(errors.customization)
        .filter(Boolean)

    // Price uses the current year until one is entered
    const price = calculatePrice({ ...car, year: car.year || new Date().getFullYear() })

    return (
        <main className='page-content customize-page'>
            <form onSubmit={handleSubmit}>
                <div className='customize-toolbar'>
                    <div className='category-buttons'>
                        {customizationCategories.map(({ field, label }) => (
                            <button
                                type='button'
                                key={field}
                                className={openCategory === field ? 'active' : ''}
                                onClick={() => setOpenCategory(openCategory === field ? null : field)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                    <button type='submit'>{submitLabel}</button>

                    {openCategory && (
                        <OptionPicker
                            field={openCategory}
                            car={car}
                            onSelect={handleSelectOption}
                            onDone={() => setOpenCategory(null)}
                        />
                    )}
                </div>

                {optionErrors.map((message) => <p key={message} className='form-error'>{message}</p>)}
                {requestError && <p className='form-error'>{requestError}</p>}

                <article className='customize-card'>
                    <header>
                        <h2>🏎️ {submitLabel === 'Create Car' ? 'Customize a car' : 'Edit car'}</h2>
                    </header>
                    <div className='form-grid'>
                        {renderInput('make', 'Make', { placeholder: 'Chevrolet' })}
                        {renderInput('model', 'Model', { placeholder: 'Corvette' })}
                        {renderInput('year', 'Year', { type: 'number', placeholder: '2024' })}
                        {renderInput('image', 'Image URL', { type: 'url', placeholder: 'https://...' })}
                        {renderInput('description', 'Description', { placeholder: 'Describe the custom build.' })}
                    </div>
                    <div className='summary-grid'>
                        <CarOptionTiles customization={car} />
                    </div>
                </article>
            </form>

            <div className='price-box'>💰 ${price.toLocaleString()}</div>
        </main>
    )
}

export default CarForm
