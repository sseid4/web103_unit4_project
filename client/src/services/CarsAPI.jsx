const carsURL = '/api/cars'

const request = async (url, options = {}) => {
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error || 'Unable to complete car request')
    }

    return data
}

export const getAllCars = () => request(carsURL)

export const getCar = (id) => request(`${carsURL}/${id}`)

export const createCar = (car) =>
    request(carsURL, {
        method: 'POST',
        body: JSON.stringify(car)
    })

export const editCar = (id, car) =>
    request(`${carsURL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(car)
    })

export const deleteCar = (id) =>
    request(`${carsURL}/${id}`, {
        method: 'DELETE'
    })
