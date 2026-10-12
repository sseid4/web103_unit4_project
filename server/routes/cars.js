import express from 'express'
import {
    getCars,
    getCar,
    createCar,
    editCar,
    deleteCar
} from '../controllers/cars.js'

const router = express.Router()

router.get('/', getCars)
router.get('/:id', getCar)
router.post('/', createCar)
router.put('/:id', editCar)
router.delete('/:id', deleteCar)

export default router
