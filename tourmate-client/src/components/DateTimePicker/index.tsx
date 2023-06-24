import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

interface DateTimePickerFormProps {
  label: string;
  value: Dayjs | null;
  setValue: React.Dispatch<React.SetStateAction<Dayjs| null>> ;
}

export default function DateTimePickerForm(props: DateTimePickerFormProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label={props.label}
        views={["day", "month", "year", "hours", "minutes"]}
        format='hh:mm A DD/MM/YYYY '
        value={props.value}
        onChange={(newValue) => props.setValue(newValue)}
      />
    </LocalizationProvider>
  );
}
