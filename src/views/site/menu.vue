<template>
  <div>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">
          Applicationaa
        </v-list-item-title>

        <v-list-item-subtitle>
          subtext
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider/>
    <v-list>
      <v-list-group
        v-for="(menu, i) in menus"
        :key="i"
        v-model="menu.active"
        :prepend-icon="menu.icon"
        no-action
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title v-text="menu.title"></v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item
          v-for="subMenu in menu.subItems"
          :key="subMenu.title"
          :to="subMenu.to"
        >
          <v-list-item-content>
            <v-list-item-title v-text="subMenu.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </div>
</template>

<script>
export default {
  props: [
    'menus'
  ]
}
</script>
