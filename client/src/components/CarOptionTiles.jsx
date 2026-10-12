import React from 'react'
import { customizationCategories, findOption } from '../utilities/carValidation'
import '../css/Customize.css'

// Read-only tiles showing the option chosen in each category
const CarOptionTiles = ({ customization }) => {
    return customizationCategories.map(({ field, label }) => {
        const option = findOption(field, customization[field])

        return (
            <div
                key={field}
                className='summary-tile'
                style={{ '--tile-color': option?.hex }}
            >
                {option?.icon && <span className='tile-icon'>{option.icon}</span>}
                <span className='tile-caption'>{label}: {option?.label}</span>
            </div>
        )
    })
}

export default CarOptionTiles
