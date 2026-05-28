<script setup lang="ts">
import type { NivelAcademico } from '@/models/nivelAcademico'
import http from '@/plugins/axios'
import { Button, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'niveles-academicos'
const nivelesAcademicos = ref<NivelAcademico[]>([])
const nivelAcademicoDelete = ref<NivelAcademico | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')
const emit = defineEmits(['edit'])

const nivelesAcademicosFiltrados = computed(() => {
  return nivelesAcademicos.value.filter(
    (nivel) =>
      nivel.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      (nivel.descripcion && nivel.descripcion.toLowerCase().includes(busqueda.value.toLowerCase())),
  )
})

async function obtenerLista() {
  nivelesAcademicos.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(nivel: NivelAcademico) {
  emit('edit', nivel)
}

function mostrarEliminarConfirm(nivel: NivelAcademico) {
  nivelAcademicoDelete.value = nivel
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${nivelAcademicoDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

onMounted(() => {
  obtenerLista()
})
defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <div class="col-7 pl-0 mt-3">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre o descripción" />
      </InputGroup>
    </div>

    <table>
      <thead>
        <tr>
          <th>Nro.</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(nivel, index) in nivelesAcademicosFiltrados" :key="nivel.id">
          <td>{{ index + 1 }}</td>
          <td>{{ nivel.nombre }}</td>
          <td>{{ nivel.descripcion || 'Sin descripción' }}</td>
          <td>
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(nivel)" />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              text
              @click="mostrarEliminarConfirm(nivel)"
            />
          </td>
        </tr>
        <tr v-if="nivelesAcademicosFiltrados.length === 0">
          <td colspan="5">No se encontraron resultados.</td>
        </tr>
      </tbody>
    </table>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>
        ¿Estás seguro de que deseas eliminar el nivel académico {{ nivelAcademicoDelete?.nombre }}?
      </p>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          @click="mostrarConfirmDialog = false"
        />
        <Button type="button" label="Eliminar" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
