import { AppDataSource } from "~~/server/db/data-source"
import { User } from "~~/server/db/entities/User"

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)
    const query = getQuery(event)

    const code = query.code as string
    const state = query.state
    const savedState = getCookie(event, 'discord_oauth_state')

    deleteCookie(event, 'discord_oauth_state')

    const body = new URLSearchParams({
        client_id: config.public.discordClientId,
        client_secret: config.discordClientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.public.discordRedirectUrl
    })

    const discordApiBase = 'https://discord.com/api'

    const token = await $fetch<any>(`${discordApiBase}/oauth2/token`, {
        method: 'POST',
        body,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })

    const discordUser = await $fetch<any>(`${discordApiBase}/users/@me`, {
        headers: {
            'Authorization': `${token.token_type} ${token.access_token}`
        }
    })

    const avatarUrl = discordUser.avatar ?
        `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}` :
        `https://cdn.discordapp.com/embed/avatars/0.png`

    const repo = AppDataSource.getRepository(User)
    const existing = await repo.findOneBy({
        discordId: discordUser.id
    })

    if (existing) {
        existing.userName = discordUser.username
        existing.displayName = discordUser.global_name
        existing.avatarUrl = avatarUrl
        existing.lastLoginAt = new Date()
        await repo.save(existing)
    } else {
        await repo.save({
            discordId: discordUser.id,
            userName: discordUser.username,
            displayName: discordUser.global_name,
            avatarUrl: avatarUrl,
            registeredAt: new Date(),
            lastLoginAt: new Date()
        })
    }

    await setUserSession(event, {
        user: {
            id: discordUser.id,
            username: discordUser.username,
            globalName: discordUser.global_name,
            email: discordUser.email ?? null,
            avatar: avatarUrl
        },
        secure: {
            discordAccessToken: token.access_token
        }
    })

    return sendRedirect(event, '/account')
})