<template>
  <v-tooltip bottom>
    <template v-slot:activator="{on}">
      <span v-on="on">{{ displayTime }}</span>
    </template>
    <span>{{time.toLocaleString()}}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: ['time'],

  computed: {
    displayTime () {
      return this.$moment(this.time).fromNow()
    }
  }
}
</script>
