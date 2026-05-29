<script setup lang="ts">
import type { NivelAcademico } from '@/models/nivelAcademico'
import type { Programa } from '@/models/programa'
import http from '@/plugins/axios'
import { Button, Dialog, InputText, Textarea, Dropdown, InputNumber, Calendar } from 'primevue'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'programas'
const props = defineProps({
  mostrar: Boolean,
  programa: {
    type: Object as () => Programa,
    default: () => ({}) as Programa,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const niveles = ref<NivelAcademico[]>([])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

const programa = ref<Programa>({ ...props.programa })
const idNivelAcademico = ref<number>(0)

const opcionesEstado = ref([
  { label: 'En Planificación', value: 'En Planificación' },
  { label: 'En curso', value: 'En curso' },
  { label: 'Finalizado', value: 'Finalizado' },
])

const opcionesAreaConocimiento = ref([
  { label: 'Derecho', value: 'Derecho' },
  { label: 'Educación', value: 'Educación' },
  { label: 'Ingeniería', value: 'Ingeniería' },
  { label: 'Salud', value: 'Salud' },
])

async function obtenerNiveles() {
  niveles.value = await http.get('niveles-academicos').then((response) => response.data)
}

async function handleSave() {
  try {
    const body = {
      idNivelAcademico: idNivelAcademico.value,
      nombre: programa.value.nombre,
      descripcion: programa.value.descripcion,
      version: programa.value.version,
      duracionMeses: programa.value.duracionMeses,
      costo: programa.value.costo,
      fechaInicio: programa.value.fechaInicio,
      estado: programa.value.estado,
      areaConocimiento: programa.value.areaConocimiento,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${programa.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    programa.value = {} as Programa
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}

watch(
  () => props.mostrar,
  (nuevoValor) => {
    if (nuevoValor) {
      obtenerNiveles()

      if (props.programa?.id) {
        programa.value = { ...props.programa }
        idNivelAcademico.value =
          props.programa.idNivelAcademico ?? props.programa.nivelAcademico?.id ?? 0
      } else {
        idNivelAcademico.value = 0
        programa.value = { nivelAcademico: { id: 0 } } as Programa
      }
    }
  },
)
watch(
  () => props.programa,
  (newVal) => {
    programa.value = { ...newVal }
    idNivelAcademico.value = newVal?.idNivelAcademico ?? newVal?.nivelAcademico?.id ?? 0
  },
)
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar Programa' : 'Crear Programa'"
      style="width: 25rem"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="nivel" class="font-semibold w-3">Nivel Académico</label>
        <Dropdown
          id="nivel"
          v-model="idNivelAcademico"
          :options="niveles"
          optionLabel="nombre"
          optionValue="id"
          class="flex-auto"
          autofocus
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="nombre" class="font-semibold w-3">Nombre</label>
        <InputText
          id="nombre"
          v-model="programa.nombre"
          class="flex-auto"
          autocomplete="off"
          maxlength="100"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="descripcion" class="font-semibold w-3">Descripción</label>
        <Textarea
          id="descripcion"
          v-model="programa.descripcion"
          class="flex-auto"
          autocomplete="off"
          rows="3"
          maxlength="2000"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="version" class="font-semibold w-3">Versión</label>
        <InputNumber id="version" v-model="programa.version" class="flex-auto" :min="1" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="duracionMeses" class="font-semibold w-3">Duración (Meses)</label>
        <InputNumber
          id="duracionMeses"
          v-model="programa.duracionMeses"
          class="flex-auto"
          :min="1"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="costo" class="font-semibold w-3">Costo</label>
        <InputNumber
          id="costo"
          v-model="programa.costo"
          class="flex-auto"
          :min="0"
          mode="decimal"
          :minFractionDigits="2"
          :maxFractionDigits="2"
          locale="en-US"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="fechaInicio" class="font-semibold w-3">Fecha Inicio</label>
        <Calendar
          id="fechaInicio"
          v-model="programa.fechaInicio"
          class="flex-auto"
          dateFormat="yy-mm-dd"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="estado" class="font-semibold w-3">Estado</label>
        <Dropdown
          id="estado"
          v-model="programa.estado"
          :options="opcionesEstado"
          optionLabel="label"
          optionValue="value"
          class="flex-auto"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="areaConocimiento" class="font-semibold w-3">Área de Conocimiento</label>
        <Dropdown
          id="areaConocimiento"
          v-model="programa.areaConocimiento"
          :options="opcionesAreaConocimiento"
          optionLabel="label"
          optionValue="value"
          class="flex-auto"
        />
      </div>

      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          @click="dialogVisible = false"
        ></Button>
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave"></Button>
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
