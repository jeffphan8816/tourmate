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
import SearchBar from "../SearchBar";
import { PlaceType } from "../SearchBar";

const dataFormSchema = yup.object().shape({
  location: yup.object().shape({
    description: yup.string().required("Location is required"),
    matched_substrings: yup.array().of(
      yup.object().shape({
        offset: yup.number(),
        length: yup.number(),
      })
    ),
    place_id: yup.string().required("Location is required"),
    reference: yup.string().required("Location is required"),
    structured_formatting: yup.object().shape({
      main_text: yup.string().required("Location is required"),
      secondary_text: yup.string().required("Location is required"),
      main_text_matched_substrings: yup.array().of(
        yup.object().shape({
          offset: yup.number(),
          length: yup.number(),
        })
      ),
    }),
    types: yup.array().of(yup.string()),
    terms: yup.array().of(
      yup.object().shape({
        offset: yup.number(),
        value: yup.string(),
      })
    ),
  }),
  budget: yup.number().required("Budget is required"),
  numberOfCompanions: yup.number().required("Number of companions is required"),
  accommodations: yup
    .array()
    .of(yup.string())
    .min(1, "At least one accommodation must be selected")
    .required("Accommodation preference is required"),
  transportations: yup
    .array()
    .of(yup.string())
    .min(1, "At least one transportation must be selected")
    .required("Transportation preference is required"),
  // sightseeing: yup.string().required("Sightseeing preference is required"),
  // interests: yup.string().required("Interests are required"),
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
  location: [] as PlaceType[],
  budget: "",
  numberOfCompanions: "",
  accommodations: [] as string[],
  transportations: [] as string[],
  // sightseeing: "",
  // interests: "",
  startDate: dayjs(),
  endDate: dayjs(),
};

const accomodationOptions = [
  "Hotel",
  "Airbnb",
  "Camping",
  "Motel",
  "Homestay",
  "Others",
];
const transportationOptions = ["Car", "Bus", "Plane", "Motorbike", "Others"];

const DataForm = () => {
  const formik = useFormik({
    initialValues: initialValuesDataForm,
    validationSchema: dataFormSchema,
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      //TODO: Send data to backend
      console.log(JSON.stringify(values, null, 2));
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <SearchBar onSearchChange={formik.setFieldValue} />
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
          {accomodationOptions.map((accommodation) => (
            <FormControlLabel
              id='accommodations'
              key={`accommodations_${accommodation}}`}
              control={
                <Checkbox
                  name='accommodations'
                  checked={formik.values.accommodations.includes(accommodation)}
                  onChange={() => {
                    formik.setFieldValue(
                      "accommodations",
                      formik.values.accommodations.includes(accommodation)
                        ? formik.values.accommodations.filter(
                            (data) => data !== accommodation
                          )
                        : [...formik.values.accommodations, accommodation],
                      true
                    );
                  }}
                />
              }
              label={accommodation}
            />
          ))}
        </FormGroup>
        <FormGroup>
          {transportationOptions.map((transportation) => (
            <FormControlLabel
              key={`transportations_${transportation}}`}
              id='transportations'
              control={
                <Checkbox
                  name='transportations'
                  checked={formik.values.transportations.includes(
                    transportation
                  )}
                  onChange={() => {
                    formik.setFieldValue(
                      "transportations",
                      formik.values.transportations.includes(transportation)
                        ? formik.values.transportations.filter(
                            (data) => data !== transportation
                          )
                        : [...formik.values.transportations, transportation],
                      true
                    );
                  }}
                />
              }
              label={transportation}
            />
          ))}
        </FormGroup>

        <Button color='primary' variant='contained' fullWidth type='submit'>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default DataForm;
