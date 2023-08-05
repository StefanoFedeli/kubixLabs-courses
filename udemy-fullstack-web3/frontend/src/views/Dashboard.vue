<script setup lang="ts">

import {useAppStore} from "@/store/app";
import router from "@/router";
import api from "@/api";
import {ref} from "vue";

const appStore = useAppStore()

interface Badge {
  badge_id: string
  title: string
  description: string
  photo: string
}

const badges = ref([] as Badge[])

// loading
const loadingBadges = ref(false)

const claimBadges = async () => {
  try {
    const {data} = await api.claimAllBadges()
    console.log("CLAIMED BADGES", data)
    await getBadges()
  } catch (e) {
    console.log(e)
  }
}

const getBadges = async () => {
  loadingBadges.value = true
  try{
    const {data} = await api.getBadges()
    badges.value = data as Badge[]
    console.log("BADGES", badges.value)
  } catch (e) {
    console.log(e)
  }
  loadingBadges.value = false
}
getBadges()

const logout = async () => {
  await appStore.logout()
  await router.push({name: 'Home'})
}

</script>

<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar color="primary" title="Dashboard" class="elevation-0">
      <v-btn
        class="mx-3"
        variant="outlined"
        :loading="loadingBadges"
        @click="claimBadges"
      >
        Claim Badges
      </v-btn>
      <v-btn

        color="white"
        variant="flat"
        @click="logout"
      >Logout</v-btn>
    </v-app-bar>
    <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
      <div class="fill-height card-grid pt-10" v-if="badges.length > 0">
        <v-card
          class="mx-auto rounded-lg"
          color="primary"
          max-width="250"
          v-for="badge in badges"
          :key="badge.badge_id"
        >
          <v-img
            :src="badge.photo"
            height="200px"
            cover
          ></v-img>

          <v-card-title class="pa-5">
            {{badge.title}}
          </v-card-title>

          <v-card-text class="pa-5">
            {{badge.description}}
          </v-card-text>
        </v-card>
      </div>
      <div class="fill-height pt-10" v-else>
       <span class="text-center">No badges have been claimed</span>
      </div>
    </v-main>
  </v-layout>
</template>

<style scoped>
  .card-grid {
    width: 80%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-gap: 1rem;
    justify-content: start;
    align-items: start;
  }
</style>
