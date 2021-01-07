import React, { FormEvent, useEffect, useState } from "react";
import { createShift, getShifts, deleteShift } from "../api/shift.api";
import { DraftShift, Shift } from "../model";
import useValidation, { ErrorDictionary } from "./hooks/useValidation";

function ShiftSection() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [shift, setShift] = useState<DraftShift>({
    title: "",
    duration: 0,
  });

  useEffect(() => {
    fetchShifts();
  }, []);

  function validateForm(): ErrorDictionary {
    const errors: ErrorDictionary = {};
    if (shifts.some((s) => s.title === shift.title)) {
      errors["shift"] = "A shift with same name already exists";
    }

    return errors;
  }
  const [validation, validate] = useValidation(validateForm);

  async function fetchShifts() {
    const data = await getShifts();
    setShifts(data);
  }

  async function onSubmitShift(e: FormEvent) {
    e.preventDefault();
    validate();
    if (validation.isValid) {
      const newShift = await createShift(shift);
      if (newShift) {
        setShifts([...shifts, newShift]);
      }
    }
  }

  async function onDeleteShift(id: string) {
    const isDeleted = await deleteShift(id);
    if (!isDeleted) {
      alert("Could not delete");
    } else {
      setShifts(shifts.filter((s) => s.id !== id));
    }
  }

  return (
    <section>
      <h1>Shifts</h1>
      <form onSubmit={onSubmitShift}>
        <div>
          {Object.entries(validation.errors).map(([field, error], i) => (
            <h4 key={field + i}>
              {field}:{error}
            </h4>
          ))}
        </div>
        <label htmlFor="title-input">Title:</label>
        <input
          type="text"
          name="title-input"
          id="title-input"
          onChange={({ target }) => setShift({ ...shift, title: target.value })}
        />

        <label htmlFor="duration-input">Duration:</label>
        <input
          type="number"
          name="duration-input"
          id="duration-input"
          onChange={({ target }) =>
            setShift({ ...shift, duration: +target.value })
          }
        />

        <button type="submit">Submit</button>
      </form>

      <ul>
        {shifts.map((shift) => (
          <li id={shift.id} key={shift.id}>
            <button onClick={() => onDeleteShift(shift.id)}>Delete</button>
            {shift.id}
            <br />
            {shift.title} - {shift.duration}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ShiftSection;
