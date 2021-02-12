import { useEffect, useState } from "react";
import { EmployeeEvent } from "../../types";
import eachMonthOfInterval from "date-fns/eachMonthOfInterval";
import { getMonthYear } from "../../utils/utils";
import { compareDesc } from "date-fns";
import { employeeEventSubject } from "../../rxjs/record.subject";
import { useSubject } from "../../hooks/useAsyncState";
import EmployeeEventForm from "./EmployeeEventForm";
import sidebarStore from "../../store/sidebar.store";

type EmployeeEventListProps = {
  employeeId: string
};


const EmployeeEventList = ({ employeeId }: EmployeeEventListProps) => {
  const [events] = useSubject(null, employeeEventSubject.all);

  useEffect(() => {
    employeeEventSubject.fetchAll(employeeId)
  }, [employeeId])
  const eventsPerMonthMap = new Map<string, EmployeeEvent[]>()
  if (events) {
    events.forEach(ev => {
      const monthYears = eachMonthOfInterval({ start: ev.startDate, end: ev.endDate }).map(d => getMonthYear(d));
      console.log('vvvv', monthYears, ev)
      monthYears.forEach(my => eventsPerMonthMap.has(my) ? eventsPerMonthMap.get(my)!.push(ev) : eventsPerMonthMap.set(my, [ev]));
      console.log({ eventsPerMonthMap })
    })
  }

  function onEventClick(record: EmployeeEvent) {
    sidebarStore.openSidebar(
      "Update record",
      EmployeeEventForm,
      {
        employee: employeeId,
        record
      }
    );
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
                <p key={ev.id + monthYear} onClick={() => onEventClick(ev)}>{`${ev.type} : ${ev.startDate} for ${ev.duration} days`}</p>
              ))}
            </section>
          ))
        )
    }

  </article>;
};

export default EmployeeEventList;
