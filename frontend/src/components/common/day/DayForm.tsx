import { useState } from "react";
import { setDayActivation } from "../../../api/day.api";
import { useSubject } from "../../../hooks/useAsyncState";
import { daySubject } from "../../../rxjs/record.subject";
import { Day } from "../../../types";

type DayFormProps = {
  record: Day | null;
};

function DayForm({ record }: DayFormProps) {
  if (!record) {
    throw new Error("DayForm cannot be used to create a new day");
  }
  const [days] = useSubject(null, daySubject);

  const [isToggling, setIsToggling] = useState<boolean>(false);

  async function toggleDayActivation(day: Day) {
    setIsToggling(true);
    const res = await setDayActivation(day);
    if (res) {
      daySubject.toggleDayActivation(res);
    }
    setIsToggling(false);
  }

  return (
    <section>
      <h1>Working days</h1>

      {days ? (
        days.map((day) => (
          <div key={day.id}>
            <input
              type="checkbox"
              id={`day-${day.id}`}
              name={day.name.name}
              checked={day.active}
              onChange={() => toggleDayActivation(day)}
              disabled={isToggling}
            />
            <label htmlFor={`day-${day.id}`}>{day.name}</label>
          </div>
        ))
      ) : (
        <p>Fetching days...</p>
      )}
      <div />
    </section>
  );
}

export default DayForm;
