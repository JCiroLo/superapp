<template lang="pug"> 
.container
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
          | Ranking (tipo 1)
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
          | $100 (tipo2)
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
          | Kano Model (tipo 6)
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
        .comment-user {{comment[0]}}
        .comment-date Hace una semana
      .comment {{comment[1]}}
      .comment-actions
        button.btn.btn-icon: i.fas.fa-trash.fa-fw

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
      h4.m-0: b Nueva comentario
    template(#modal-body)
      form.app-form(noValidate @submit.prevent="addComment")
        .form-field
          input#username.w-100(type="text" placeholder="Nombre (opcional)" v-model="newComment.username")
        .form-field
          textarea#comment.w-100(rows="6" placeholder="Comentario" v-model="newComment.comment")
    template(#modal-footer)
      .d-flex.justify-content-end
        button.btn.btn-main-outline(@click="modal.createComment = false") Cancelar
        button.btn.btn-main.ms-3(@click="addComment") Crear


</template>

<script src="./index.js"></script>

<style lang="scss" scoped src="./styles.scss"></style>
