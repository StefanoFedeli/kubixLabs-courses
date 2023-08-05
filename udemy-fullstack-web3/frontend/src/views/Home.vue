<script lang="ts" setup>
import {useRouter} from "vue-router";
import {useAppStore} from "@/store/app";

const router = useRouter()
const appStore = useAppStore()

</script>

<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <v-img height="300" src="@/assets/metamask-fox.png" class="mb-6"/>

      <div class="text-body-1 font-weight-medium mb-n1">Welcome to</div>

      <h1 class="text-h5 font-weight-bold">Metamask Login Demo</h1>

      <div class="py-10"/>

      <div v-if="!appStore.isLoggedIn">
        <v-row class="d-flex align-center justify-space-around">
          <v-col cols="0" sm="0" md="2"/>
          <v-col cols="12" sm="12" md="4">
            <v-btn
              block
              color="primary"
              min-width="228"
              size="x-large"
              variant="flat"
              to="/login"

            >
              <v-icon
                icon="mdi-login"
                size="large"
                class="mr-2"
              />
              Sign In
            </v-btn>
          </v-col>
          <v-col cols="12" sm="12" md="4">
            <v-btn
              block
              color="primary"
              min-width="228"
              size="x-large"
              variant="flat"
              to="/register"
            >
              <v-icon
                icon="mdi-account-plus"
                size="large"
                class="mr-2"
              />
              Register
            </v-btn>
          </v-col>
          <v-col cols="0" sm="0" md="2"/>
        </v-row>
      </div>

      <div v-else>
        <v-row class="d-flex align-center justify-space-around">
          <v-col cols="4">
            <v-btn
              block
              color="primary"
              min-width="228"
              size="x-large"
              variant="flat"
              to="/dashboard"
            >
              <v-icon
                icon="mdi-view-dashboard"
                size="large"
                class="mr-2"
              />
              Dashboard
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-responsive>
  </v-container>
</template>


