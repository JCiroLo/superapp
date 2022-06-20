<template lang="pug">
.app-content(:class="{show}")
  aside.sidebar-content
    .sidebar-toggler
      button.btn(@click="show = !show")
        i.fal.fa-bars.fa-fw
    router-link.sidebar-item(v-for="(item, index) in items" :key="index" :to="{name: item.route}")
      .sidebar-item-icon: i.fas.fa-fw(:class="item.icon")
      .sidebar-item-title {{item.title}}
  .page-content
    slot
      
</template>

<script src="./index.js"></script>
<style lang="scss" scoped src="./styles.scss"></style>
