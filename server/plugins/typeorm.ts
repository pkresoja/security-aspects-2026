import 'reflect-metadata'
import { AppDataSource } from '../db/data-source'

let initialized = false

export default defineNitroPlugin(async () => {
    if (!initialized) {
        await AppDataSource.initialize()
        initialized = true
        console.log('Database connected')
    }
})