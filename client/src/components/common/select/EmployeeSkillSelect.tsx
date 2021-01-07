import { useState } from "react";
import { getShifts } from "../../../api/shift.api";
import { useAsyncState } from "../../../hooks/useAsyncState";
import { Shift } from "../../../model";
import { ShiftSkillInput } from "../../../types";

import { getEnumKey } from "../../../utils/enum";
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
};

export default function EmployeeSkillSelect({
  id,
  multiple,
  onChange,
}: EmployeeSkillSelectProps) {
  const [shifts] = useAsyncState<Shift[] | null>(null, getShifts);

  const [inputLevel, setInputLevel] = useState<ShiftSkillLevel>(
    ShiftSkillLevel.Master
  );
  const [inputShift, setInputShift] = useState<Shift | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<ShiftSkillInput[]>([]);

  const addSkill = () => {
    if (inputLevel && inputShift) {
      setSelectedSkills([
        ...selectedSkills,
        { level: inputLevel, shift: inputShift.id },
      ]);
    }
  };
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
            {s.shift} - {s.level}
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
