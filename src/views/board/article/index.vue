<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      :page.sync="page"
      @page-count="pageCount = $event"
      :server-items-length="serverItemsLength"
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
    </v-data-table>
  </div>
</template>

<script>
import { head, last } from 'lodash'
import DisplayTime from '@/components/display-time'

export default {
  components: {
    DisplayTime
  },

  props: ['articleCount', 'document'],

  data () {
    return {
      loading: false,

      headers: [
        { value: 'createdAt', text: '작성일', width: '110px', align: 'center' },
        { value: 'title', text: '제목', width: '100%', sortable: false },
        { value: 'userName', text: '작성자', width: '100px', sortable: false },
        { value: 'readCount', text: '조회수', width: '70px' },
        { value: 'commentCount', text: '댓글', width: '70px', sortable: false },
        { value: 'id', text: '아디', width: '100px', sortable: false }
      ],
      options: {
        sortBy: ['createdAt'],
        sortDesc: [true]
      },
      page: 1,
      pageCount: 0,
      serverItemsLength: 0,
      items: [],
      docs: [],
      itemsPerPage: 5,

      unsubscribe: null
    }
  },

  watch: {
    document () {
      console.log('qqq')
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

      this.serverItemsLength = this.articleCount

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
          console.log(docData)
          return {
            id: doc.id,
            title: docData.title,
            content: docData.content,
            readCount: docData.readCount,
            commentCount: docData.commentCount,
            updatedAt: docData.updatedAt.toDate(),
            createdAt: docData.createdAt.toDate(),
            userName: docData.user.displayName
          }
        })
      })

      this.loading = false
    }
  },

  destroyed () {
    if (this.unsubscribe) this.unsubscribe()
  }
}
</script>
