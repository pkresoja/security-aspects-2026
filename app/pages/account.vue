<script lang='ts' setup>
import { PlayerService } from '~/services/player.service'

const { loggedIn, user } = useUserSession() as {
    loggedIn: Ref<boolean>
    user: Ref<any>
}

const id = computed(() => user.value.id == undefined ? null : user.value.id)

const { data: player } = PlayerService.getPlayerByDiscordId(id.value)
const { data: friends } = useFetch<any[]>('/api/friend/list')
const router = useRouter()

useHead({
    title: 'Account :: iSocial'
})

onMounted(() => {
    if (!loggedIn.value) {
        router.push('/')
        return
    }
})

watch(loggedIn, () => {
    if (!loggedIn.value) {
        router.push('/')
        return
    }
})
</script>

<template>
    <div class='row justify-content-center'>
        <div class='col-lg-8'>

            <!-- Account Card -->
            <div class='card shadow-sm mb-3'>
                <div class='card-body d-flex align-items-center gap-3'>
                    <img :src='user?.avatar' class='rounded-circle border'
                        style='width: 72px; height: 72px; object-fit: cover;'>

                    <div>
                        <h5 class='mb-1'>
                            <i class='fa-solid fa-user me-2 text-primary'></i>
                            {{ user?.globalName || user?.username }}
                        </h5>

                        <div class='text-muted small'>
                            <i class='fa-solid fa-at me-1'></i>
                            {{ user?.username }}
                        </div>

                        <div class='text-muted small'>
                            <i class='fa-solid fa-envelope me-1'></i>
                            {{ user?.email }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Player Section -->
            <div class='card shadow-sm mb-3'>
                <div class='card-body'>

                    <h5 class='mb-3'>
                        <i class='fa-solid fa-gamepad me-2 text-success'></i>
                        Minecraft Account
                    </h5>

                    <!-- If player exists -->
                    <div v-if='player' class='d-flex align-items-center gap-3'>
                        <img :src='player.avatar' class='rounded border'
                            style='width: 64px; height: 64px; object-fit: cover;'>

                        <div>
                            <h6 class='mb-1'>{{ player.name }}</h6>

                            <div class='text-muted small'>
                                <i class='fa-solid fa-fingerprint me-1'></i>
                                {{ player.uuid }}
                            </div>

                            <div class='text-muted small'>
                                <i class='fa-solid fa-calendar me-1'></i>
                                Linked on {{ new Date(player.createdAt).toLocaleDateString() }}
                            </div>
                        </div>
                    </div>

                    <!-- If player NOT found -->
                    <div v-else class='text-center py-4'>
                        <div class='mb-3 fs-1 text-warning'>
                            <i class='fa-solid fa-triangle-exclamation'></i>
                        </div>

                        <h6>No linked Minecraft account</h6>

                        <p class='text-muted mb-3'>
                            You have never linked your account before.
                        </p>

                        <div class='alert alert-info text-start'>
                            <strong>
                                <i class='fa-brands fa-discord me-2'></i>
                                How to link your account:
                            </strong>

                            <ol class='mb-0 mt-2'>
                                <li>Join our Discord server</li>
                                <li>Run the command:</li>
                                <li>
                                    <code>/verify &lt;mcusername&gt;</code>
                                </li>
                                <li>
                                    Make sure you are using
                                    <strong>Minecraft Java Edition</strong>
                                </li>
                            </ol>
                        </div>

                        <a href='https://discord.gg/your-placeholder' target='_blank' class='btn btn-primary'>
                            <i class='fa-brands fa-discord me-2'></i>
                            Join Discord
                        </a>
                    </div>

                </div>
            </div>

            <div class='card shadow-sm' v-if="friends && friends.length > 0">
                <div class="card-body">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Discord</th>
                                <th scope="col">Minecraft</th>
                                <th scope="col">Added At</th>
                                <th scope="col">Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="f of friends">
                                <th scope="row">{{ f.friendId }}</th>
                                <td>{{ f.player.tag }}</td>
                                <td>{{ f.player.name }}</td>
                                <td>{{ new Date(f.createdAt).toLocaleString() }}</td>
                                <td>
                                    <div class="btn-group">
                                        <RouterLink :to="`/player/${f.playerId}`" class="btn btn-sm btn-primary">
                                            <i class="fa-solid fa-circle-info"></i>
                                        </RouterLink>
                                        <a :href="`/api/friend/remove/${f.player.id}`" class="btn btn-sm btn-danger">
                                            <i class="fa-solid fa-trash"></i>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class='card shadow-sm' v-else>
                <div class="card-body text-center">
                    <p>You haven't added any friends :(</p>
                </div>
            </div>
        </div>
    </div>
</template>