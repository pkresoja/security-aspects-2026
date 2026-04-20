import { IsNull } from "typeorm"
import { AppDataSource } from "~~/server/db/data-source"
import { Friend } from "~~/server/db/entities/Friend"

export default defineEventHandler(async (event) => {
    const { user } = await getUserSession(event)
    const query = getQuery(event)
    const friendRepo = AppDataSource.getRepository(Friend)

    const data = await friendRepo.find({
        select: {
            friendId: true,
            playerId: true,
            createdAt: true
        },
        where: {
            user: {
                discordId: (user as any).id
            },
            deletedAt: IsNull()
        }
    })

    if (query.simple != '1') {
        for (let obj of (data as any[])) {
            obj.player = await $fetch<any>('https://cache.samifying.com/api/data/' + obj.playerId)
        }
    }

    return data
})