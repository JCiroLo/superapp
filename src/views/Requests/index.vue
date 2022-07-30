<template lang="pug"> 
.app-requests
  h2 Peticiones
  .project-requests
    .request(v-for="(request, index) in projectRequests" :key="index")
      .request-name(@click="$router.push({ name: 'Project', params: { projectId: request.idProyecto } })")
        p 
          | Eliminar el proyecto con código 
          b {{request.idProyecto}}
      .actions
        button.btn.btn-icon(@click="confirmRequest('project', request)")
          i.fas.fa-check
        button.btn.btn-icon(@click="cancelRequest('project', request)")
          i.fas.fa-times
  .user-requests
    .request(v-for="(request, index) in userRequests" :key="index")
      .request-name
        p 
          | Eliminar el usuario 
          b {{request.username}}
      .actions
        button.btn.btn-icon(@click="confirmRequest('user', request)")
          i.fas.fa-check
        button.btn.btn-icon(@click="cancelRequest('user', request)")
          i.fas.fa-times
  

</template>

<script src="./index.js"></script>

<style lang="scss" scoped src="./styles.scss"></style>
