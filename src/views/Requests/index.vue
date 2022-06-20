<template lang="pug"> 
.container
  .delete-requests
    h2 Peticiones de proyectos
    .request(v-for="(request, index) in projectRequests" :key="index")
      .request-name
        p {{request.nombre}}
      .actions
        button.btn.btn-icon(@click="confirmRequest('project', request)")
          i.fas.fa-check
        button.btn.btn-icon(@click="cancelRequest('project', request)")
          i.fas.fa-times
  .delete-requests
    h2 Peticiones de usuarios
    .request(v-for="(request, index) in userRequests" :key="index")
      .request-name
        p {{request.nombre}}
      .actions
        button.btn.btn-icon(@click="confirmRequest('user', request)")
          i.fas.fa-check
        button.btn.btn-icon(@click="cancelRequest('user', request)")
          i.fas.fa-times
  

</template>

<script src="./index.js"></script>

<style lang="scss" scoped src="./styles.scss"></style>
