<script lang="ts" setup>
import { PlayerService } from '~/services/player.service';

const pageNumber = ref<number>(0)

const { data, pending, error } = PlayerService.getPlayersByPage(pageNumber, {
    watch: [pageNumber]
})

function loadPrev() {
    if (pageNumber.value > 0)
        pageNumber.value--
}

function loadNext() {
    if (data.value?.last) return
    pageNumber.value++
}

function loadFirst() {
    pageNumber.value = 0
}

function loadLast() {
    if (data.value == null) return // do nothing
    pageNumber.value = data.value?.totalPages - 1
}

useHead({
    title: 'Home :: iSocial'
})
</script>

<template>
    <nav class="mb-3">
        <ul class="pagination justify-content-center">
            <li class="page-item">
                <button type="button" class="page-link" @click="loadFirst">
                    First
                </button>
            </li>
            <li class="page-item">
                <button type="button" class="page-link" @click="loadPrev">
                    Prev
                </button>
            </li>
            <li class="page-item active">
                <span class="page-link">
                    {{ pageNumber + 1 }} {{ data ? `out of ${data.totalPages}` : '' }}
                </span>
            </li>
            <li class="page-item">
                <button type="button" class="page-link" @click="loadNext">
                    Next
                </button>
            </li>
            <li class="page-item">
                <button type="button" class="page-link" @click="loadLast">
                    Last
                </button>
            </li>
        </ul>
    </nav>

    <Loading v-if="pending" />
    <ErrorCard v-else-if="error">
        {{ error }}
    </ErrorCard>
    <div class="player-wrapper" v-else>
        <PlayerCard v-for="player in data?.content" :player="player" />
    </div>
</template>

<style>
.player-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
}

.info-card {
    max-width: 450px;
    margin-left: auto;
    margin-right: auto;
}
</style>