import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteCar, getCar } from '../services/CarsAPI'
import { calculatePrice, toCustomization } from '../utilities/carValidation'
import CarOptionTiles from '../components/CarOptionTiles'
import '../App.css'
import '../css/Customize.css'

const CarDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [car, setCar] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        getCar(id).then(setCar).catch((requestError) => setError(requestError.message))
    }, [id])

    const handleDelete = async () => {
        if (!window.confirm('Delete this custom car?')) return

        try {
            await deleteCar(id)
            navigate('/customcars')
        } catch (requestError) {
            setError(requestError.message)
        }
    }

    if (error) return <main className='page-content'><p className='form-error'>{error}</p></main>
    if (!car) return <main className='page-content'><p>Loading car...</p></main>

    const customization = toCustomization(car)
    const price = Number(car.total_price) || calculatePrice({ ...car, ...customization })

    return (
        <main className='page-content'>
            <article className='car-detail'>
                <header>
                    <h2>🚗 {car.year} {car.make} {car.model}</h2>
                    <p>{car.description}</p>
                </header>
                <div className='car-detail-body'>
                    <div className='car-detail-side'>
                        <p className='price-tag'>💰 ${price.toLocaleString()}</p>
                        <Link to={`/edit/${car.id}`} role='button'>Edit</Link>
                        <button type='button' onClick={handleDelete}>Delete</button>
                    </div>
                    <div className='summary-grid'>
                        <img
                            className='summary-tile car-photo'
                            src={car.image}
                            alt={`${car.year} ${car.make} ${car.model}`}
                        />
                        <CarOptionTiles customization={customization} />
                    </div>
                </div>
            </article>
        </main>
    )
}

export default CarDetails
