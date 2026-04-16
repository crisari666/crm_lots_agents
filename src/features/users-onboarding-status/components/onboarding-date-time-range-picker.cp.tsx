import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined"
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined"
import { Box, FormHelperText, Stack, Typography } from "@mui/material"
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker"
import type { Value } from "@wojtekmaj/react-datetimerange-picker/dist/shared/types.js"
import "@wojtekmaj/react-datetimerange-picker/dist/DateTimeRangePicker.css"
import "react-calendar/dist/Calendar.css"
import "react-clock/dist/Clock.css"
import { useEffect, useState } from "react"

type OnboardingDateTimeRangePickerCPProps = {
  id: string
  value: [Date | null, Date | null]
  disabled?: boolean
  helperText?: string
  onChange: (value: [Date | null, Date | null]) => void
}

const formatDateTimeLabel = (value: Date | null) => {
  if (value == null || Number.isNaN(value.getTime())) return "--"
  return value.toLocaleString()
}

const normalizeValue = (value: Value): [Date | null, Date | null] => {
  if (!Array.isArray(value)) return [null, null]
  const [from, to] = value
  return [from instanceof Date ? from : null, to instanceof Date ? to : null]
}

const isValidDate = (value: Date | null) => value instanceof Date && !Number.isNaN(value.getTime())

const areSameDate = (left: Date | null, right: Date | null) => {
  if (left == null && right == null) return true
  if (left == null || right == null) return false
  return left.getTime() === right.getTime()
}

const areSameRange = (
  left: [Date | null, Date | null],
  right: [Date | null, Date | null]
) => areSameDate(left[0], right[0]) && areSameDate(left[1], right[1])

const resolveNextValue = (
  currentValue: [Date | null, Date | null],
  nextValue: Value
): [Date | null, Date | null] => {
  if (!Array.isArray(nextValue)) return currentValue

  const normalizedValue = normalizeValue(nextValue)
  const [from, to] = normalizedValue

  if (nextValue[0] == null && nextValue[1] == null) return [null, null]
  if (isValidDate(from) && isValidDate(to)) return [from, to]

  return currentValue
}

export default function OnboardingDateTimeRangePickerCP({
  id,
  value,
  disabled = false,
  helperText,
  onChange
}: OnboardingDateTimeRangePickerCPProps) {
  const [localValue, setLocalValue] = useState<[Date | null, Date | null]>(value)

  useEffect(() => {
    if (!areSameRange(localValue, value)) {
      setLocalValue(value)
    }
  }, [localValue, value])

  return (
    <Stack spacing={0.75} sx={{ width: "100%" }}>
      <Box
        sx={{
          width: "100%",
          "& .react-datetimerange-picker": {
            width: "100%"
          },
          "& .react-datetimerange-picker__wrapper": {
            borderRadius: 1,
            borderColor: "rgba(0, 0, 0, 0.23)",
            minHeight: 40,
            paddingX: 1,
            backgroundColor: disabled ? "action.disabledBackground" : "background.paper"
          },
          "& .react-datetimerange-picker__inputGroup": {
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 0.25,
            font: "inherit"
          },
          "& .react-datetimerange-picker__inputGroup__input": {
            font: "inherit",
            color: "text.primary"
          },
          "& .react-datetimerange-picker__button": {
            color: "text.secondary"
          },
          "& .react-calendar, & .react-clock": {
            borderColor: "divider"
          }
        }}
      >
        <DateTimeRangePicker
          id={id}
          value={localValue}
          disabled={disabled}
          onChange={(nextValue) => {
            const resolvedValue = resolveNextValue(localValue, nextValue)
            setLocalValue(resolvedValue)

            if (!Array.isArray(nextValue)) return
            if (nextValue[0] == null && nextValue[1] == null) {
              onChange([null, null])
              return
            }
            if (isValidDate(resolvedValue[0]) && isValidDate(resolvedValue[1])) {
              onChange(resolvedValue)
            }
          }}
          format="y-MM-dd HH:mm"
          maxDetail="minute"
          calendarIcon={<CalendarMonthOutlinedIcon fontSize="small" />}
          clearIcon={<ClearOutlinedIcon fontSize="small" />}
          rangeDivider="to"
        />
      </Box>
      <Typography variant="caption" color="text.secondary">
        {`${formatDateTimeLabel(localValue[0])} -> ${formatDateTimeLabel(localValue[1])}`}
      </Typography>
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </Stack>
  )
}
