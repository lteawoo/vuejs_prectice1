<template>
  <v-card>
    <v-toolbar color="primary" dark>
      <v-toolbar-title>
        {{ item.title }}
      </v-toolbar-title>
      <v-spacer/>
      <template v-if="user && user.id === item.user.uid">
        <v-btn @click="writeArticle" icon><v-icon>mdi-pencil</v-icon></v-btn>
      </template>
      <v-btn @click="$emit('close')" icon><v-icon>mdi-close</v-icon></v-btn>
    </v-toolbar>

    <v-card-text>
      <viewer v-if="item" :initialValue="item.content"></viewer>
      <v-container v-else>
        <v-row justify="center">
          <v-progress-circular indeterminate></v-progress-circular>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer/>
      <span class="font-italic caption">
        작성일: <display-time :time="item.createdAt"></display-time>
      </span>
    </v-card-actions>
    <v-card-actions>
      <v-spacer/>
      <span class="font-italic caption">
        수정일: <display-time :time="item.updatedAt"></display-time>
      </span>
    </v-card-actions>
  </v-card>
</template>

<script>
import DisplayTime from '@/components/display-time'

export default {
  components: {
    DisplayTime
  },

  props: ['document', 'item'],

  data () {
    return {
      content: ''
    }
  },

  computed: {
    user () {
      return this.$store.state.user
    }
  },

  mounted () {
    console.log('mounted')
    console.log(this.user)
    console.log(this.item.user)
    this.increaseReadCount()
  },

  methods: {
    async writeArticle () {
      this.$router.push({
        path: this.$route.path + '/article-write',
        query: {
          id: this.item.id
        }
      })
    },

    async increaseReadCount () {
      await this.$firebase.firestore()
        .collection('boards')
        .doc(this.document)
        .collection('articles')
        .doc(this.item.id)
        .update({
          readCount: this.$firebase.firestore.FieldValue.increment(1)
        })
    }
  }
}
</script>
