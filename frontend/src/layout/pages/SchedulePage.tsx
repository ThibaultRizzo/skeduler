import { useEffect, useState } from "react";
import { generateSchedule, getSchedule } from "../../api/schedule.api";
import { useAsyncState } from "../../hooks/useAsyncState";
import {
  daySubject,
  employeeSubject,
  shiftSubject,
} from "../../rxjs/record.subject";
import { CompleteSchedule, Day, Employee, Shift } from "../../types";
import Loader from "../Loader";
import "../../styles/layout/pages/schedule.scss";
import { executeFnOrOpenSnackbar } from "../../rxjs/crud.subject";

function SchedulePage() {
  const [schedule, setSchedule] = useAsyncState<CompleteSchedule | null>(
    null,
    getSchedule
  );
  const [isLoading, setLoading] = useState(false);
  const [dayDict, setDayDict] = useState<{ [key: string]: Day }>({});
  const [shiftDict, setShiftDict] = useState<{ [key: string]: Shift }>({});
  const [employeeDict, setEmployeeDict] = useState<{ [key: string]: Employee }>(
    {}
  );

  useEffect(() => {
    const daySub = daySubject.subscribe((days) =>
      setDayDict(
        days?.reduce((acc, val) => ({ ...acc, [val.id]: val }), {}) || {}
      )
    );
    const shiftSub = shiftSubject.subscribe((shifts) =>
      setShiftDict(
        shifts?.reduce((acc, val) => ({ ...acc, [val.id]: val }), {}) || {}
      )
    );
    const employeeSub = employeeSubject.subscribe((employees) =>
      setEmployeeDict(
        employees?.reduce((acc, val) => ({ ...acc, [val.id]: val }), {}) || {}
      )
    );
    return function cleanup() {
      daySub.unsubscribe();
      shiftSub.unsubscribe();
      employeeSub.unsubscribe();
    };
  }, []);

  const isScheduleDisplayable =
    Object.keys(dayDict).length > 0 &&
    Object.keys(shiftDict).length > 0 &&
    Object.keys(employeeDict).length > 0;
  async function onScheduleGeneration() {
    setLoading(true);
    const sch = await generateSchedule();
    executeFnOrOpenSnackbar((v) => setSchedule(v), sch);
    setLoading(false);
  }
  return (
    <article>
      <button onClick={onScheduleGeneration} disabled={isLoading}>
        Generate
      </button>
      <Loader
        isLoading={isLoading || !isScheduleDisplayable}
        isEmpty={!schedule}
      >
        <div className="schedule-grid">
          {schedule &&
            schedule!.schedule.map((row) => (
              <div key={row.day} className="schedule-day">
                <div className="schedule-day-header">
                  {dayDict[row.day]?.name.name || ""}
                </div>
                {row.shifts.map((shift) => (
                  <div
                    key={row.day + shift.employee + shift.shift}
                    className="schedule-day-shift"
                  >
                    <span className="shift-employee">
                      {employeeDict[shift.employee]?.name || ""}
                    </span>
                    <hr />
                    <span className="shift-title">
                      {shiftDict[shift.shift]?.title || ""}
                    </span>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </Loader>
    </article>
  );
}
export default SchedulePage;
