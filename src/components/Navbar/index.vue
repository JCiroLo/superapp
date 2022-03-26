<template lang="pug">
header
  .container
    router-link.brand(to="/")
      img(:src="require('../../assets/img/icon.png')" alt="alt")
      span Super App City 
    .navbar-actions
      router-link.btn.btn-text(to="/" v-if="isAuthenticated")
        i.fas.fa-tasks-alt.fa-fw
        span.ms-1 Proyectos
      router-link.btn.btn-text(to="/requests" v-if="isAuthenticated && hasRole(ROLES.ROLE_INTERVENTOR)")
        i.fas.fa-bell.fa-fw
        span.ms-1 Peticiones
      button.btn.btn-text(v-if="isAuthenticated" @click="logoutUser")
        i.fas.fa-power-off.fa-fw
        span.ms-1 Cerrar sesión
      
</template>

<script src="./index.js"></script>
<style lang="scss" scoped src="./styles.scss"></style>
