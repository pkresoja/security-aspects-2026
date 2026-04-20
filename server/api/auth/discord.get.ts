// URL: /api/auth/discord

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)
    const state = crypto.randomUUID()

    setCookie(event, 'discord_oauth_state', state, {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        path: '/',
        maxAge: 10 * 60
    })

    const params = new URLSearchParams({
        client_id: config.public.discordClientId,
        redirect_uri: config.public.discordRedirectUrl,
        response_type: 'code',
        scope: 'identify email',
        state,
        prompt: 'consent'
    })

    return sendRedirect(event, `https://discord.com/oauth2/authorize?${params.toString()}`)
})