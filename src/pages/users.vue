<template>
  <div>
    <h1>firestore contents here</h1>
    <ul>
      <li v-for="(user, userIdx) in users" :key="userIdx">
        <ul>
          <li>name: {{ user.name }}</li>
          <li>email: {{ user.email }}</li>
        </ul>
      </li>
    </ul>
    <div class="form">
      <h1>I know, but this is the form!</h1>
      <div>
				Name: <input type="text" name="name" v-model="name">
      </div>
      <div>
				email: <input type="text" name="email" v-model="email">
      </div>
      <div>
        <button @click="submit">Submit</button>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '~/plugins/firebase.js'
import { mapGetters } from 'vuex'

export default {
  created: function () {
    this.$store.dispatch('setUsersRef', db.collection('users'))
  },
  computed: {
    ...mapGetters({ users: 'getUsers' })
  },
  data: function () {
    return {
      name: '',
      email: '',
    }
  },
  methods: {
    submit: function () {
      const user = {
        name: this.name,
        email: this.email,
      }
      const usersRef = db.collection('users')
      usersRef.add(user)
      this.name = ''
      this.email = ''
    }
  }
}
</script>

<style>
</style>

