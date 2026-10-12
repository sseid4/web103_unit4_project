import { pool } from '../config/database.js'

const allowedOptions = {
    exteriorColor: ['red', 'blue', 'black', 'silver'],
    wheelStyle: ['standard', 'sport', 'offroad'],
    interior: ['cloth', 'leather', 'carbon'],
    trimPackage: ['basic', 'premium', 'performance']
}

const validateCustomization = (car) => {
    const invalidField = Object.entries(allowedOptions).find(
        ([field, values]) => !values.includes(car[field])
    )

    if (invalidField) return `Invalid ${invalidField[0]} option`
    if (car.trimPackage === 'performance' && car.wheelStyle === 'standard') {
        return 'Performance trim requires sport or off-road wheels'
    }
    return null
}

const optionPrices = {
    exteriorColor: { red: 0, blue: 500, black: 750, silver: 1000 },
    wheelStyle: { standard: 0, sport: 1500, offroad: 2200 },
    interior: { cloth: 0, leather: 1800, carbon: 3200 },
    trimPackage: { basic: 0, premium: 2500, performance: 4500 }
}

const calculatePrice = (car) => {
    const basePrice = Math.max(5000, 45000 - Math.max(0, new Date().getFullYear() - Number(car.year)) * 2500)
    return basePrice + Object.entries(optionPrices).reduce(
        (total, [field, prices]) => total + prices[car[field]],
        0
    )
}

export const getCars = async (_, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM cars ORDER BY id')
        res.status(200).json(rows)
    } catch (error) {
        console.error('Unable to get cars:', error)
        res.status(500).json({ error: 'Unable to get cars' })
    }
}

export const getCar = async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT * FROM cars WHERE id = $1',
            [req.params.id]
        )

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Car not found' })
        }

        res.status(200).json(rows[0])
    } catch (error) {
        console.error('Unable to get car:', error)
        res.status(500).json({ error: 'Unable to get car' })
    }
}

export const createCar = async (req, res) => {
    const { make, model, year, image, description, exteriorColor, wheelStyle, interior, trimPackage } = req.body
    const customizationError = validateCustomization({ exteriorColor, wheelStyle, interior, trimPackage })
    if (customizationError) return res.status(400).json({ error: customizationError })

    try {
        const { rows } = await pool.query(
            `INSERT INTO cars (
                make, model, year, image, description, exterior_color,
                wheel_style, interior, trim_package, total_price
             )
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             RETURNING *`,
            [
                make, model, year, image, description, exteriorColor, wheelStyle,
                interior, trimPackage, calculatePrice(req.body)
            ]
        )

        res.status(201).json(rows[0])
    } catch (error) {
        console.error('Unable to create car:', error)
        res.status(500).json({ error: 'Unable to create car' })
    }
}

export const editCar = async (req, res) => {
    const { make, model, year, image, description, exteriorColor, wheelStyle, interior, trimPackage } = req.body
    const customizationError = validateCustomization({ exteriorColor, wheelStyle, interior, trimPackage })
    if (customizationError) return res.status(400).json({ error: customizationError })

    try {
        const { rows } = await pool.query(
            `UPDATE cars
             SET make = $1, model = $2, year = $3, image = $4, description = $5,
                 exterior_color = $6, wheel_style = $7, interior = $8,
                 trim_package = $9, total_price = $10
             WHERE id = $11
             RETURNING *`,
            [
                make, model, year, image, description, exteriorColor, wheelStyle,
                interior, trimPackage, calculatePrice(req.body), req.params.id
            ]
        )

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Car not found' })
        }

        res.status(200).json(rows[0])
    } catch (error) {
        console.error('Unable to edit car:', error)
        res.status(500).json({ error: 'Unable to edit car' })
    }
}

export const deleteCar = async (req, res) => {
    try {
        const { rows } = await pool.query(
            'DELETE FROM cars WHERE id = $1 RETURNING *',
            [req.params.id]
        )

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Car not found' })
        }

        res.status(200).json(rows[0])
    } catch (error) {
        console.error('Unable to delete car:', error)
        res.status(500).json({ error: 'Unable to delete car' })
    }
}
