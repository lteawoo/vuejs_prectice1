<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"

      :server-items-length="articleCount"
      :options.sync="options"
      :loading="loading"
      :footer-props="{
        showCurrentPage: true,
        itemsPerPageOptions: [itemsPerPage]
      }"
      must-sort
      item-key="id"
      :sort-desc="true"
      :mobile-breakpoint= "0"
    >
      <template v-slot:[`item.createdAt`]="{ item }">
        <display-time :time="item.createdAt"></display-time>
      </template>
      <template v-slot:[`item.title`]="{ item }">
        <a @click="openDialog(item)">{{ item.title }}</a>
      </template>
      <template v-slot:[`item.userName`]="{ item }">
        <display-user :user="item.user"></display-user>
      </template>
    </v-data-table>
    <v-dialog v-if="selectedItem" v-model="dialog" fullscreen>
      <display-content :document="document" :item="selectedItem" @close="dialog=false"></display-content>
    </v-dialog>
  </div>
</template>

<script>
import { head, last } from 'lodash'
import DisplayTime from '@/components/display-time'
import DisplayUser from '@/components/display-user'
import DisplayContent from '@/components/display-content'

export default {
  components: {
    DisplayTime,
    DisplayUser,
    DisplayContent
  },

  props: ['articleCount', 'document'],

  data () {
    return {
      loading: false,

      headers: [
        { value: 'createdAt', text: '작성일', width: '110px', align: 'center' },
        { value: 'title', text: '제목', width: '100%', sortable: false },
        { value: 'userName', text: '작성자', width: '150px', sortable: false },
        { value: 'readCount', text: '조회수', width: '90px', align: 'center' },
        { value: 'commentCount', text: '댓글', width: '70px', sortable: false, align: 'center' }
      ],
      items: [],

      itemsPerPage: 5,
      options: {
        sortBy: ['createdAt'],
        sortDesc: [true]
      },

      docs: [],
      unsubscribe: null,

      dialog: false,
      selectedItem: null
    }
  },

  watch: {
    document () {
      this.subscribe()
    },

    options: {
      handler (n, o) {
        if (!o.page ||
             head(o.sortBy) !== head(n.sortBy) ||
             head(o.sortDesc) !== head(n.sortDesc)) {
          n.page = 1
          this.subscribe(0)
          return
        }

        const arrow = n.page - o.page
        this.subscribe(arrow)
      },
      deep: true
    },

    dialog (n) {
      if (!n) {
        this.selectedItem = null
      }
    }
  },

  methods: {
    subscribe (arrow) {
      if (this.unsubscribe) this.unsubscribe()

      this.loading = true

      const order = head(this.options.sortBy)
      const sort = head(this.options.sortDesc) ? 'desc' : 'asc'

      const ref = this.$firebase.firestore()
        .collection('boards')
        .doc(this.document)
        .collection('articles')

      let query = ref

      if (order) {
        query = ref.orderBy(order, sort)
      }

      if (arrow > 0) {
        query = query.startAfter(last(this.docs)).limit(this.itemsPerPage)
      } else if (arrow < 0) {
        query = query.endBefore(head(this.docs)).limitToLast(this.itemsPerPage)
      } else {
        query = query.limit(this.itemsPerPage)
      }

      this.unsubscribe = query.onSnapshot(sn => {
        if (sn.empty) {
          this.items = []
          return
        }

        this.docs = sn.docs
        this.items = sn.docs.map(doc => {
          const docData = doc.data()
          return {
            id: doc.id,
            title: docData.title,
            content: docData.content,
            readCount: docData.readCount,
            commentCount: docData.commentCount,
            updatedAt: docData.updatedAt.toDate(),
            createdAt: docData.createdAt.toDate(),
            user: docData.user
          }
        })
      }, err => {
        console.error(err)
      })

      this.loading = false
    },

    openDialog (item) {
      this.selectedItem = item
      this.dialog = true
    }
  },

  destroyed () {
    if (this.unsubscribe) this.unsubscribe()
  }
}
</script>
