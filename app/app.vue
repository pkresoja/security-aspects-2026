<script lang="ts" setup>
const { loggedIn, user, clear, fetch } = useUserSession()

async function logout() {
  await $fetch('/api/auth/logout', { method: 'post' })
  await clear()
  await fetch()
}

const year = new Date().getFullYear()
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary mb-3">
    <div class="container">
      <RouterLink class="navbar-brand" to="/">
        <i class="fa-solid fa-gamepad"></i> iSocial
      </RouterLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/" active-class="active">
              <i class="fa-solid fa-house"></i> Home
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/about" active-class="active">
              <i class="fa-solid fa-circle-info"></i> About
            </RouterLink>
          </li>
          <template v-if="loggedIn">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/account" active-class="active">
                <i class="fa-solid fa-circle-user"></i> Account
              </RouterLink>
            </li>
            <li class="nav-item">
              <button class="nav-link" type="button" @click="logout">
                <i class="fa-solid fa-door-open"></i> Logout
              </button>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <a class="nav-link" href="/api/auth/discord">
                <i class="fa-solid fa-arrow-right-to-bracket"></i> Login
              </a>
            </li>
          </template>
        </ul>
        <div class="navbar-text" v-if="loggedIn">
          <i class="fa-solid fa-user"></i> {{ (user as any).globalName || (user as any).username }}
        </div>
      </div>
    </div>
  </nav>
  <div class="container">
    <NuxtPage />
    <footer class="my-3 text-center">
      &copy; {{ year }} Singidunum University
    </footer>
  </div>
</template>
