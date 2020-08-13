<template>
  <div>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">
          Application
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

          <v-list-item-action>
            <v-btn @click="openDialogItem(i)" icon><v-icon>mdi-pencil</v-icon></v-btn>
          </v-list-item-action>
        </template>

        <v-list-item
          v-for="(subMenu, j) in menu.subItems"
          :key="j"
          :to="subMenu.to"
        >
          <v-list-item-content>
            <v-list-item-title v-text="subMenu.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-close</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            서브추가하기
          </v-list-item-content>
        </v-list-item>
      </v-list-group>

      <v-list-item @click="openDialogItem(-1)">
        <v-list-item-icon>
          <v-icon>mdi-close</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          추가하기
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-dialog v-model="dialogItem" max-width="400">
      <v-card>
        <v-card-title>
          수정하기
          <v-spacer></v-spacer>
          <v-btn icon @click="saveMenu"><v-icon>mdi-content-save</v-icon></v-btn>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="formItem.title"></v-text-field>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: [
    'menus'
  ],

  data () {
    return {
      dialogItem: false,
      dialogSubItem: false,
      formItem: {
        icon: '',
        title: ''
      },
      selectedItemIndex: -1
    }
  },

  methods: {
    openDialogItem (index) {
      this.selectedItemIndex = index
      this.dialogItem = true
      if (index < 0) {
        this.formItem.title = ''
      } else {
        this.formItem.title = this.menus[index].title
      }
    },
    saveMenu () {
      if (this.selectedItemIndex < 0) {
        this.menus.push(this.formItem)
      } else {
        this.menus[this.selectedItemIndex].title = this.formItem.title
      }
      this.save()
    },
    async save () {
      try {
        await this.$firebase.database().ref().child('site').update({
          menu: this.menus
        })
      } finally {
        this.dialogItem = false
      }
    }
  }
}
</script>
