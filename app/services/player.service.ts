import type { UseFetchOptions } from "#app"
import type { PageModel } from "~/models/page.model"
import type { PlayerModel } from "~/models/player.model"

const API_BASE = 'https://cache.samifying.com/api'

export class PlayerService {

    static getPlayersByPage(page: Ref, opt: UseFetchOptions<any>) {
        const url = computed(() => `${API_BASE}/data?page=${page.value}&size=30&sort=id,desc`)
        return useFetch<PageModel<PlayerModel>>(url, opt)
    }

    static getPlayerById(id: any) {
        return useFetch<PlayerModel>(`${API_BASE}/data/${id}`)
    }

    static getPlayerByDiscordId(discordId: any) {
        return useFetch<PlayerModel>(`${API_BASE}/data/discord/${discordId}`)
    }
}