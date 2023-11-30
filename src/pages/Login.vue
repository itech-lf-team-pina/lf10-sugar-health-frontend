<script setup>
import {
  getRedirectResult,
  signInWithPopup,
  signOut,
} from 'firebase/auth'

import { GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth'
import { useCurrentUser, useFirebaseAuth, getCurrentUser } from 'vuefire'
import { ref, onMounted } from "vue"
import { BACKEND_URL } from "@/common/constants"
import {store} from "@/store/store";


let signedIn = useCurrentUser()

const auth = useFirebaseAuth() // only exists on client side
const googleAuthProvider = new GoogleAuthProvider()

const facebookAuthProvider = new FacebookAuthProvider()

// display errors if any
const error = ref(null)

async function createLoggedInUser(data) {
  try {
    console.log("sending post request...", data.user.displayName, data.user.uid)
    const response = await fetch(`${BACKEND_URL}/account/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.user.displayName,
        uid: data.user.uid,
        image: data.user.photoURL
      }),
    });

    if (response.ok) {
      const data = await response.json();
      store.commit('setAccountName', JSON.stringify(data.account.displayName))
      store.commit('setProfileName', JSON.stringify(data.profile.name))

      store.commit('setAccountId', data.account.id)
      store.commit('setProfilId', data.profile.id)

    } else {
      // Handle error
      console.error("Error while addind a account.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
function signInWithGoogle() {
  signInWithPopup(auth, googleAuthProvider).then(async (data) => {
    console.log("Sign in (Google) with popup returns UserCredentials: ", data)
    await createLoggedInUser(data)
  })
    .catch((reason) => {
      console.error('Failed signInWithGoogle', reason)
      error.value = reason
    })
}

function signInWithFacebook() {
  signInWithPopup(auth, facebookAuthProvider).then(async (data) => {
    console.log("Sign in (Facebook) with popup returns UserCredentials: ", data)
    await createLoggedInUser(data)
  })
      .catch((reason) => {
        console.error('Failed signInWithFacebook', reason)
        error.value = reason
      })
}

function signingOut() {
  signOut(auth)
  window.location.reload()
}

onMounted(() => {
  getRedirectResult(auth).catch((reason) => {
    console.error('Failed redirect result', reason)
    error.value = reason
  })

  // this methods returns Promise<User>, can access its properties directly
  getCurrentUser().then((data) => {
    return (data)
  })
})

</script>

<script> 

import {mapState} from "vuex";

export default {
  name: 'LogIn',
  computed: mapState({
    account: state => {
      return {
        id: state.accountId,
        name: state.accountName
      }
    },
    profile: state => {
      return {
        id: state.profileId,
        name: state.profileName
      }
    }
  }),

}


</script>

<template>
  <h1>Sign In Page</h1>
  <p v-if="!signedIn"> Please Sign In to use the service. Thank you.</p>
  <p v-else> Currently logged in as {{ account.name }} with profile {{ profile.name }} </p>

  <div>
    <main>
      <button v-if="!signedIn" @click="signInWithGoogle">SignIn with Google</button>
      <br />
      <button v-if="!signedIn" @click="signInWithFacebook">SignIn with Facebook</button>
      <button v-else @click="signingOut">Sign Out</button>
    </main>

  </div>
</template>

<style scoped>
button {
  margin: 4px;
}
</style>