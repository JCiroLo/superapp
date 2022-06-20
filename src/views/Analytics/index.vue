<template lang="pug"> 
Sidebar(:items="sidebarItems")
  .application-analytics
    .projects-interactions
      .project-interaction.title-row
        .project-preview Imagen
        .project-name Nombre
        .project-surveys Encuestas
        .project-comments Comentarios
        .project-likes Interacciones
        .project-subscribers Suscriptores
        .project-status Estado

    .projects-interactions
      .project-interaction(v-for="project in interactions" :key="project.nombre")
        .project-preview: img(:src="project.thumbnail", alt="alt")
        .project-name {{project.nombre}}
        .project-surveys {{project.numeroEncuesta}}
        .project-comments {{project.numeroComentarios}}
        .project-likes
          .likes-bar
            .bar-content(:style="{width: `${project.numeroLikes * 100 / (project.numeroLikes + project.numeroDislikes)}%`}")
            .bar-rail
          .likes {{project.numeroLikes}}
          .dislikes {{project.numeroDislikes}}
        .project-subscribers {{project.numeroSuscritos}}
        .project-status: ToggleButton(v-model="project.estado" disabled) 

</template>

<script src="./index.js"></script>

<style lang="scss" scoped src="./styles.scss"></style>
