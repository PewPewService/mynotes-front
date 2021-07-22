<template>
  <div>
    <div
      v-for="Notes in this.Notes"
      :key="Notes.name"
      :id="Notes.name"
      :hidden="!Notes.notes.length"
    >
      <span class="mt-3 mb-3 w-75 mx-auto bold h2"> {{Notes.name.replace('_',' ')}} </span>
      <b-card-group deck class="flex-wrap justify-content-around">
        <b-card
          v-for="Note in Notes.notes"
          :key="Note.id"
          :header="Note.name"
          class="FlexCard mb-4 mx-auto"
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
                class="carousel-slide"
                v-for="image in Note.images.length"
                :key="image"
                :img-src="Note.images[image-1]"
            >
            </b-carousel-slide>
        </b-carousel>

          <div class="NoteManagementButtonsField">
            <b-button
              :id="Note.id"
              :class="'NoteManagementButton NoteManagementButton_Pin'.concat(Note.pinned ?
               ' NoteManagementButton_Unpin': '')"
              :title="Note.pinned ? 'unpin' : 'pin' "
              @click="PinNote"
            /> 
            <b-button 
              :id="Note.id"
              class="NoteManagementButton NoteManagementButton_Edit"
              title="edit"
              @click="EditNote"
            />
            <b-button
              :id="Note.id"
              class="NoteManagementButton NoteManagementButton_Copy"
              title="copy"
              @click="CopyNote"
            />
            <b-button
              :id="Note.id"
              class="NoteManagementButton NoteManagementButton_Delete"
              title="delete"
              @click="DeleteNote"
            />
          </div>

          <div
            class="NoteTagsField mx-auto"
            :hidden="!Note.tags.length"
          >
            <span
              class="NoteTag ml-1 mr-1"
              v-for="tag in Note.tags"
              :key="tag"
              @click="SearchByTag(tag)"
            >{{tag}}</span>
          </div>

          <b-card-text class="mx-auto">
            {{Note.text}}
          </b-card-text>
        </b-card>
      </b-card-group>
      
      <div
        class="w-100 mx-auto mt-3 mb-3"
        :id="'pagination'+Notes.name"
        :hidden="PagesCount(Notes.name)<2"
      >
      <b-button
        class="paginationButton ml-1 mr-1"
        @click="firstPage(Notes.name)"
        :disabled="CurrentPage(Notes.name) == 1"
      > {{Pagination.start}} </b-button>
      <b-button
        class="paginationButton ml-1 mr-1"
        @click="prevPage(Notes.name)"
        :disabled="CurrentPage(Notes.name)==1"
      > {{Pagination.prev}} </b-button>

      <b-button
        class="paginationButton ml-1 mr-1"
        v-for="n in 5"
        :key="n"
        :disabled="n == 3"
        :hidden="(n-3+CurrentPage(Notes.name) > PagesCount(Notes.name)) || (n-3+CurrentPage(Notes.name) < 1)"
        @click="goToPage(Notes.name, n-3 + CurrentPage(Notes.name))"
      > {{n-3+CurrentPage(Notes.name)}}</b-button>

      <b-button
        class="paginationButton ml-1 mr-1"
        :disabled="CurrentPage(Notes.name)==PagesCount(Notes.name)"
        @click="nextPage(Notes.name)"
      > {{Pagination.next}} </b-button>
      <b-button
        class="paginationButton ml-1 mr-1"
        :disabled="CurrentPage(Notes.name)==PagesCount(Notes.name)"
        @click="lastPage(Notes.name)"
      > {{Pagination.end}} </b-button>
      </div>
    </div>
    
    <div
      class="mt-3 w-75 mx-auto"
      :hidden="NotesFound"
    > Wow, such empty </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { moduleName, getterTypes, actionTypes } from "../store/modules/notes"
import Popup from "./PopUp.vue";

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

    // test
    async ConfirmAction(message){
        return await this.$bvModal.msgBoxConfirm(message)
          .then(value => {
            return value;
          })
    },
    //test

    // PopUpMessage(message = ''){
    //   if (!message) message = this[getterTypes.GETTER_NOTE_RESPONSE_ERROR].data ? 
    //       this[getterTypes.GETTER_NOTE_RESPONSE_ERROR].data : this[getterTypes.GETTER_NOTE_RESPONSE_SUCCESS].data;
    //   let popupBackground = document.querySelector("#PopupBackground");
    //   let popupMessage = document.querySelector("#PopupMessage");
    //   popupMessage.innerHTML = message;
    //   popupBackground.classList.remove("invisible");
    //   popupBackground.classList.add("animated", "fadeIn");
    // },

    // HidePopUp(){
    //   let popupBackground = document.querySelector("#PopupBackground");
    //   let popupButtons = document.querySelector("#PopupConfirmButtons");
    //   setTimeout( () => {
    //     popupBackground.classList.remove("fadeIn", "animated");
    //     popupBackground.classList.add("fadeOut", "animated");
    //     setTimeout(() => {
    //       popupBackground.classList.remove("animated", "fadeOut");
    //       popupBackground.classList.add("invisible");
    //       popupButtons.classList.add("invisible");
    //       }, 200);
    //   }, 1800);
    // },

    // PopUpConfirm(message){
    //   let popupButtons = document.querySelector("#PopupConfirmButtons");
    //   popupButtons.classList.remove("invisible");
    //   this.PopUpMessage(message);
    //   document.
    // },

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
      Popup.methods.PopUpMessage(this.Error, this.Success);
      await this.GetNotes(true);
      await this.GetNotes();
      this.CheckEmptyPage();
    },

    EditNote(event){
      this.$router.push({name:"NoteEditing", query: {id: event.target.id}});
    },

    async CopyNote(event){
      await this[actionTypes.ACTION_COPY_NOTE] (event.target.id);
      Popup.methods.PopUpMessage(this.Error, this.Success);
      this.GetNotes(true);
      this.GetNotes();
    },

    async DeleteNote(event){
      if ( await this.ConfirmAction('Are you sure you want to delete this note?') ){
        await this[actionTypes.ACTION_DELETE_NOTE] (event.target.id);
        Popup.methods.PopUpMessage(this.Error, this.Success);
        await this.GetNotes(true);
        await this.GetNotes();
        this.CheckEmptyPage();
      }
    },

    ScrollToTop(name){
        document.querySelector("#"+name).scrollIntoView();
        window.scrollBy(0, -(document.querySelector('#nav').offsetHeight));
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

<style scoped>
@media(max-width:699px){
  .FlexCard{
    flex: 80%;
    max-width: 80%;
    position: relative;
    padding-bottom: 3rem;
  }
}

@media(min-width:700px){
  .FlexCard{
    flex: 40%;
    max-width: 40%;
    position: relative;
    padding-bottom: 5rem;
  }
}

.NoteManagementButtonsField{
  height: 2rem;
  position: absolute;
  bottom:0.5rem;
  right: 0.5rem;
}

.NoteManagementButton{
  width: 2rem;
  height: 2rem;
  margin-left:0.5rem;
  background-size: cover;
}

.NoteManagementButton:hover{
  background-color: turquoise;
}

.NoteTagsField{
  white-space: nowrap;
  overflow: scroll;
  width: 90%;
  height: 2rem;
  position: absolute;
  left: 0%;
  margin-left: 5% !important;
  bottom: 3rem;
}

.NoteTagsField::-webkit-scrollbar{
  display: none;
}

.NoteTag{
  background-color: gray; 
  color: white;
  height: 1rem;
  line-height: 1rem;
  border-radius: 1rem;
  padding: 0 0.2rem 0 0.2rem;
  text-align: right;
  cursor: pointer;
}

.NoteTag:hover{
  background-color: teal;
}

.NoteManagementButton_Pin{
  background-image: url("../assets/pin.png");

}
.NoteManagementButton_Edit{
  background-image: url("../assets/edit.png");
}
.NoteManagementButton_Copy{
  background-image: url("../assets/copy.png");
}
.NoteManagementButton_Delete{
  background-image: url("../assets/delete.png");
}
.NoteManagementButton_Unpin{
  background-color: red;
}
.NoteManagementButton_Unpin:hover{
  background-color: darkred;
}

.carousel, .carousel-slide{
    height: 20rem !important;
}

.paginationButton{
  width: 2rem;
  height: 2rem;
  font-size: 1rem;
  border-radius: 15%;
  background-color: turquoise;
  color: black;
  line-height: 1rem;
}

.paginationButton:hover{
  background-color: black;
  color: turquoise;
}
</style>