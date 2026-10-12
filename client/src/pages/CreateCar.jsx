import React from 'react'
import { useNavigate } from 'react-router-dom'
import CarForm from './CarForm'
import { createCar } from '../services/CarsAPI'

const CreateCar = () => {
    const navigate = useNavigate()

    return (
        <CarForm
            submitLabel='Create Car'
            onSubmit={async (car) => {
                const createdCar = await createCar(car)
                navigate(`/customcars/${createdCar.id}`)
            }}
        />
    )
}

export default CreateCar
