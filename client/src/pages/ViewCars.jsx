import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteCar, getAllCars } from '../services/CarsAPI'
import '../App.css'

const ViewCars = () => {
    const [cars, setCars] = useState([])
    const [error, setError] = useState('')

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this custom car?')) return

        try {
            await deleteCar(id)
            setCars((currentCars) => currentCars.filter((car) => car.id !== id))
        } catch (requestError) {
            setError(requestError.message)
        }
    }

    useEffect(() => {
        getAllCars().then(setCars).catch((requestError) => setError(requestError.message))
    }, [])

    return (
        <main className='page-content'>
            <h2>Custom garage</h2>
            {error && <p className='form-error'>{error}</p>}
            {!error && cars.length === 0 && <p>No cars yet. Create your first custom build.</p>}
            <section className='car-grid'>
                {cars.map((car) => (
                    <article key={car.id}>
                        <img src={car.image} alt={`${car.year} ${car.make} ${car.model}`} />
                        <h3>{car.year} {car.make} {car.model}</h3>
                        <p>{car.description}</p>
                        <p>
                            {car.exterior_color} exterior · {car.wheel_style} wheels · {car.trim_package} trim
                        </p>
                        <p className='price-summary'>${Number(car.total_price).toLocaleString()}</p>
                        <Link to={`/customcars/${car.id}`} role='button'>View Details</Link>
                        <Link to={`/edit/${car.id}`} role='button'>Edit</Link>
                        <button type='button' onClick={() => handleDelete(car.id)}>Delete</button>
                    </article>
                ))}
            </section>
        </main>
    )
}

export default ViewCars
