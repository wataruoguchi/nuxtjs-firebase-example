<template>
  <ul>
    <li v-for="(fact, factIdx) in facts" :key="factIdx">
      {{ fact.text }}
    </li>
  </ul>
</template>

<script>
import fetch from 'isomorphic-fetch'
export default {
	async asyncData() {
		const response = await fetch('https://nuxt-ssr.firebaseio.com/facts.json')
		const facts = await response.json()
		return { facts }
	}
}
</script>

<style>
</style>

