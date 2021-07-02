<template>
  <div id="app">
    <div
      class="shadow"
      id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/login">sign in</router-link> | 
      <router-link to="/note/create">create note</router-link> | 
      <router-link to="/note/edit">edit note</router-link> | 
      <router-link to="/search">search</router-link>
    </div>
    <div class="SiteContent">
      <router-view/>
    </div>
  </div>
</template>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  height: 2rem;
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
  cursor: pointer;
}

.cursor-default{
  cursor: default;
}
</style>
