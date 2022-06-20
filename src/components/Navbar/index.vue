<template lang="pug">
header(:class="{collapsed: navbarState}")
  .main-navbar
    router-link.brand(to="/")
      img(:src="require('../../assets/img/icon.png')" alt="alt")
      span Super App City 
    .navbar-toggler
      button.btn.btn-text(@click="switchNavbar")
        i.fas.fa-bars.fa-fw
    .navbar-actions
      router-link.btn.btn-text(to="/" v-if="isAuthenticated")
        i.fas.fa-tasks-alt.fa-fw
        span.ms-1 Proyectos
      router-link.btn.btn-text(to="/users" v-if="isAuthenticated && hasRole(ROLES.ROLE_INTERVENTOR)")
        i.fas.fa-users.fa-fw
        span.ms-1 Usuarios
      span.separator
      router-link.btn.btn-text(to="/requests" v-if="isAuthenticated && hasRole(ROLES.ROLE_INTERVENTOR)")
        i.fas.fa-bell.fa-fw
        span.ms-1 Peticiones
      span.separator
      button.btn.btn-text(v-if="isAuthenticated" @click="logoutUser")
        i.fas.fa-power-off.fa-fw
        span.ms-1 Cerrar sesión
      
</template>

<script src="./index.js"></script>
<style lang="scss" scoped src="./styles.scss"></style>
