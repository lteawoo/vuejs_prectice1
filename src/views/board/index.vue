<template>
  <v-card>
    <v-card-title>board test</v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
    >
      <template v-slot:[`item.id`]={item}>
        <v-btn icon @click="openDialog(item)"><v-icon>mdi-pencil</v-icon></v-btn>
        <v-btn icon @click="remove(item)"><v-icon>mdi-delete</v-icon></v-btn>
      </template>
    </v-data-table>
    <v-card-actions>
      <v-btn @click="read"><v-icon left>mdi-read</v-icon></v-btn>
      <v-btn @click="openDialog()"><v-icon left>mdi-pencil</v-icon></v-btn>
    </v-card-actions>
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-form>
          <v-card-text>
            <v-text-field v-model="form.title"></v-text-field>
            <v-text-field v-model="form.content"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>

            <v-btn @click="update" v-if="selectedItem">update</v-btn>
            <v-btn @click="add" v-else>write</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  data () {
    return {
      headers: [
        { value: 'title', text: '제목' },
        { value: 'content', text: '내용' },
        { value: 'id', text: 'id' }
      ],
      items: [],
      form: {
        title: '',
        content: ''
      },
      dialog: false,
      selectedItem: null
    }
  },

  created () {
    this.read()
  },

  methods: {
    openDialog (item) {
      this.selectedItem = item

      if (!item) {
        this.form.title = ''
        this.form.content = ''
      } else {
        this.form.title = item.title
        this.form.content = item.content
      }

      this.dialog = true
    },

    add () {
      this.$firebase.firestore().collection('boards').add(this.form)
      this.dialog = false
    },

    update () {
      this.$firebase.firestore().collection('boards').doc(this.selectedItem.id).update(this.form)
      this.dialog = false
    },

    async read () {
      const sn = await this.$firebase.firestore().collection('boards').get()
      // if (sn.)
      sn.docs.forEach(v => {
        console.log(v.id)
        console.log(v.data())
      })
      this.items = sn.docs.map(v => {
        const item = v.data()
        return {
          id: v.id, title: item.title, content: item.content
        }
      })
      console.log(this.item)
    },

    remove (item) {
      this.$firebase.firestore().collection('boards').doc(item.id).delete()
    }
  }
}
</script>
