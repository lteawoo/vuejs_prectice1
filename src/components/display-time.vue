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
      const bt = this.$moment(this.time)
      const now = this.$moment()
      const diff = now.diff(bt, 'hour')

      const time = bt.toDate()

      if (diff < 1) {
        return bt.fromNow()
      } else if (diff < 24) {
        return this.$dateFormat(time, 'HH:MM')
      }

      return this.$dateFormat(time, 'yyyy.mm.dd')
    }
  }
}
</script>
