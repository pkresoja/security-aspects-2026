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

    const existing = await friendRepo.findOneBy({
        playerId: Number(id),
        userId: userEntity.userId,
        deletedAt: IsNull()
    })

    if (existing != null) {
        existing.deletedAt = new Date()
        await friendRepo.save(existing)
    }

    return sendRedirect(event, '/account')
})