import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteCar, getCar } from '../services/CarsAPI'
import { calculatePrice } from '../utilities/carValidation'
import '../App.css'

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

    return (
        <main className='page-content'>
            <article>
                <img className='car-detail-image' src={car.image} alt={`${car.year} ${car.make} ${car.model}`} />
                <h2>{car.year} {car.make} {car.model}</h2>
                <p>{car.description}</p>
                <div
                    className='car-preview detail-preview'
                    style={{ '--preview-color': car.exterior_color }}
                >
                    <span className='preview-car'>🚘</span>
                    <span>{car.exterior_color} exterior · {car.wheel_style} wheels</span>
                </div>
                <p>Interior: {car.interior}</p>
                <p>Trim package: {car.trim_package}</p>
                <p className='price-summary'>
                    Total price: ${(Number(car.total_price) || calculatePrice(car)).toLocaleString()}
                </p>
                <Link to={`/edit/${car.id}`} role='button'>Edit</Link>
                <button type='button' onClick={handleDelete}>Delete</button>
            </article>
        </main>
    )
}

export default CarDetails
