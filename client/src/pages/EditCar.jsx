import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CarForm from './CarForm'
import { getCar, editCar } from '../services/CarsAPI'
import { toCustomization } from '../utilities/carValidation'

const EditCar = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [car, setCar] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        getCar(id)
            .then((savedCar) => setCar({ ...savedCar, ...toCustomization(savedCar) }))
            .catch((requestError) => setError(requestError.message))
    }, [id])

    if (error) return <main className='page-content'><p className='form-error'>{error}</p></main>
    if (!car) return <main className='page-content'><p>Loading car...</p></main>

    return (
        <CarForm
            initialCar={car}
            submitLabel='Save Changes'
            onSubmit={async (updatedCar) => {
                await editCar(id, updatedCar)
                navigate(`/customcars/${id}`)
            }}
        />
    )
}

export default EditCar
