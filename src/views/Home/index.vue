<template lang="pug"> 
Sidebar(:items="sidebarItems")

  button.btn-float.btn.btn-main(@click="toggleModalVisibility('create')")
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
            button.btn.btn-icon(@click="toggleModalVisibility('edit', project)"): i.fas.fa-pencil.fa-fw
            button.btn.btn-icon(@click="(projectToDelete = project)"): i.fas.fa-trash-alt.fa-fw
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
          .tab(:class="{selected: currentTab === 1, filled: currentTab >= 1, disabled: !currentProject.gamificacion }" @click="currentProject.gamificacion && nextTab(1, true)")
            span Gamificación
            i.fa-circle(:class="[currentTab >= 1 || !currentProject.gamificacion ? 'fas' : 'far']")
          .tab(:class="{selected: currentTab === 2, filled: currentTab >= 2 }" @click="nextTab(2, true)")
            span Información extra 
            i.fa-circle(:class="[currentTab >= 2 ? 'fas' : 'far']")
        .tabs-content
          transition(name="fade" mode="out-in")
            // INFORMACIÓN DEL PROYECTO
            .tab-content(v-if="currentTab === 0")
              form.app-form(noValidate @submit.prevent="nextTab('next')")
                .form-field
                  input(type="text" placeholder="Nombre" v-model="currentProject.nombre")
                .form-field
                  textarea(placeholder="Resumen" v-model="currentProject.resumen")
                .form-field
                  textarea(placeholder="Descripción" v-model="currentProject.descripcion")
                .form-field
                  textarea(placeholder="Objetivos" v-model="currentProject.objetivos")
                .form-field
                  textarea(placeholder="Hitos" v-model="currentProject.principalItos")
                // .form-field
                  input(type="text" placeholder="Mensaje de participación" v-model="currentProject.resumen")
                // .form-field
                  label Mensajes de notificación
                  ListInput(
                    type="text" 
                    placeholder="Nuevo mensaje" 
                    :list="currentProject.cronograma" 
                    @addElement="handleAddCronograma"
                    @removeElement="handleRemoveCronograma"
                    ordered
                  )
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
                .form-field
                  label.w-100 Con gamificación (?)
                  ToggleButton.toggle-green(v-model="currentProject.gamificacion")

            // GAMIFICACIÓN
            .tab-content(v-else-if="currentTab === 1")
              form.app-form(noValidate @submit.prevent="nextTab('next')")
                .form-field
                  input(type="text" placeholder="Nombre" v-model="newGamification.nombre")
                .form-field
                  input(type="text" placeholder="Título" v-model="newGamification.titulo")
                .form-field
                  input(type="text" placeholder="TYC" v-model="newGamification.tyc")
                .form-field
                  label Fecha de finalizacion
                  input(type="date" v-model="currentProject.fechaTerminacion")
                .form-field
                  input(type="number" placeholder="Ganadores" v-model="newGamification.ganadores")
                .form-field
                  input(type="text" placeholder="Mensaje de participación" v-model="newGamification.mensajeParticipacion")
                .form-field
                  input(type="text" placeholder="Mensaje de ganador" v-model="newGamification.mensajeGanador")
                .form-field
                  label.w-100 Habilitado
                  ToggleButton.toggle-green(v-model="newGamification.habilitado")
                .form-field
                  label Premios
                  ListInput(
                    type="text"
                    placeholder="Nuevo premio" 
                    :list="newGamification.premios" 
                    @addElement="(item) => newGamification.premios.push(item)"
                    @removeElement="(index) => newGamification.premios.splice(index, 1)"
                  )
                .form-field
                  label Patrocinadores
                  ListInput(
                    type="text"
                    placeholder="Nuevo patrocinador" 
                    :list="newGamification.patrocinadores" 
                    @addElement="(item) => newGamification.patrocinadores.push(item)"
                    @removeElement="(index) => newGamification.patrocinadores.splice(index, 1)"
                  )
            
            // INFORMACIÓN EXTRA
            .tab-content(v-else-if="currentTab === 2")
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
                      input(type="number" placeholder="Longitud" v-model="currentProject.localizacion[0]")
                    .form-input.col-6.pe-0
                      input(type="number" placeholder="Latitud" v-model="currentProject.localizacion[1]")
                .form-field
                  label Presupuesto
                  input(type="number" placeholder="Presupuesto" v-model="currentProject.presupuesto")
                .form-field
                  label Fecha
                  input(type="date" v-model="currentProject.fecha")
                .form-field
                  label Miniatura
                  .image-input
                    .image-input-preview
                      img(:src="renderThumbnail()")
                    input(type="file" accept="image/*" @change="handleChangeImage")
    template(#modal-footer)
      .d-flex.justify-content-end
        transition(name="fade" mode="out-in")
          button.btn.btn-main-outline(v-if="currentTab === 0" @click="toggleModalVisibility('close')") Cancelar
          button.btn.btn-main-outline(v-else @click="nextTab('prev')") Atrás
        transition(name="fade" mode="out-in")
          button.btn.btn-main.ms-3(v-if="currentTab === 2" @click="handleSubmitProjectForm") {{action === 'create' ? 'Crear' : 'Editar'}}
          button.btn.btn-main.ms-3(v-else @click="nextTab('next')") Siguiente
          

  Modal(:show="projectToDelete" @closeModal="projectToDelete = null")
    template(#modal-header)
      h4.m-0: b Eliminar proyecto
    template(#modal-body)
      p 
        | ¿Estás seguro que quieres eliminar el proyecto 
        b {{projectToDelete.nombre}}
        | ? Esta acción no se podrá revertir.
    template(#modal-footer)
      .d-flex.justify-content-end
        button.btn.btn-main-outline(@click="projectToDelete = null") Cancelar
        button.btn.btn-main.ms-3(@click="deleteProject") Eliminar
</template>

<script src="./index.js"></script>

<style lang="scss" scoped src="./styles.scss"></style>
