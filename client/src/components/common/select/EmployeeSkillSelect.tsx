import { useEffect, useState } from "react";
import { useAsyncState } from "../../../hooks/useAsyncState";
import { Shift } from "../../../model";
import { ShiftSkillInput } from "../../../types";

import { getEnumKey } from "../../../utils/enum";
import { shiftSubject } from "../../../rxjs/record.subject";
import ShiftSelect from "./ShiftSelect";

export enum ShiftSkillLevel {
  NoSkill = "NO_SKILL",
  Learning = "LEARNING",
  Master = "MASTER",
}
type EmployeeSkillSelectProps = {
  id: string;
  multiple: boolean;
  onChange: (value: ShiftSkillInput[]) => void;
  value?: ShiftSkillInput[];
};

export default function EmployeeSkillSelect({
  id,
  multiple,
  value,
  onChange,
}: EmployeeSkillSelectProps) {
  const [shifts] = useAsyncState<Shift[] | null>(
    null,
    shiftSubject.lazyFetchAll
  );

  const [inputLevel, setInputLevel] = useState<ShiftSkillLevel>(
    ShiftSkillLevel.Master
  );
  const [inputShift, setInputShift] = useState<Shift | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<ShiftSkillInput[]>(
    value || []
  );

  const addSkill = () => {
    if (inputLevel && inputShift) {
      setSelectedSkills([
        ...selectedSkills,
        { level: inputLevel, shift: inputShift.id },
      ]);
    }
  };

  useEffect(() => {
    if (selectedSkills) {
      onChange(selectedSkills);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSkills]);
  return (
    <fieldset disabled={shifts === null}>
      <legend>Add skills</legend>
      <div className="input-level">
        {Object.values(ShiftSkillLevel).map((l, i) => (
          <div key={l}>
            <input
              type="radio"
              name="skillLevel"
              id={l}
              value={l}
              checked={inputLevel === l}
              onChange={() => setInputLevel(l)}
            />
            <label htmlFor={l}>{getEnumKey(ShiftSkillLevel, l)}</label>
          </div>
        ))}
      </div>
      <ShiftSelect
        id="employee-shift-select"
        onChange={([shift]) => {
          console.log(shift);
          setInputShift(shift);
        }}
      />
      <button
        onClick={addSkill}
        disabled={
          !inputLevel ||
          !inputShift ||
          selectedSkills.some((s) => s.shift === inputShift.id)
        }
      >
        +
      </button>
      <ul>
        {selectedSkills.map((s, i) => (
          <li key={i}>
            <button
              onClick={() =>
                setSelectedSkills(
                  selectedSkills.filter(
                    (selected) => selected.shift !== s.shift
                  )
                )
              }
            >
              -
            </button>
            {shifts?.find((shift) => shift.id === s.shift)?.title || ""} -{" "}
            {s.level}
          </li>
        ))}
      </ul>
    </fieldset>
    // <label htmlFor={id}></label>
    // <select
    //   name=""
    //   id={id}
    //   disabled={days === null}
    //   multiple={multiple}
    //   onChange={({ target }) =>
    //     onChange(getSelectedOptions(target.selectedOptions))
    //   }
    // >
    //   {days !== null &&
    //     days.map(({ id, name, active }, i) => (
    //       <option key={id} value={i}>
    //         {name}
    //       </option>
    //     ))}
    // </select>
  );
}
