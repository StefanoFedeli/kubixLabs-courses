<script setup lang="ts">
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import api from '@/api'
import {useAppStore} from "@/store/app";
import detectEthereumProvider from "@metamask/detect-provider";

const appStore = useAppStore()
const router = useRouter()

// MetaMask
const metamask = ref(false)
detectEthereumProvider({silent: true}).then(
  (provider) => {
    if (provider) {
      metamask.value = true
    }
  }
)

// Form State
const username = ref('')
const password = ref('')

// Loading
const loadingMetamaskLogin = ref(false)
const loadingBasicLogin = ref(false)

const handleConnect = async () => {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  })
  console.log('ACCOUNTS', accounts)
  if (accounts.length === 0) {
    alert("No accounts found")
    return null
  }
  return accounts[0]
}


const login = async (method = 'basic') => {
  if (method === 'metamask') {
    loadingMetamaskLogin.value = true
    const accountId = await handleConnect()
    if (!accountId) {
      loadingMetamaskLogin.value = false
      return
    }
    let data
    try {
      const d = await api.login({
        authMetaMask: {
          accountId
        },
        authType: 'metamask'
      })
      data = d.data
    } catch (e) {
      console.log("ERROR", e)
      loadingMetamaskLogin.value = false
      if (e.response.status === 404) {
        await router.push({name: 'Register', query: {type: 'metamask'}})
      } else {
        alert("Unknown error")
      }
      return
    }

    console.log("LOGGED IN", data)
    await appStore.login({
      user: data.user,
      token: data.token,
    })
    await router.push({name: 'Dashboard'})
  } else {
    loadingBasicLogin.value = true
    let data;
    try {
      const d = await api.login({
        authBasic: {
          username: username.value,
          password: password.value
        },
        authType: 'basic'
      })
      data = d.data;
    } catch (e) {
      console.log("ERROR", e)
      loadingBasicLogin.value = false
      if (e.response.status === 404) {
        // await router.push({name: 'Register', query: {type: 'basic'}})
        alert("Account not found")
      } else {
        alert("Unknown error")
      }
      return
    }

    console.log("LOGGED IN", data)
    await appStore.login({
      user: data.user,
      token: data.token,
    })
    await router.push({name: 'Dashboard'})
  }
}

</script>

<template>
  <v-app>
    <v-main>
      <v-container class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4" lg="3">
            <v-card class="pa-4">
              <v-card-title class="text-center">
                <h1>Sign In</h1>
              </v-card-title>
              <v-card-text>
                <v-form class="pa-4">
                  <v-btn
                    block size="large"
                    variant="outlined"
                    class="my-4"
                    :loading="loadingMetamaskLogin"
                    :disabled="!metamask"
                    @click="login('metamask')"
                  >
                    <v-img src="@/assets/metamask.svg" width="24px" height="24px" class="mx-2" />
                    Sign In with Metamask
                  </v-btn>
                  <v-divider class="mt-3 mb-4" />

                  <v-text-field
                    v-model="username"
                    label="Username"
                    type="text"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    label="Password"
                    type="password"
                    required
                  ></v-text-field>
                  <v-btn
                    color="primary"
                    @click="login"
                    block
                    size="large"
                  >
                    SignIn
                  </v-btn>
                </v-form>

                <v-divider class="my-3" />
                <span>Don't have an account? <router-link to="/register">Register</router-link></span>

              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>

</style>
