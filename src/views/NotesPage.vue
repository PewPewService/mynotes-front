<template>
  <div>
    <div
      id="Popup"
      ref="Popup"
      class="invisible"
    >
      <span 
        id="PopupMessage"
        ref="PopupMessage"
      />
    </div>
    <div
      v-for="Notes in this.Notes"
      :key="Notes.name"
      :id="Notes.name"
      :ref="Notes.name"
      :hidden="!Notes.notes.length"
    >
      <span class="mt-3 mb-3 mx-auto bold h2"> {{Notes.name.replace('_',' ')}} </span>
      <b-card-group deck class="flex-wrap justify-content-around">
        <b-card
          v-for="Note in Notes.notes"
          :key="Note.id"
          :header="Note.name"
          class="flex-card mb-4 mx-auto"
        >

        <b-carousel
            class="w-100 mx-auto carousel"
            :interval="0"
            no-animation
            :controls="(Note.images.length > 1) ? true : false"
            :indicators="(Note.images.length > 1) ? true : false"
            :hidden="!Note.images.length"
            style="text-shadow: 1px 1px 2px #333;"
        >
            <b-carousel-slide
                v-for="image in Note.images.length"
                :key="image"
                :img-src="Note.images[image-1]"
                class="carousel-slide"
            >
            </b-carousel-slide>
        </b-carousel>

          <div class="note-management-buttons-field">
            <b-button
              :id="Note.id"
              :class="'note-management-button note-management-button-pin'.concat(Note.pinned ?
               ' note-management-button-unpin': '')"
              :title="Note.pinned ? 'unpin' : 'pin' "
              @click="PinNote"
            /> 
            <b-button 
              :id="Note.id"
              class="note-management-button note-management-button-edit"
              title="edit"
              @click="EditNote"
            />
            <b-button
              :id="Note.id"
              class="note-management-button note-management-button-copy"
              title="copy"
              @click="CopyNote"
            />
            <b-button
              :id="Note.id"
              class="note-management-button note-management-button-delete"
              title="delete"
              @click="DeleteNote"
            />
          </div>

          <div
            :hidden="!Note.tags.length"
            class="note-tags-field mx-auto"
          >
            <span
              v-for="tag in Note.tags"
              :key="tag"
              class="note-tag ml-1 mr-1"
              @click="SearchByTag(tag)"
            >{{tag}}</span>
          </div>

          <b-card-text class="mx-auto">
            {{Note.text}}
          </b-card-text>
        </b-card>
      </b-card-group>
      
      <div
        :id="'pagination'+Notes.name"
        :hidden="PagesCount(Notes.name) < 2"
        class="w-100 mx-auto mt-3 mb-3"
      >
      <b-button
        :disabled="CurrentPage(Notes.name) == 1"
        class="pagination-button ml-1 mr-1"
        @click="firstPage(Notes.name)"
      > {{Pagination.start}} </b-button>
      <b-button
        :disabled="CurrentPage(Notes.name) == 1"
        class="pagination-button ml-1 mr-1"
        @click="prevPage(Notes.name)"
      > {{Pagination.prev}} </b-button>

      <b-button
        v-for="n in 5"
        :key="n"
        :disabled="n == 3"
        :hidden="(n-3 + CurrentPage(Notes.name) > PagesCount(Notes.name)) || (n-3 + CurrentPage(Notes.name) < 1)"
        class="pagination-button ml-1 mr-1"
        @click="goToPage(Notes.name, n-3 + CurrentPage(Notes.name))"
      > {{n-3 + CurrentPage(Notes.name)}}</b-button>

      <b-button
        :disabled="CurrentPage(Notes.name) == PagesCount(Notes.name)"
        class="pagination-button ml-1 mr-1"
        @click="nextPage(Notes.name)"
      > {{Pagination.next}} </b-button>
      <b-button
        class="pagination-button ml-1 mr-1"
        :disabled="CurrentPage(Notes.name) == PagesCount(Notes.name)"
        @click="lastPage(Notes.name)"
      > {{Pagination.end}} </b-button>
      </div>
    </div>
    
    <div
      :hidden="NotesFound"
      class="mt-3 mx-auto"
    > Wow, such empty </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { moduleName, getterTypes, actionTypes } from "../store/modules/notes"

export default {
  name: 'Home',
  data(){
    return {
      PinnedNotesCaption : "PINNED_NOTES",
      OtherNotesCaption : "NOTES",
      page: {
        pinned: 1,
        other: 1
        },
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
        getterTypes.GETTER_PINNED_NOTES,
        getterTypes.GETTER_OTHER_NOTES,
        getterTypes.GETTER_PINNED_PAGES_COUNT,
        getterTypes.GETTER_OTHER_PAGES_COUNT,
        getterTypes.GETTER_NOTE_RESPONSE_ERROR,
        getterTypes.GETTER_NOTE_RESPONSE_SUCCESS,
    ]),

    Error(){
      return this[getterTypes.GETTER_NOTE_RESPONSE_ERROR];
    },
    Success(){
      return this[getterTypes.GETTER_NOTE_RESPONSE_SUCCESS];
    },

    Notes(){
      return [
        {
          name: this.PinnedNotesCaption,
          notes: this[getterTypes.GETTER_PINNED_NOTES]
        },
        {
          name: this.OtherNotesCaption,
          notes: this[getterTypes.GETTER_OTHER_NOTES]
        }
        ];
    },

    PagesCountAll(){
      return {
        pinned: this.PagesCount(this.PinnedNotesCaption),
        other: this.PagesCount(this.OtherNotesCaption)
      }
    },

    NotesFound(){
      if (+this[getterTypes.GETTER_PINNED_PAGES_COUNT] + +this[getterTypes.GETTER_OTHER_PAGES_COUNT]) return true
      else return false;
    },
  },

  methods: {
    ...mapActions(moduleName, [
        actionTypes.ACTION_GET_NOTES,
        actionTypes.ACTION_PIN_NOTE,
        actionTypes.ACTION_COPY_NOTE,
        actionTypes.ACTION_DELETE_NOTE
    ]),

    async ConfirmAction(message){
        return await this.$bvModal.msgBoxConfirm(message)
          .then(value => {
            return value;
          })
    },

  PopUpMessage(message = ''){
    if (!message) message = this.Error.data ? 
        this.Error.data : this.Success.data;
    let popupBackground = this.$refs.Popup;
    let popupMessage = this.$refs.PopupMessage;
    popupMessage.innerHTML = message;
    popupBackground.classList.remove("invisible");
    popupBackground.classList.add("animated", "fadeIn");
    setTimeout( () => {
        popupBackground.classList.remove("fadeIn", "animated");
        popupBackground.classList.add("fadeOut", "animated");
        setTimeout(() => {
        popupBackground.classList.remove("animated", "fadeOut");
        popupBackground.classList.add("invisible");
        }, 400);
    }, 1600);
  },

    SearchByTag(tag){
      this.$router.push({name:"Search", query: {search: tag}});
      this.GetNotes(true);
      this.GetNotes();
    },
   
    async GetNotes(pinned=false){
      let page;
      if (pinned) page = this.$route.query.pinnedPage;
      else page = this.$route.query.notesPage;
      page = page ? page : 1;
      let searchQuery = this.$route.query.search;
      await this[actionTypes.ACTION_GET_NOTES]({
        pinned: pinned,
        page: page-1,
        queryString: searchQuery ? searchQuery : ''
      });
    },

    PagesCount(name){
      if (name == this.PinnedNotesCaption) return this[getterTypes.GETTER_PINNED_PAGES_COUNT];
      if (name == this.OtherNotesCaption) return this[getterTypes.GETTER_OTHER_PAGES_COUNT];
      return null;
    },

    CurrentPage(name){
      let page;
      if (name == this.PinnedNotesCaption) page = this.$route.query.pinnedPage;
      if (name == this.OtherNotesCaption) page = this.$route.query.notesPage;
      return page ? page : 1;
    },

    async PinNote(event){
      await this[actionTypes.ACTION_PIN_NOTE] (event.target.id);
      this.PopUpMessage();
      await this.GetNotes(true);
      await this.GetNotes();
      this.CheckEmptyPage();
    },

    EditNote(event){
      this.$router.push({name:"NoteEditing", query: {id: event.target.id}});
    },

    async CopyNote(event){
      await this[actionTypes.ACTION_COPY_NOTE] (event.target.id);
      this.PopUpMessage();
      this.GetNotes(true);
      this.GetNotes();
    },

    async DeleteNote(event){
      if ( await this.ConfirmAction('Are you sure you want to delete this note?') ){
        await this[actionTypes.ACTION_DELETE_NOTE] (event.target.id);
        this.PopUpMessage();
        await this.GetNotes(true);
        await this.GetNotes();
        this.CheckEmptyPage();
      }
    },

    ScrollToTop(name){
      this.$refs[name][0].scrollIntoView();
      const rem = getComputedStyle(document.documentElement).fontSize;
      window.scrollBy(0, - ((2 * rem.substring(0, rem.length-2)) + 60) );
    },

    CheckEmptyPage(){
      let pinnedPage = this.CurrentPage(this.PinnedNotesCaption);
      let notesPage = this.CurrentPage(this.OtherNotesCaption); 
      let pinnedNotes = this.Notes[0].notes.length;
      let otherNotes = this.Notes[1].notes.length;
      if (pinnedNotes == 0 && pinnedPage > 1){
        pinnedPage -= 1;
      }
      if (otherNotes == 0 && notesPage > 1){
        notesPage -= 1;
      }
      this.PushToRouter(pinnedPage, notesPage);
      this.GetNotes(true);
      this.GetNotes();
    },

    PushToRouter(pinnedPage, notesPage){
      let query = {};
      let search = this.$route.query.search;
      let name = this.$route.name;
      if (search) query.search = search;
      if (pinnedPage-1) query.pinnedPage = pinnedPage;
      if (notesPage-1) query.notesPage = notesPage;
      this.$router.push({name: name, query:query});
    },

    async firstPage(name){
      let pinnedPage = this.$route.pinnedPage ? this.$route.pinnedPage : 1;
      let notesPage = this.$route.notesPage ? this.$route.notesPage : 1;
      let pinned;
      if (name == this.PinnedNotesCaption){
        pinnedPage = 1;
        pinned = true;
      }
      if (name == this.OtherNotesCaption){
        notesPage = 1;
        pinned = false;
      }
      this.PushToRouter(pinnedPage,notesPage);
      await this.GetNotes(pinned);
      this.ScrollToTop(name);
    },

    async prevPage(name){
      let pinnedPage = this.$route.pinnedPage ? this.$route.pinnedPage : 1;
      let notesPage = this.$route.notesPage ? this.$route.notesPage : 1;
      let pinned;
      if (name == this.PinnedNotesCaption){
        pinnedPage -= 1;
        pinned = true;
      }
      if (name == this.OtherNotesCaption){
        notesPage -= 1;
        pinned = false;
      }
      this.PushToRouter(pinnedPage, notesPage);
      await this.GetNotes(pinned);
      this.ScrollToTop(name);
    },

    async goToPage(name, page){
      let pinnedPage = this.$route.pinnedPage ? this.$route.pinnedPage : 1;
      let notesPage = this.$route.notesPage ? this.$route.notesPage : 1;
      let pinned;
      if (name == this.PinnedNotesCaption){
        pinnedPage= page;
        pinned = true;
      }
      if (name == this.OtherNotesCaption){
        notesPage = page;
        pinned = false;
      }
      this.PushToRouter(pinnedPage, notesPage);
      await this.GetNotes(pinned);
      this.ScrollToTop(name);
    },

    async nextPage(name){
      let pinnedPage = this.$route.pinnedPage ? this.$route.pinnedPage : 1;
      let notesPage = this.$route.notesPage ? this.$route.notesPage : 1;
      let pinned;
      if (name == this.PinnedNotesCaption){
        pinnedPage += 1;
        pinned = true;
      }
      if (name == this.OtherNotesCaption){
        notesPage += 1;
        pinned = false;
      }
      this.PushToRouter(pinnedPage, notesPage);
      await this.GetNotes(pinned);
      this.ScrollToTop(name);
    },

    async lastPage(name){
      let pinnedPage = this.$route.pinnedPage ? this.$route.pinnedPage : 1;
      let notesPage = this.$route.notesPage ? this.$route.notesPage : 1;
      let pinned;
      if (name == this.PinnedNotesCaption){
        pinnedPage = this.PagesCount(name);
        pinned = true;
      }
      if (name == this.OtherNotesCaption){
        notesPage = this.PagesCount(name);
        pinned = false;
      }
      this.PushToRouter(pinnedPage, notesPage);
      await this.GetNotes(pinned);
      this.ScrollToTop(name);
    },
  },
  
  async created() {
    await this.GetNotes(true);
    await this.GetNotes();
  }
  
}
</script>

<style lang="scss" scoped>
@mixin flexcard($number){
  flex: $number;
  max-width: $number;
  position: relative;
  padding-bottom: 5rem;
}

@media(max-width:699px){
  .flex-card{
    @include flexcard(80%);
  }
}

@media(min-width:700px){
  .flex-card{
    @include flexcard(40%);
  }
}

.note-management-buttons-field{
  height: 2rem;
  position: absolute;
  bottom:0.5rem;
  right: 0.5rem;
}

.note-management-button{
  @include basic-button();
  margin-left:0.5rem;
  &:hover{
    background-color: $global-color;
  }
}

.note-tags-field{
  white-space: nowrap;
  overflow: scroll;
  width: 90%;
  height: 2rem;
  position: absolute;
  left: 0%;
  margin-left: 5% !important;
  bottom: 3rem;
  &::-webkit-scrollbar{
    display: none;
  }
}

.note-tag{
  background-color: gray; 
  color: white;
  height: 1rem;
  line-height: 1rem;
  border-radius: 1rem;
  padding: 0 0.2rem 0 0.2rem;
  text-align: right;
  cursor: pointer;
  &:hover{
    background-color: $global-color;
    color: black;
  }
}

.note-management-button-pin{
  background-image: url($pin_icon);

}
.note-management-button-edit{
  background-image: url($edit_icon);
}
.note-management-button-copy{
  background-image: url($copy_icon);
}
.note-management-button-delete{
  background-image: url($delete_icon);
  &:hover{
    background-color: $global-error;
  }
}
.note-management-button-unpin:hover{
  background-color: $global-error;
}

.carousel, .carousel-slide{
    height: 20rem !important;
}

.pagination-button{
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

#Popup{
  width: fit-content;
  height: 2rem;
  line-height: 2rem;
  font-size: 1rem;
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color:whitesmoke;
  border: 2px solid $global-color;
  border-radius: 1rem;
  padding: 0 1rem 0 1rem;
  vertical-align: middle;
}
</style>