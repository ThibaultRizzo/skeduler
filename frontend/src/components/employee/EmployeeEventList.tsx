import { useEffect, useState } from "react";
import { getEmployeeEvents } from "../../api/employee.api";
import { useAsyncState } from "../../hooks/useAsyncState";
import { EmployeeEvent } from "../../types";
import eachMonthOfInterval from "date-fns/eachMonthOfInterval";
import { getMonthYear } from "../../utils/utils";
import { compareDesc } from "date-fns";

type EmployeeEventListProps = {
  employeeId: string
};


const EmployeeEventList = ({ employeeId }: EmployeeEventListProps) => {
  const [events] = useAsyncState<EmployeeEvent[] | null, string>(null, getEmployeeEvents, [employeeId]);
  const eventsPerMonthMap = new Map<string, EmployeeEvent[]>()
  if (events) {
    events.forEach(ev => {
      const monthYears = eachMonthOfInterval({ start: ev.startDate, end: ev.endDate }).map(d => getMonthYear(d));
      console.log('vvvv', monthYears, ev)
      monthYears.forEach(my => eventsPerMonthMap.has(my) ? eventsPerMonthMap.get(my)!.push(ev) : eventsPerMonthMap.set(my, [ev]));
      console.log({ eventsPerMonthMap })
    })
  }
  return <article>
    <h3>Event List</h3>

    {
      events === null ? (
        <h4>No events registered</h4>
      ) : (
          [...eventsPerMonthMap.keys()].sort().reverse().map(monthYear => (
            <section key={monthYear}>
              <h4>{monthYear}</h4>
              {eventsPerMonthMap.get(monthYear)!.sort((a, b) => compareDesc(a.startDate, b.startDate)).map(ev => (
                <p key={ev.id + monthYear}>{`${ev.type} : ${ev.startDate} for ${ev.duration} days`}</p>
              ))}
            </section>
          ))
        )
    }

  </article>;
};

export default EmployeeEventList;
