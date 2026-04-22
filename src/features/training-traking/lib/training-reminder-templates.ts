export const TRAINING_REMINDER_TEMPLATE_NAMES = [
  "capacitacion_12_hora",
  "capacitacion_3_hora",
  "capacitacion_45_minutos",
  "capacitacion_5_minutos"
] as const

export type TrainingReminderTemplateName = (typeof TRAINING_REMINDER_TEMPLATE_NAMES)[number]

export const TRAINING_REMINDER_TEMPLATE_OPTIONS: ReadonlyArray<{
  templateName: TrainingReminderTemplateName
  label: string
}> = [
  { templateName: "capacitacion_12_hora", label: "12 horas antes" },
  { templateName: "capacitacion_3_hora", label: "3 horas antes" },
  { templateName: "capacitacion_45_minutos", label: "45 minutos antes" },
  { templateName: "capacitacion_5_minutos", label: "5 minutos antes" }
]
