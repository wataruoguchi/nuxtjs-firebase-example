<template>
  <ul>
    <li>axios</li>
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
    console.log('facts: ',facts)
		return { facts }
	}
}
</script>

<style>
</style>

