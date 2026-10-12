import { pool } from './database.js'

export const initializeDatabase = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS cars (
            id SERIAL PRIMARY KEY,
            make VARCHAR(100) NOT NULL,
            model VARCHAR(100) NOT NULL,
            year INTEGER NOT NULL,
            image TEXT NOT NULL,
            description TEXT NOT NULL,
            exterior_color VARCHAR(20) NOT NULL DEFAULT 'red',
            wheel_style VARCHAR(20) NOT NULL DEFAULT 'standard',
            interior VARCHAR(20) NOT NULL DEFAULT 'cloth',
            trim_package VARCHAR(20) NOT NULL DEFAULT 'basic',
            total_price INTEGER NOT NULL DEFAULT 0
        );

        ALTER TABLE cars
        ADD COLUMN IF NOT EXISTS exterior_color VARCHAR(20) NOT NULL DEFAULT 'red',
        ADD COLUMN IF NOT EXISTS wheel_style VARCHAR(20) NOT NULL DEFAULT 'standard',
        ADD COLUMN IF NOT EXISTS interior VARCHAR(20) NOT NULL DEFAULT 'cloth',
        ADD COLUMN IF NOT EXISTS trim_package VARCHAR(20) NOT NULL DEFAULT 'basic',
        ADD COLUMN IF NOT EXISTS total_price INTEGER NOT NULL DEFAULT 0
    `)

    await pool.query(`
        INSERT INTO cars (
            make, model, year, image, description, exterior_color,
            wheel_style, interior, trim_package, total_price
        )
        SELECT seed.make, seed.model, seed.year, seed.image, seed.description,
               seed.exterior_color, seed.wheel_style, seed.interior,
               seed.trim_package, seed.total_price
        FROM (
            VALUES
                (
                    'Ford', 'Mustang GT', 2024,
                    'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1200&q=80',
                    'A bold performance build with a modern street presence.',
                    'red', 'sport', 'leather', 'performance', 56250
                ),
                (
                    'Toyota', 'Supra', 2023,
                    'https://images.unsplash.com/photo-1553440569-b5a0b8d1c8f6?auto=format&fit=crop&w=1200&q=80',
                    'A streamlined coupe configured for spirited weekend drives.',
                    'blue', 'sport', 'carbon', 'premium', 53200
                ),
                (
                    'Jeep', 'Wrangler', 2022,
                    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
                    'An off-road-ready build with durable wheels and premium trim.',
                    'black', 'offroad', 'cloth', 'premium', 47750
                ),
                (
                    'Porsche', '911 Carrera', 2024,
                    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
                    'A refined silver sports car with a performance-focused setup.',
                    'silver', 'sport', 'leather', 'performance', 61250
                ),
                (
                    'Tesla', 'Model 3', 2023,
                    'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80',
                    'A clean electric sedan with a premium interior and smooth finish.',
                    'blue', 'standard', 'leather', 'premium', 50300
                )
        ) AS seed(
            make, model, year, image, description, exterior_color,
            wheel_style, interior, trim_package, total_price
        )
        WHERE NOT EXISTS (
            SELECT 1
            FROM cars existing
            WHERE existing.make = seed.make
              AND existing.model = seed.model
        )
    `)
}
