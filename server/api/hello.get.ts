export default defineEventHandler(async (event) => {
    console.log('HELLO')
    return {
        msg: 'Hello World'
    }
})