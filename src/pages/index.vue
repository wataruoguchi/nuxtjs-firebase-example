<template>
  <ul>
    <li v-for="(fact, factIdx) in facts" :key="factIdx">
      {{ fact.text }}
    </li>
  </ul>
</template>

<script>
import axios from 'axios'
export default {
  async asyncData() {
    const res = await axios.get('https://nuxt-ssr.firebaseio.com/facts.json')
    const facts = res.data
    return { facts }
  }
}
</script>

<style>
</style>

