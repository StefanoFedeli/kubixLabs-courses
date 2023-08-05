<script setup lang="ts">

import api from '@/api'
import {onBeforeMount, ref} from 'vue'
import {useRouter} from "vue-router";
import detectEthereumProvider from '@metamask/detect-provider'
import {useAppStore} from "@/store/app";


const router = useRouter()

// Form
const authType = ref(router.currentRoute.value.query.type || 'basic')
const firstName = ref('')
const lastName = ref('')
const username = ref('')
const password = ref('')
const passwordConfirm = ref('')
const accountId = ref('')

// MetaMask
const metamask = ref(false)

// Loading states
const loadingAuthType = ref(false)

// before mount
onBeforeMount(async () => {
  loadingAuthType.value = true

  // check if metamask is installed
  const provider = await detectEthereumProvider({silent: true})
  metamask.value = !!provider;

  // check if auth type is metamask
  const {query} = router.currentRoute.value
  const type = query.type
  console.log("TYPE", type)
  if (query && type) {
    if (type === 'metamask') {
      // get metamask account id
      const _accId = await handleConnect()
      if (!_accId) {
        loadingAuthType.value = false
        return
      }
      console.log("ACCOUNT ID", _accId)
      accountId.value = _accId
      authType.value = type
    } else if (type === 'basic') {
      authType.value = type
    }
  }

  loadingAuthType.value = false
})


const register = async () => {
  if (authType.value === 'basic') {
    console.log("REGISTER", username, password)
    const data = {
      firstName: firstName.value,
      lastName: lastName.value,
      role: 'regular',
      authType: 'basic',
      authBasic: {
        username: username.value,
        password: password.value
      }
    }
    try {
      const res = await api.register(data)
      console.log("REGISTERED", res)
      await router.push({name: 'Login'})
    } catch (e) {
      console.log("ERROR", e)
      alert("Error while registering")
    }
  } else if (authType.value === 'metamask') {
    console.log("REGISTER", accountId)
    const data = {
      firstName: firstName.value,
      lastName: lastName.value,
      role: 'regular',
      authType: 'metamask',
      authMetaMask: {
        accountId: accountId.value
      }
    }
    try {
      const res = await api.register(data)
      console.log("REGISTERED", res)
      const d = await api.login({
        authMetaMask: {
          accountId: accountId.value
        },
        authType: 'metamask'
      })
      console.log("LOGGED IN", d.data)
      const appStore = useAppStore()
      appStore.login({
        token: d.data.token,
        user: d.data.user
      })
      await router.push({name: 'Dashboard'})
    } catch (e) {
      console.log("ERROR", e)
      alert("Error while registering")
    }
  } else {
    alert("Unknown auth type")
  }
}

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

const toggleAuthType = async () => {
  if (authType.value === 'basic') {
    loadingAuthType.value = true

    // get metamask account id
    const _accId = await handleConnect()
    if (!_accId) {
      loadingAuthType.value = false
      return
    }
    console.log("ACCOUNT ID", _accId)
    accountId.value = _accId

    authType.value = 'metamask'
    loadingAuthType.value = false
  } else {
    authType.value = 'basic'
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
                <h1>Register</h1>
              </v-card-title>
              <v-card-text>

                <v-divider class="my-3"/>


                <v-form class="pa-4">

                  <v-btn
                    v-if="authType === 'basic'"
                    block size="large"
                    variant="outlined"
                    class="my-4"
                    :disabled="!metamask"
                    :loading="loadingAuthType"
                    @click="toggleAuthType"
                  >
                    <v-img src="@/assets/metamask.svg" width="24px" height="24px" class="mx-2"/>
                    Sign Up with Metamask
                  </v-btn>
                  <v-btn
                    v-else
                    block size="large"
                    variant="outlined"
                    class="my-4"
                    :disabled="!metamask"
                    :loading="loadingAuthType"
                    @click="toggleAuthType"
                  >
                    <v-icon class="mx-2">mdi-account</v-icon>
                    Switch to Basic Auth
                  </v-btn>

                  <v-divider class="mt-3 mb-4"/>

                  <div class="mb-2">
                    <span v-if="authType === 'basic'">Register using username and password,</span>
                    <span v-else>Register using MetaMask wallet id,</span>
                  </div>

                  <v-text-field
                    v-model="firstName"
                    label="First Name"
                    type="text"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="lastName"
                    label="Last Name"
                    type="text"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-if="authType === 'basic'"
                    v-model="username"
                    label="Username"
                    type="text"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-if="authType === 'basic'"
                    v-model="password"
                    label="Password"
                    type="password"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-if="authType === 'basic'"
                    v-model="passwordConfirm"
                    label="Confirm Password"
                    type="password"
                    required
                  ></v-text-field>
                  <v-btn
                    size="large"
                    color="primary"
                    @click="register"
                    block
                  >
                    Register
                  </v-btn>
                </v-form>

                <v-divider class="my-3"/>
                <span>Already have an account? <router-link to="/login">Login</router-link></span>

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
