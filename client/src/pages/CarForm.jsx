import React, { useState } from 'react'
import {
    validateCar,
    calculatePrice,
    customizationOptions,
    defaultCustomization
} from '../utilities/carValidation'
import '../App.css'

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

    const handleChange = ({ target }) => {
        setCar((currentCar) => ({ ...currentCar, [target.name]: target.value }))
        setErrors((currentErrors) => ({ ...currentErrors, [target.name]: '' }))
    }

    const renderSelect = (name, label, options) => (
        <label>
            {label}
            <select name={name} value={car[name]} onChange={handleChange}>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label} (+${option.price.toLocaleString()})
                    </option>
                ))}
            </select>
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

    return (
        <main className='page-content'>
            <article>
                <header>
                    <h2>{submitLabel === 'Create Car' ? 'Customize a car' : 'Edit car'}</h2>
                    <p>Build your dream ride and save it to the garage.</p>
                </header>
                <form onSubmit={handleSubmit}>
                    <label>
                        Make
                        <input name='make' value={car.make} onChange={handleChange} placeholder='Ford' />
                        {errors.make && <small className='form-error'>{errors.make}</small>}
                    </label>
                    <label>
                        Model
                        <input name='model' value={car.model} onChange={handleChange} placeholder='Mustang' />
                        {errors.model && <small className='form-error'>{errors.model}</small>}
                    </label>
                    <label>
                        Year
                        <input name='year' type='number' value={car.year} onChange={handleChange} placeholder='2024' />
                        {errors.year && <small className='form-error'>{errors.year}</small>}
                    </label>
                    <label>
                        Image URL
                        <input name='image' type='url' value={car.image} onChange={handleChange} placeholder='https://...' />
                        {errors.image && <small className='form-error'>{errors.image}</small>}
                    </label>
                    <label>
                        Description
                        <textarea name='description' value={car.description} onChange={handleChange} placeholder='Describe the custom build.' />
                        {errors.description && <small className='form-error'>{errors.description}</small>}
                    </label>
                    <h3>Customize your build</h3>
                    {renderSelect('exteriorColor', 'Exterior color', customizationOptions.exteriorColor)}
                    {renderSelect('wheelStyle', 'Wheel style', customizationOptions.wheelStyle)}
                    {renderSelect('interior', 'Interior', customizationOptions.interior)}
                    {renderSelect('trimPackage', 'Trim package', customizationOptions.trimPackage)}
                    {errors.customization && <p className='form-error'>{errors.customization}</p>}
                    <div
                        className='car-preview'
                        style={{
                            '--preview-color': customizationOptions.exteriorColor
                                .find((option) => option.value === car.exteriorColor)?.hex
                        }}
                    >
                        <span className='preview-car'>🚘</span>
                        <span>{car.wheelStyle} wheels</span>
                    </div>
                    {car.year && !errors.year && (
                        <p className='price-summary'>Total estimated price: ${calculatePrice(car).toLocaleString()}</p>
                    )}
                    {requestError && <p className='form-error'>{requestError}</p>}
                    <button type='submit'>{submitLabel}</button>
                </form>
            </article>
        </main>
    )
}

export default CarForm
