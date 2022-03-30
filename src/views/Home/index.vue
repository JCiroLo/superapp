<template lang="pug"> 
.container
  button.create-project.btn.btn-main(@click="toggleModalVisibility('create')")
    i.fal.fa-plus.fa-fw
    span Crear proyecto
  .projects-table
    .app-projects(v-if="errorProjects.status")
      .error
        img(:src="require('../../assets/img/not-found.png')")
        h3 {{errorProjects.message}}
    .app-projects(v-else)
      .project(v-for="(project, index) in projects" :key="index")
        .project-summary(@click="$router.push({ name: 'Project', params: { projectName: project.nombre } })")
          .project-thumbnail
            img(:src="project.thumbnail", alt=" ")
          h2.project-title {{project.nombre}}
        .project-actions
          .project-hidden-actions
            button.btn.btn-icon(@click="(projectToDelete = project)"): i.fas.fa-trash.fa-fw
            button.btn.btn-icon(@click="toggleModalVisibility('edit', project)"): i.fas.fa-pencil.fa-fw
          ToggleButton.toggle-green(v-model="project.enabled" @change="switchProjectStatus(project)")

  Modal(:show="modalVisibility" @closeModal="toggleModalVisibility('close')" maxHeight)
    template(#modal-header)
      h4.m-0: b {{action === 'create' ? 'Crear' : 'Editar' }} proyecto 
    template(#modal-body)
      .form-tabs
        .tabs
          .tab.first-tab(:class="{selected: currentTab === 0, filled: currentTab >= 0 }" @click="nextTab(0, true)")
            span Información general
            i.fa-circle(:class="[currentTab >= 0 ? 'fas' : 'far']")
          .tab(:class="{selected: currentTab === 1, filled: currentTab >= 1 }" @click="nextTab(1, true)")
            span Información extra
            i.fa-circle(:class="[currentTab >= 1 ? 'fas' : 'far']")
        .tabs-content
          transition(name="fade" mode="out-in")
            .tab-content(v-if="currentTab === 0")
              form.app-form(noValidate @submit.prevent="nextTab(1)")
                .form-field
                  input#nombre(type="text" placeholder="Nombre" v-model="currentProject.nombre")
                .form-field
                  textarea#resumen(placeholder="Resumen" v-model="currentProject.resumen")
                .form-field
                  textarea#descripcion(placeholder="Descripción" v-model="currentProject.descripcion")
                .form-field
                  textarea#objetivos(placeholder="Objetivos" v-model="currentProject.objetivos")
                .form-field
                  textarea#principalItos(placeholder="Hitos" v-model="currentProject.principalItos")
                .form-field
                  label Cronograma
                  ListInput(
                    type="text" 
                    placeholder="Nuevo elemento" 
                    :list="currentProject.cronograma" 
                    @addElement="handleAddCronograma"
                    @removeElement="handleRemoveCronograma"
                    ordered
                  )
            .tab-content(v-else)
              form.app-form(noValidate @submit.prevent="handleSubmitProjectForm")
                .form-field
                  label Palabras clave
                  TagInput(
                    type="text"
                    placeholder="Palabra clave"
                    :tags="currentProject.palabrasClave" 
                    @addTag="handleAddPalabraClave"
                    @removeTag="handleRemovePalabraClave"
                  )
                .form-field
                  label Localización
                  .row.mx-0
                    .form-input.col-6.ps-0
                      input#longitud(type="number" placeholder="Longitud" v-model="currentProject.localizacionLong")
                    .form-input.col-6.pe-0
                      input#latitud(type="number" placeholder="Latitud" v-model="currentProject.localizacionLat")
                .form-field
                  label Presupuesto
                  input#presupuesto(type="number" placeholder="Presupuesto" v-model="currentProject.presupuesto")
                .form-field
                  label Fecha
                  input#fecha(type="date" v-model="currentProject.fecha")
                .form-field
                  label Miniatura
                  .image-input
                    .image-input-preview
                      img(:src="renderThumbnail()")
                    input(type="file" accept="image/*" @change="handleChangeImage")
    template(#modal-footer)
      transition(name="fade" mode="out-in")
        .d-flex.justify-content-end(v-if="currentTab === 0")
          button.btn.btn-main-outline(@click="toggleModalVisibility('close')") Cancelar
          button.btn.btn-main.ms-3(@click="nextTab(1)") Siguiente
        .d-flex.justify-content-end(v-else)
          button.btn.btn-main-outline(@click="nextTab(-1)") Atrás
          button.btn.btn-main.ms-3(@click="handleSubmitProjectForm") Crear

  Modal(:show="projectToDelete" @closeModal="projectToDelete = null")
    template(#modal-header)
      h4.m-0: b Eliminar proyecto '{{projectToDelete.nombre}}'
    template(#modal-body)
      p ¿Estás seguro que quieres eliminar el proyecto? Esta acción no se podrá revertir.
    template(#modal-footer)
      .d-flex.justify-content-end
        button.btn.btn-main-outline(@click="projectToDelete = null") Cancelar
        button.btn.btn-main.ms-3(@click="deleteProject") Eliminar
</template>

<script src="./index.js"></script>

<style lang="scss" scoped src="./styles.scss"></style>
