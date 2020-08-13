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

    <v-list nav>
      <v-list-group
        v-for="(menu, i) in menus"
        :key="i"
        v-model="menu.active"
        :prepend-icon="menu.icon"
        no-action
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>
                {{ menu.title }}
              <span>
                <v-btn @click="openDialogMenu(i)" icon><v-icon>mdi-pencil</v-icon></v-btn>
                <v-btn @click="moveMenu(menus, i, -1)" v-if="i > 0" icon><v-icon>mdi-chevron-double-up</v-icon></v-btn>
                <v-btn @click="moveMenu(menus, i, 1)" v-if="i < menus.length - 1" icon><v-icon>mdi-chevron-double-down</v-icon></v-btn>
                <v-btn @click="removeMenu(menus, i)" icon><v-icon>mdi-delete</v-icon></v-btn>
              </span>
            </v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item
          v-for="(subMenu, j) in menu.subMenus"
          :key="j"
          :to="subMenu.to"
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ subMenu.title }}
              <span>
                <v-btn @click="openDialogSubMenu(i, j)" icon><v-icon>mdi-pencil</v-icon></v-btn>
                <v-btn @click="moveMenu(menu.subMenus, i, -1)" v-if="j > 0" icon><v-icon>mdi-chevron-double-up</v-icon></v-btn>
                <v-btn @click="moveMenu(menu.subMenus, i, 1)" v-if="j < menu.subMenus.length - 1" icon><v-icon>mdi-chevron-double-down</v-icon></v-btn>
                <v-btn @click="removeMenu(menus, i)" icon><v-icon>mdi-delete</v-icon></v-btn>
              </span>
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon :to="subMenu.to" exact><v-icon>mdi-arrow-right-bold-circle-outline</v-icon></v-btn>
          </v-list-item-action>
        </v-list-item>

        <v-list-item @click="openDialogSubMenu(i, -1)">
          <v-list-item-icon>
            <v-icon>mdi-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>추가하기</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>

      <v-list-item @click="openDialogMenu(-1)">
        <v-list-item-icon>
          <v-icon>mdi-plus</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>추가하기</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-dialog v-model="dialogMenu" max-width="400">
      <v-card>
        <v-card-title>
          메인메뉴 수정
          <v-spacer/>
          <v-btn icon @click="saveMenu" color="success"><v-icon>mdi-content-save</v-icon></v-btn>
          <v-btn icon @click="dialogMenu=false"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="2">
              <v-icon required>{{ formItem.icon }}</v-icon>
            </v-col>
            <v-col cols="10">
              <v-text-field
                v-model="formItem.icon"
                label="mdi icon"
                outlined
                clearable
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-text-field v-model="formItem.title" label="메뉴 이름" outlined hide-details></v-text-field>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogSubMenu" max-width="400">
      <v-card>
        <v-card-title>
          서브메뉴 수정
          <v-spacer/>
          <v-btn icon @click="saveSubMenu" color="success"><v-icon>mdi-content-save</v-icon></v-btn>
          <v-btn icon @click="dialogSubMenu=false"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="formSubItem.title" label="메뉴 이름" outlined required></v-text-field>
          <v-text-field v-model="formSubItem.to" label="경로" outlined required></v-text-field>
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
      dialogMenu: false,
      dialogSubMenu: false,
      formItem: {
        icon: 'mdi-crosshairs-question',
        title: ''
      },
      formSubItem: {
        title: '',
        to: ''
      },
      selectedMenuIndex: 0,
      selectedSubMenuIndex: 0
    }
  },

  methods: {
    openDialogMenu (index) {
      this.selectedMenuIndex = index

      if (index < 0) {
        this.formItem.icon = 'mdi-crosshairs-question'
        this.formItem.title = ''
      } else {
        this.formItem.icon = this.menus[index].icon
        this.formItem.title = this.menus[index].title
      }

      this.dialogMenu = true
    },

    openDialogSubMenu (mainIndex, subIndex) {
      console.log(subIndex)
      this.selectedMenuIndex = mainIndex
      this.selectedSubMenuIndex = subIndex

      if (subIndex < 0) {
        this.formSubItem.title = ''
        this.formSubItem.to = ''
      } else {
        this.formSubItem.title = this.menus[mainIndex].subMenus[subIndex].title
        this.formSubItem.to = this.menus[mainIndex].subMenus[subIndex].to
      }

      this.dialogSubMenu = true
    },

    moveMenu (menus, i, arrow) {
      menus.splice(i + arrow, 0, ...menus.splice(i, 1))
      this.save()
    },

    removeMenu (menus, i) {
      menus.splice(i, 1)
      this.save()
    },

    async saveMenu () {
      if (this.selectedMenuIndex < 0) {
        this.menus.push(this.formItem)
      } else {
        this.menus[this.selectedMenuIndex].icon = this.formItem.icon
        this.menus[this.selectedMenuIndex].title = this.formItem.title
      }
      this.save()
    },

    async saveSubMenu () {
      if (this.selectedSubMenuIndex < 0) {
        console.log(this.menus)
        if (!this.menus[this.selectedMenuIndex].subMenus) {
          this.menus[this.selectedMenuIndex].subMenus = []
        }
        this.menus[this.selectedMenuIndex].subMenus.push(this.formSubItem)
      } else {
        this.menus[this.selectedMenuIndex].subMenus[this.selectedSubMenuIndex].title = this.formSubItem.title
        this.menus[this.selectedMenuIndex].subMenus[this.selectedSubMenuIndex].to = this.formSubItem.to
      }
      this.save()
    },

    async save () {
      try {
        await this.$firebase.database()
          .ref()
          .child('site')
          .child('menu')
          .set(this.menus)
      } finally {
        this.dialogMenu = false
        this.dialogSubMenu = false
      }
    }
  }
}
</script>
