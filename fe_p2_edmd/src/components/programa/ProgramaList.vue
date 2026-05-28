<script setup lang="ts">
import type { Programa } from '@/models/programa'
import http from '@/plugins/axios'
import { Button, Column, DataTable, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'programas'
const programas = ref<Programa[]>([])
const programaDelete = ref<Programa | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')
const emit = defineEmits(['edit'])

const programasFiltrados = computed(() => {
  return programas.value.filter(
    (programa) =>
      programa.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      programa.descripcion.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      programa.nivelAcademico?.nombre.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})

async function obtenerLista() {
  programas.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(programa: Programa) {
  emit('edit', programa)
}

function mostrarEliminarConfirm(programa: Programa) {
  programaDelete.value = programa
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${programaDelete.value?.id}`)
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
        <InputText
          v-model="busqueda"
          type="text"
          placeholder="Buscar por nombre, descripción o nivel"
        />
      </InputGroup>
    </div>

    <DataTable
      :value="programasFiltrados"
      paginator
      scrollable
      scrollHeight="flex"
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      tableStyle="min-width: 50rem"
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="{first} a {last} de {totalRecords}"
    >
      <template #paginatorstart>
        <Button type="button" icon="pi pi-refresh" text @click="obtenerLista" />
      </template>
      <Column field="nombre" header="Nombre" sortable style="min-width: 120px"></Column>
      <Column header="Nivel Académico" sortable style="min-width: 120px">
        <template #body="{ data }">
          {{ data.nivelAcademico.nombre }}
        </template>
      </Column>
      <Column field="descripcion" header="Descripción" sortable style="min-width: 200px"></Column>
      <Column field="version" header="Versión" sortable style="min-width: 80px"></Column>
      <Column
        field="duracionMeses"
        header="Duración (Meses)"
        sortable
        style="min-width: 120px"
      ></Column>
      <Column field="costo" header="Costo" sortable style="min-width: 100px"></Column>
      <Column header="Fecha Inicio" sortable style="min-width: 120px">
        <template #body="{ data }">
          {{ new Date(data.fechaInicio).toLocaleDateString() }}
        </template>
      </Column>
      <Column field="estado" header="Estado" sortable style="min-width: 120px"></Column>
      <Column header="Acciones" frozen alignFrozen="right" style="min-width: 120px">
        <template #body="{ data }">
          <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(data)" />
          <Button
            icon="pi pi-trash"
            aria-label="Eliminar"
            text
            @click="mostrarEliminarConfirm(data)"
          />
        </template>
      </Column>
    </DataTable>

    <table v-if="false">
      <thead>
        <tr>
          <th>Nro.</th>
          <th>Nombre</th>
          <th>Nivel Académico</th>
          <th>Descripción</th>
          <th>Versión</th>
          <th>Duración (Meses)</th>
          <th>Costo</th>
          <th>Fecha Inicio</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(programa, index) in programasFiltrados" :key="programa.id">
          <td>{{ index + 1 }}</td>
          <td>{{ programa.nombre }}</td>
          <td>{{ programa.nivelAcademico.nombre }}</td>
          <td>{{ programa.descripcion }}</td>
          <td>{{ programa.version }}</td>
          <td>{{ programa.duracionMeses }}</td>
          <td>{{ programa.costo }}</td>
          <td>{{ new Date(programa.fechaInicio).toLocaleDateString() }}</td>
          <td>{{ programa.estado }}</td>
          <td>
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(programa)" />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              text
              @click="mostrarEliminarConfirm(programa)"
            />
          </td>
        </tr>
        <tr v-if="programasFiltrados.length === 0">
          <td colspan="10">No se encontraron resultados.</td>
        </tr>
      </tbody>
    </table>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de que deseas eliminar el programa {{ programaDelete?.nombre }}?</p>
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
