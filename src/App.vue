<template>
  <div id="app">
    <div
      class="shadow mx-auto"
      id="nav"
    >
      <span @click="HomePage">
        <router-link
          :hidden="!JWT"
          to="/"
        > MyNotes</router-link>
      </span> |
      <router-link
        to="/login"
      > 
        <span :hidden="!(JWT == undefined || JWT == '')"> sign in </span>
        <span :hidden="!JWT">{{USER}}</span>
      </router-link>
       |
      <span @click="CreateNotePage">
        <router-link
          :hidden="!JWT"
          to="/note/create"
        > create note</router-link>
      </span>
      <div 
        id="SearchBar"
        :hidden="!JWT" 
        class="mx-auto"
      >
        <b-input-group class="d-inline custom-input">
          <b-input
            id="SearchInput"
            ref="SearchInput"
            type="text"
            class="d-inline custom-input"
            placeholder="search"
            @keyup="CheckEnter"
          />
          <b-input-group-append class="d-inline">
            <b-button 
              class="custom-input custom-input-button"
              @click="searchNotes"
            />
          </b-input-group-append>
        </b-input-group>
      </div>
    </div>
    <div class="site-content">
      <router-view/>
    </div>
  </div>
</template>

<script>
import { moduleName as AuthModule, getterTypes as AuthGetters, actionTypes as AuthActions} from "./store/modules/auth";
import { moduleName as NotesModule, /*getterTypes as NotesGetters,*/ actionTypes as NotesActions} from "./store/modules/notes";
import { mapActions, mapGetters } from "vuex";

export default{
  name: "App",

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
  },

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
      let Searchable = this.$refs.SearchInput.$el.value;
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
};
</script>

<style lang="scss">
  @import url('./styles/global.scss');
</style>