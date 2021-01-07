import { useEffect, useState } from "react";
import { getDays, setDayActivation } from "../api/day.api";
import { Day } from "../types";

export default function WorkingDaysSection() {
  const [days, setDays] = useState<Day[]>([]);
  const [isToggling, setIsToggling] = useState<boolean>(false);
  useEffect(() => {
    fetchDays();
  }, []);

  async function fetchDays() {
    const data = await getDays();
    setDays(data.sort());
  }

  async function toggleDayActivation(day: Day) {
    setIsToggling(true);
    const res = await setDayActivation(day);
    if (res) {
      setDays(days.map((d) => (d.id === res.id ? res : d)));
    }
    setIsToggling(false);
  }

  return (
    <section>
      <h1>Working days</h1>

      {days.map((day) => (
        <div key={day.id}>
          <input
            type="checkbox"
            id={`day-${day.id}`}
            name={day.name}
            checked={day.active}
            onChange={() => toggleDayActivation(day)}
            disabled={isToggling}
          />
          <label htmlFor={`day-${day.id}`}>{day.name}</label>
        </div>
      ))}
      <div />
    </section>
  );
}
