import React from 'react'
import { customizationOptions, getOptionConflict } from '../utilities/carValidation'
import '../css/Customize.css'

const OptionPicker = ({ field, car, onSelect, onDone }) => {
    return (
        <div className='option-picker'>
            <div className='option-grid'>
                {customizationOptions[field].map((option) => {
                    const conflict = getOptionConflict(field, option.value, car)
                    const isSelected = car[field] === option.value

                    return (
                        <button
                            type='button'
                            key={option.value}
                            className={`option-tile${isSelected ? ' selected' : ''}`}
                            style={{ '--tile-color': option.hex }}
                            disabled={Boolean(conflict)}
                            onClick={() => onSelect(field, option.value)}
                        >
                            {option.icon && <span className='tile-icon'>{option.icon}</span>}
                            <span className='tile-info'>
                                <span>{option.label}</span>
                                <span>💵 ${option.price.toLocaleString()}</span>
                                {conflict && <small>{conflict}</small>}
                            </span>
                        </button>
                    )
                })}
            </div>
            <button type='button' className='picker-done' onClick={onDone}>Done</button>
        </div>
    )
}

export default OptionPicker
