<template lang="pug"> 
.container
  .delete-project-requests
    .project(v-for="(project, index) in requests" :key="index")
      .project-name
        h2 {{project.nombre}}
      .actions
        button.btn.btn-icon(@click="confirmRequest(project)")
          i.fas.fa-check
        button.btn.btn-icon(@click="cancelRequest(project)")
          i.fas.fa-times

</template>

<script src="./index.js"></script>

<style lang="scss" scoped src="./styles.scss"></style>
