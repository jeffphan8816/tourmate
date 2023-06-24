import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  DateTimePicker,
  DateTimePickerProps,
} from "@mui/x-date-pickers/DateTimePicker";

import { useFormik } from "formik";
import * as yup from "yup";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  TextField,
} from "@mui/material";

type Props<TDate> = {
  name: string;
} & Omit<DateTimePickerProps<TDate>, "onChange" | "value">;

const dataFormSchema = yup.object().shape({
  budget: yup.number().required("Budget is required"),
  numberOfCompanions: yup.number().required("Number of companions is required"),
  accommodation: yup.string().required("Accommodation preference is required"),
  transportation: yup
    .string()
    .required("Transportation preference is required"),
  sightseeing: yup.string().required("Sightseeing preference is required"),
  interests: yup.string().required("Interests are required"),
  startDate: yup.date().required("Start date is required"),
  endDate: yup
    .date()
    .required("End date is required")
    .min(
      yup.ref("startDate"),
      "End date must be after or the same as the start date"
    ),
});

const initialValuesDataForm = {
  budget: "",
  numberOfCompanions: "",
  accommodation: "",
  transportation: "",
  sightseeing: "",
  interests: "",
  startDate: dayjs(),
  endDate: dayjs(),
};

const DataForm = () => {
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [dataState, setDataState] = React.useState({
    budget: "",
    numberOfCompanions: "",
    accommodation: "",
    transportation: "",
    sightseeing: "",
    interests: "",
    startDate: dayjs(),
    endDate: dayjs(),
  });
  const formik = useFormik({
    initialValues: initialValuesDataForm,
    validationSchema: dataFormSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            onChange={(newValue) =>
              formik.setFieldValue("startDate", newValue, true)
            }
            value={formik.values.startDate}
            label='Start Date'
            views={["day", "month", "year", "hours", "minutes"]}
            format='hh:mm A DD/MM/YYYY'
            slotProps={{
              textField: {
                variant: "outlined",
                error:
                  formik.touched.startDate && Boolean(formik.errors.startDate),
                helperText:
                  formik.touched.startDate && formik.errors.startDate
                    ? JSON.stringify(formik.errors.startDate) // Convert to string
                    : "",
              },
            }}
          />
          <DateTimePicker
            onChange={(newValue) =>
              formik.setFieldValue("endDate", newValue, true)
            }
            value={formik.values.endDate}
            label='End Date'
            views={["day", "month", "year", "hours", "minutes"]}
            format='hh:mm A DD/MM/YYYY'
            slotProps={{
              textField: {
                variant: "outlined",
                error: formik.touched.endDate && Boolean(formik.errors.endDate),
                helperText:
                  formik.touched.endDate && formik.errors.endDate
                    ? JSON.stringify(formik.errors.endDate) // Convert to string
                    : "",
              },
            }}
          />
        </LocalizationProvider>
        <TextField
          id='budget'
          name='budget'
          label='Budget'
          type='number'
          value={formik.values.budget}
          onChange={formik.handleChange}
          error={formik.touched.budget && Boolean(formik.errors.budget)}
          helperText={formik.touched.budget && formik.errors.budget}
        />
        <TextField
          id='numberOfCompanions'
          name='numberOfCompanions'
          label='Number of Companions'
          type='number'
          value={formik.values.numberOfCompanions}
          onChange={formik.handleChange}
          error={
            formik.touched.numberOfCompanions &&
            Boolean(formik.errors.numberOfCompanions)
          }
          helperText={
            formik.touched.numberOfCompanions &&
            formik.errors.numberOfCompanions
          }
        />
        <FormGroup>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label='Label'
          />
          <FormControlLabel control={<Checkbox />} label='Required' />
          <FormControlLabel control={<Checkbox />} label='Disabled' />
        </FormGroup>

        <Button color='primary' variant='contained' fullWidth type='submit'>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default DataForm;
