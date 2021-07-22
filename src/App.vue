<template>
  <div id="app">
    <div
      class="shadow mx-auto"
      id="nav"
    >
      <span @click="HomePage">
        <router-link
          to="/"
          class="RouterLink"
          :hidden="!JWT"
        > MyNotes</router-link>
      </span> |
      <router-link
        to="/login"
        class="RouterLink"
      > 
        <span :hidden="!(JWT == undefined || JWT == '')"> sign in </span>
        <span :hidden="!JWT">{{USER}}</span>
      </router-link>
       |
      <span @click="CreateNotePage">
        <router-link
          to="/note/create"
          class="RouterLink"
          :hidden="!JWT"
        > create note</router-link>
      </span>
      <div 
        id="SearchBar"
        class="NewLineOnMobile mx-auto"
        :hidden="!JWT" 
      >
        <b-input-group class="d-inline CustomInput">
          <b-input
            type="text"
            class="d-inline CustomInput"
            id="SearchInput"
            placeholder="search"
            @keyup="CheckEnter"
          />
          <b-input-group-append class="d-inline">
            <b-button 
              class="CustomInput CustomInputButton"
              @click="searchNotes"
            />
          </b-input-group-append>
        </b-input-group>
      </div>
    </div>
    <div class="SiteContent">
      <router-view/>
      <div
        id="Popup"
        class="invisible"
      >
        <span id="PopupMessage"/>
      </div>
    </div>
  </div>
</template>

<script>
import { moduleName as AuthModule, getterTypes as AuthGetters, actionTypes as AuthActions} from "./store/modules/auth";
import { moduleName as NotesModule, /*getterTypes as NotesGetters,*/ actionTypes as NotesActions} from "./store/modules/notes";
import { mapActions, mapGetters } from "vuex";

export default{
  name: "App",
  methods: {
    ...mapActions(AuthModule, [
        AuthActions.ACTION_LOGOUT,
        AuthActions.ACTION_CHECK_COOKIE
    ]),
    ...mapActions(NotesModule, [
        NotesActions.ACTION_GET_NOTES,
        NotesActions.ACTION_CLEAR_NOTE,
    ]),

    CheckEnter(e){
        if (e.keyCode == 13){
          this.searchNotes();
        }
    },

    async GetNotes(pinned=false, page=1){
      let searchQuery = this.$route.query.search;
      await this[NotesActions.ACTION_GET_NOTES]({
        pinned: pinned,
        page: page-1,
        queryString: searchQuery ? searchQuery : ''
      });
    },
    searchNotes(){
      let Searchable = document.querySelector("#SearchInput").value;
      let routeName = this.$route.name;
      this.$router.push({name:"Search", query: {search: Searchable}});
      if (routeName == "Home" || routeName == "Search"){
        this.GetNotes();
        this.GetNotes(true);
      }
    },

    HomePage(){ 
      this.GetNotes();
      this.GetNotes(true);
    },

    CreateNotePage(){
      this[NotesActions.ACTION_CLEAR_NOTE]();
    },

    logout(){
      this[AuthActions.ACTION_LOGOUT]();
    }
  },

  computed: {
    ...mapGetters(AuthModule, [
        AuthGetters.GETTER_JWT,
        AuthGetters.GETTER_USER,    
    ]),
    JWT(){
      return this[AuthGetters.GETTER_JWT];
    },
    USER(){
      return this[AuthGetters.GETTER_USER];
    }
  },

  created(){
    this[AuthActions.ACTION_CHECK_COOKIE]();
    if (this.JWT == undefined || this.JWT == '') this.$router.push({name:"Login"});
  }
};
</script>



<style>
html{
  scroll-behavior: smooth;
}
@media(max-width:699px){
  .NewLineOnMobile{
    display: block;
    width: 90% !important;
  }
}
@media(min-width:700px){
  .NewLineOnMobile{
    display: inline-block;
  }
}

#app {
  overflow: hidden;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 10px;
  /*padding-bottom: 40px !important;
  height: 2rem;*/
  background-color:aquamarine;
  width: 100vw;
  z-index: 100;
  position: fixed;
}

.SiteContent{
  padding-top: calc(2rem + 60px);
  /*padding-top: 2rem;*/
  z-index: 10;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.cursor-pointer{
  cursor: pointer !important;
}

.cursor-default{
  cursor: default !important;
}

.CustomInput{
  height: 1.5rem !important;
  width: calc(100% - 2rem) !important;
}

.CustomInputButton{
  width: 1.5rem !important;
  background-image: url("./assets/search.png");
  background-repeat: round;
  background-color: khaki;
}

.carousel-slide{
  max-width: 100%;
  display:none;
  justify-content: center;
  align-items: center;
  vertical-align: middle;
}
.active{
  display: flex !important;
}

.carousel-item img{
  width: auto !important;
  max-width: 100% !important;
  height: auto !important;
  max-height: 100% !important;
}

.carousel-control-next-icon, .carousel-control-prev-icon{
  background-color: black;
  border-radius: 50%;
  background-size: contain;
}

.InputError{
  color: red;
  font-weight: bold;
  font-size: 1rem;
  font-style: italic;
}

.InputSuccess{
  color: turquoise;
  font-weight: bold;
  font-size: 1rem;
  font-style: italic;
}

#Popup{
  width: 25vw;
  height: 25vh;
  position: fixed;
  top: 37.5vh;
  left: 37.5vw;
  background-color:whitesmoke;
  border: 2px solid turquoise;
  border-radius: 1rem;
  opacity: 1;
}
.invisible{
  display: none;
}
</style>