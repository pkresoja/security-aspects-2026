import { IsNull } from "typeorm"
import { AppDataSource } from "~~/server/db/data-source"
import { Friend } from "~~/server/db/entities/Friend"
import { User } from "~~/server/db/entities/User"

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const { user } = await getUserSession(event)

    const userRepo = AppDataSource.getRepository(User)
    const friendRepo = AppDataSource.getRepository(Friend)

    const userEntity = await userRepo.findOneBy({
        discordId: (user as any).id,
    })

    if (userEntity == null) {
        return 'User not found????'
    }

    const exists = await friendRepo.existsBy({
        userId: userEntity.userId,
        playerId: Number(id),
        deletedAt: IsNull()
    })

    if (!exists) {
        await friendRepo.save({
            userId: userEntity.userId,
            playerId: Number(id),
            createdAt: new Date()
        })
    }

    return sendRedirect(event, '/account')
})