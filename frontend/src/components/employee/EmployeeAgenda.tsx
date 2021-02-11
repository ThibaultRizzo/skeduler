import { useEffect, useState } from "react";
import { Employee, EmployeeEvent } from "../../types";
import eachDayOfInterval from "date-fns/eachDayOfInterval";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import getISODay from "date-fns/getISODay";
import { iter } from "../../utils/layout";
import sidebarStore from "../../store/sidebar.store";
import EmployeeEventForm from "./EmployeeEventForm";
import { employeeEventSubject } from "../../rxjs/record.subject";
import { useSubject } from "../../hooks/useAsyncState";

type EmployeeAgendaProps = {
  employee: string;
};

type AgendaSquareProps = {
  date: Date | null;
  events: EmployeeEvent[];
  onEventClick: (record: EmployeeEvent) => void
}

/**
 *
 * @param isoFirstDate
 * @param isoStartCalendarDay iso day, 0 being Sunday. Max 6 (Monday)
 * @returns number of days between given date and iso day
 */
function getDiffDays(isoFirstDate: Date, isoStartCalendarDay: number): number {
  const isoFirstDay = getISODay(isoFirstDate);
  return (isoFirstDay - isoStartCalendarDay + 7) % 7;
}

const AgendaSquare = ({ date, events, onEventClick }: AgendaSquareProps) => {
  return (
    <div className="agenda__square">
      <h4 className="agenda__square-number">
        {date !== null ? date.getDate() : ""}
      </h4>
      <div>
        {
          events && events.map(ev => <span onClick={() => onEventClick(ev)}>
            {ev.nature}
          </span>)
        }
      </div>
    </div>
  );
};
const EmployeeAgenda = ({ employee }: EmployeeAgendaProps) => {
  const now = new Date();
  const [interval, setInterval] = useState<Interval>({
    start: startOfMonth(now),
    end: endOfMonth(now),
  });
  useEffect(() => {
    employeeEventSubject.fetchInterval(employee, interval)
  }, [employee])

  const dates = eachDayOfInterval(interval);
  const prependedDays = getDiffDays(interval.start as Date, 1);

  const eventMap: Map<Date, EmployeeEvent[]> = new Map(dates.map(d => [d, []]));
  const [events] = useSubject(null, employeeEventSubject);
  events?.forEach(ev => {
    const dates = eachDayOfInterval({ start: new Date(ev.startDate), end: new Date(ev.endDate) });
    dates.forEach(d => eventMap.get(d)?.push(ev));
  })

  // events.forEach(event => eventDict.(event.startDate) ? eventDict.set(eventDict.get(date)) : [date])
  // reduce((acc,val) =>  ? ({...acc, [val.toISOString()]: val}), new Map())

  function openCreationForm() {
    sidebarStore.openSidebar(
      "Create record",
      EmployeeEventForm, {
      employee
    }
    );
  }

  function onEventClick(record: EmployeeEvent) {
    sidebarStore.openSidebar(
      "Update record",
      EmployeeEventForm,
      {
        employee,
        record
      }
    );
  }

  return (
    <article>
      <button onClick={openCreationForm}>Create event</button>
      <section className="agenda">
        {iter(prependedDays).map((_, i) => (
          <AgendaSquare key={`empty-${i}`} date={null} events={[]} onEventClick={onEventClick} />
        ))}
        {dates.map((date) => (
          <AgendaSquare key={date.getDate()} date={date} events={eventMap.get(date) || []} onEventClick={onEventClick} />
        ))}
      </section>
    </article>
  );
};

export default EmployeeAgenda;
