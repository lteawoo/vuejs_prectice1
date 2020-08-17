<template>
  <v-tooltip bottom>
    <template v-slot:activator="{on}">
      <!-- <span v-on="on">{{ user.displayName }}</span> -->
      <div v-on="on">
        <v-avatar size="24">
          <v-img :src="user.photoURL"/>
        </v-avatar>
        {{ user.displayName }}
      </div>
    </template>
    <span>{{ user.email }}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: ['user']
}
</script>
