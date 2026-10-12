import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllCars } from '../services/CarsAPI'
import { customizationCategories, findOption, toCustomization } from '../utilities/carValidation'
import '../App.css'
import '../css/Customize.css'

const ViewCars = () => {
    const [cars, setCars] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        getAllCars().then(setCars).catch((requestError) => setError(requestError.message))
    }, [])

    return (
        <main className='page-content'>
            {error && <p className='form-error'>{error}</p>}
            {!error && cars.length === 0 && (
                <article><p>No cars yet. Create your first custom build.</p></article>
            )}
            {cars.map((car) => {
                const customization = toCustomization(car)

                return (
                    <article key={car.id} className='car-card'>
                        <header>
                            <h3>🚗 {car.year} {car.make} {car.model}</h3>
                        </header>
                        <div className='car-card-body'>
                            <div className='car-specs'>
                                {customizationCategories.map(({ field, label, icon }) => (
                                    <p key={field}>
                                        {icon} <strong>{label}:</strong> {findOption(field, customization[field])?.label}
                                    </p>
                                ))}
                            </div>
                            <div className='car-card-actions'>
                                <p className='price-tag'>💰 ${Number(car.total_price).toLocaleString()}</p>
                                <Link to={`/customcars/${car.id}`} role='button'>Details</Link>
                            </div>
                        </div>
                    </article>
                )
            })}
        </main>
    )
}

export default ViewCars
