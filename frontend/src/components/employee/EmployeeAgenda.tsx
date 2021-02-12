import { useEffect, useState } from "react";
import { EmployeeEvent } from "../../types";
import eachDayOfInterval from "date-fns/eachDayOfInterval";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import getISODay from "date-fns/getISODay";
import { iter } from "../../utils/layout";
import sidebarStore from "../../store/sidebar.store";
import EmployeeEventForm from "./EmployeeEventForm";
import { employeeEventSubject } from "../../rxjs/record.subject";
import { useSubject } from "../../hooks/useAsyncState";
import { v4 as uuidv4 } from 'uuid';
import { getMonthYear } from "../../utils/utils";

type EmployeeAgendaProps = {
  employeeId: string;
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
          events && events.map(ev => <span key={uuidv4()} onClick={() => onEventClick(ev)}>
            {ev.type}
          </span>)
        }
      </div>
    </div>
  );
};
const EmployeeAgenda = ({ employeeId }: EmployeeAgendaProps) => {
  const now = new Date();
  const [interval] = useState<Interval>({
    start: startOfMonth(now),
    end: endOfMonth(now),
  });
  useEffect(() => {
    employeeEventSubject.fetchInterval(employeeId, interval)
  }, [employeeId])

  const dates = eachDayOfInterval(interval);
  const prependedDays = getDiffDays(interval.start as Date, 1);

  const eventMap = new Map<string, EmployeeEvent[]>(dates.map(d => [d.toISOString(), []]));
  const [events] = useSubject(null, employeeEventSubject.agenda);
  events?.forEach(ev => {
    const dates = eachDayOfInterval({ start: ev.startDate, end: ev.endDate });
    dates.forEach(d => eventMap.get(d.toISOString())?.push(ev));
  })

  function openCreationForm() {
    sidebarStore.openSidebar(
      "Create record",
      EmployeeEventForm, {
      employee: employeeId
    }
    );
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

  return (
    <article>
      <h3>Agenda - <span>{getMonthYear(interval.start as Date)}</span></h3>
      <button onClick={openCreationForm}>Create event</button>
      <section className="agenda">
        {iter(prependedDays).map(() => (
          <AgendaSquare key={uuidv4()} date={null} events={[]} onEventClick={onEventClick} />
        ))}
        {dates.map((date, i) => (
          <AgendaSquare key={uuidv4()} date={date} events={eventMap.get(date.toISOString()) || []} onEventClick={onEventClick} />
        ))}
      </section>
    </article>
  );
};

export default EmployeeAgenda;
