<template lang="pug"> 
div
  .project-image(:style="{backgroundImage: `url('${currentProjectImage}')`}" alt="alt")
    h1 {{currentProject.nombre}}
    .project-statistics
      .project-statistic.project-views
        i.fas.fa-eye
        span {{currentProjectStatistics.views}}
      .project-statistic.project-likes
        i.fas.fa-thumbs-up
        span {{currentProjectStatistics.likes}}
      .project-statistic.project-dislikes
        i.fas.fa-thumbs-down
        span {{currentProjectStatistics.dislikes}}

  .project-additional-info
    .project-date 
      i.fas.fa-calendar-alt 
      b Fecha: 
      | {{currentProject.fecha}}
    .project-localization 
      i.fas.fa-map-marked-alt
      b Localización: 
      | {{currentProject.localizacion[0]}} {{currentProject.localizacion[1]}}
    .project-budget 
      i.fas.fa-sack-dollar
      b Presupuesto: 
      | {{filterToCurrency(currentProject.presupuesto)}}
    .project-state
      b Estado: 
      ToggleButton.toggle-green(v-model="currentProject.enabled" @change="switchProjectStatus(currentProject)")
      
  .project-info
    .project-section
      h2 Información del proyecto
    .project-summary
      Accordion
        template(#accordion-toggler)
          p Descripción
        template(#accordion-content)
          p {{currentProject.descripcion}}
      Accordion
        template(#accordion-toggler)
          p Resumen
        template(#accordion-content)
          p {{currentProject.resumen}}
      Accordion
        template(#accordion-toggler)
          p Palabras clave
        template(#accordion-content)
          .project-keywords
            .keyword(v-for="(keyword, index) in currentProject.palabrasClave" :key="index") 
              i.fas.fa-circle
              | {{keyword}} 
      Accordion
        template(#accordion-toggler)
          p Cronograma
        template(#accordion-content)
          .project-keywords
            .keyword(v-for="(keyword, index) in currentProject.cronograma" :key="index") 
              b {{index + 1}}. 
              | {{keyword}} 
      Accordion
        template(#accordion-toggler)
          p Objetivos
        template(#accordion-content)
          p {{currentProject.objetivos}}
      Accordion
        template(#accordion-toggler)
          p Hitos
        template(#accordion-content)
          p {{currentProject.principalItos}}
            
    .project-section
      h2 Preguntas
      button.btn.btn-main(@click="modal.createQuestion = !modal.createQuestion")
        i.fal.fa-plus.fa-fw
        | Nueva
    .questions-table
      Accordion(v-if="rankingQuestions.length > 0")
        template(#accordion-toggler)
          p 
            i.fas.fa-chart-bar.fa-fw.me-2
            | Ranking
          span {{rankingQuestions.length}}
        template(#accordion-content)
          .questions  
            .question(v-for="(question, index) in rankingQuestions" :key="index")
              .question-summary
                span.field Pregunta:
                span.content {{question.pregunta}}
              .question-summary
                span.field Información:
                span.content {{question.informacion}}
              .question-summary
                span.field Opciones:
                .content
                  .question-option(v-for="(option, index) in question.opciones" :key="index")
                    li {{option}}
              .question-summary
                span.field Obligatorio:
                span.content 
                  ToggleButton.toggle-green(v-model="question.obligatorio")
                    template(#label="{ checked, classList }")
                      strong(:class="classList.label") {{ checked ? 'Si' : 'No' }}

      Accordion(v-if="hundredDollarsQuestions.length > 0")
        template(#accordion-toggler)
          p 
            i.fas.fa-sack-dollar.fa-fw.me-2
            | $100 
          span {{hundredDollarsQuestions.length}}
        template(#accordion-content)
          .questions  
            .question(v-for="(question, index) in hundredDollarsQuestions" :key="index")
              .question-summary
                span.field Pregunta:
                span.content {{question.pregunta}}
              .question-summary
                span.field Información:
                span.content {{question.informacion}}
              .question-summary
                span.field Opciones:
                .content
                  .question-option(v-for="(option, index) in question.opciones" :key="index")
                    li {{option}}
              .question-summary
                span.field Obligatorio:
                span.content 
                  ToggleButton.toggle-green(v-model="question.obligatorio")
                    template(#label="{ checked, classList }")
                      strong(:class="classList.label") {{ checked ? 'Si' : 'No' }}

      Accordion(v-if="kanoModelQuestions.length > 0")
        template(#accordion-toggler)
          p 
            i.fab.fa-kickstarter-k.fa-fw.me-2
            | Kano Model
          span {{kanoModelQuestions.length}}
        template(#accordion-content)
          .questions  
            .question(v-for="(question, index) in kanoModelQuestions" :key="index")
              .question-summary
                span.field Pregunta:
                span.content {{question.pregunta}}
              .question-summary
                span.field Información:
                span.content {{question.informacion}}
              .question-summary
                span.field Opciones:
                .content
                  .question-option(v-for="(option, index) in question.opciones" :key="index")
                    li {{option}}
              .question-summary
                span.field Obligatorio:
                span.content 
                  ToggleButton.toggle-green(v-model="question.obligatorio")
                    template(#label="{ checked, classList }")
                      strong(:class="classList.label") {{ checked ? 'Si' : 'No' }}

    .project-section
      h2 Comentarios
      button.btn.btn-main(@click="modal.createComment = !modal.createComment")
        i.fal.fa-plus.fa-fw
        | Nuevo
    .project-comments
      .project-comment(v-for="(comment, index) in projectComments" :key="index")
        .comment-header
          .comment-user.anonymous {{!comment.anonimo ? comment.username : 'Anónimo'}}
          .comment-date {{filterFormatDate(comment.fecha)}}
        .comment {{comment.comentario}}
        .comment-actions
          button.btn.btn-icon(@click="deleteComment(comment)"): i.fas.fa-trash.fa-fw

  Modal(:show="modal.createQuestion" @closeModal="modal.createQuestion = false")
    template(#modal-header)
      h4.m-0: b Nueva pregunta
    template(#modal-body)
      form.app-form(noValidate @submit.prevent="addQuestion")
        .form-field
          label Tipo de pregunta
          br
          select#obligatorio.w-100(v-model="newQuestion.tipoConsulta")
            option(value="1") Ranking
            option(value="2") $100
            option(value="6") Kano Model
        .form-field
          label Pregunta
          input#pregunta(type="text" v-model="newQuestion.pregunta")
        .form-field
          label Información
          input#informacion(type="text" v-model="newQuestion.informacion")
        .form-field
          label Opciones
          ListInput(
            type="text"
            placeholder="Nueva opción"
            :list="newQuestion.opciones" 
            @addElement="handleAddCronograma"
            @removeElement="handleRemoveCronograma"
          )
    template(#modal-footer)
      .d-flex.justify-content-end
        button.btn.btn-main-outline(@click="modal.createQuestion = false") Cancelar
        button.btn.btn-main.ms-3(@click="addQuestion") Crear

  Modal(:show="modal.createComment" @closeModal="modal.createComment = false")
    template(#modal-header)
      h4.m-0: b Nuevo comentario
    template(#modal-body)
      form.app-form(noValidate @submit.prevent="addComment")
        .form-field
          textarea#comment.w-100(rows="6" placeholder="Comentario" v-model="newComment.comentario")
    template(#modal-footer)
      .d-flex.justify-content-end
        button.btn.btn-main-outline(@click="modal.createComment = false") Cancelar
        button.btn.btn-main.ms-3(@click="addComment") Crear


</template>

<script src="./index.js"></script>

<style lang="scss" scoped src="./styles.scss"></style>
