<template>
  <div
        :id="'pagination'+Notes.name"
        :hidden="PagesCount(Notes.name) < 2"
        class="pagination w-100 mx-auto mt-3 mb-3"
    >
        <b-button
            :disabled="CurrentPage(Notes.name) == 1"
            class="pagination__button ml-1 mr-1"
            @click="goToPage(Notes.name)"
        > {{Pagination.start}} </b-button>
        <b-button
            :disabled="CurrentPage(Notes.name) == 1"
            class="pagination__button ml-1 mr-1"
            @click="adjustPage(Notes.name)"
        > {{Pagination.prev}} </b-button>

        <b-button
            v-for="n in 5"
            :key="n"
            :disabled="n == 3"
            :hidden="(n-3 + CurrentPage(Notes.name) > PagesCount(Notes.name))
                || (n-3 + CurrentPage(Notes.name) < 1)"
            class="pagination__button ml-1 mr-1"
            @click="goToPage(Notes.name, n-3 + CurrentPage(Notes.name))"
        > {{n-3 + CurrentPage(Notes.name)}}</b-button>

        <b-button
            :disabled="CurrentPage(Notes.name) == PagesCount(Notes.name)"
            class="pagination__button ml-1 mr-1"
            @click="adjustPage(Notes.name, 1)"
        > {{Pagination.next}} </b-button>
        <b-button
            class="pagination__button ml-1 mr-1"
            :disabled="CurrentPage(Notes.name) == PagesCount(Notes.name)"
            @click="goToPage(Notes.name, PagesCount(Notes.name))"
        > {{Pagination.end}} </b-button>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { moduleName, getterTypes } from '../../store/modules/notes';
export default {
    name:'VPagination',
    props:{
        Notes: Object,
    },
    data(){
        return{
            PinnedNotesCaption : "PINNED_NOTES",
            OtherNotesCaption : "NOTES",
            Pagination : {
                start: '⟪',
                prev: '❰',
                next: '❱',
                end: '⟫'
            }
        }
    },
    computed: {
        ...mapGetters(moduleName, [
            getterTypes.GETTER_PINNED_PAGES_COUNT,
            getterTypes.GETTER_OTHER_PAGES_COUNT
        ]),
    },

    methods: {
        PagesCount(name){
            if (name == this.PinnedNotesCaption) return Number(this[getterTypes.GETTER_PINNED_PAGES_COUNT]);
            if (name == this.OtherNotesCaption) return Number(this[getterTypes.GETTER_OTHER_PAGES_COUNT]);
            return null;
        },

        CurrentPage(name){
            let page;
            if (name == this.PinnedNotesCaption) page = this.$route.query.pinnedPage;
            if (name == this.OtherNotesCaption) page = this.$route.query.notesPage;
            return page ? Number(page) : 1;
        },

        
        
        async adjustPage(name, direction= -1){
            let pinnedPage = this.$route.query.pinnedPage ? this.$route.query.pinnedPage : 1;
            let notesPage = this.$route.query.notesPage ? this.$route.query.notesPage : 1;
            let pinned;
            if (name == this.PinnedNotesCaption){
                pinnedPage += direction;
                pinned = true;
            }
            if (name == this.OtherNotesCaption){
                notesPage += direction;
                pinned = false;
            }
            this.$emit("PushToRouter", pinnedPage, notesPage);
            this.$emit("Refresh", pinned);
            this.$emit('ScrollToTop', name);
        },

        async goToPage(name, page=1){
            let pinnedPage = this.$route.query.pinnedPage ? this.$route.query.pinnedPage : 1;
            let notesPage = this.$route.query.notesPage ? this.$route.query.notesPage : 1;
            let pinned;
            if (name == this.PinnedNotesCaption){
                pinnedPage = page;
                pinned = true;
            }
            if (name == this.OtherNotesCaption){
                notesPage = page;
                pinned = false;
            }
            this.$emit("PushToRouter", pinnedPage, notesPage);
            this.$emit("Refresh", pinned);
            this.$emit('ScrollToTop', name);
        },
    }
}
</script>

<style lang="scss" scoped>

.pagination__button{
  @include basic-button();
  font-size: 1rem;
  background-color: $global-color;
  color: black;
  line-height: 1rem;
    &:hover{
      background-color: black;
      color: $global-color;
    }
}
</style>