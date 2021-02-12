export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Datetime: any;
};

export type Query = {
  __typename?: 'Query';
  shifts: ShiftsPayload;
  shift: ShiftPayload;
  days: DaysPayload;
  employees: EmployeesPayload;
  employeeEvents: EmployeeEventsPayload;
  employeeEventsByInterval: EmployeeEventsPayload;
  schedule: SchedulePayload;
};


export type QueryShiftArgs = {
  id: Scalars['String'];
};


export type QueryEmployeeEventsArgs = {
  employeeId: Scalars['String'];
};


export type QueryEmployeeEventsByIntervalArgs = {
  id: Scalars['String'];
  startDate: Scalars['Datetime'];
  endDate: Scalars['Datetime'];
};

export type ShiftsPayload = {
  __typename?: 'ShiftsPayload';
  result?: Maybe<Array<Shift>>;
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Scalars['String']>>;
};

export type Shift = {
  __typename?: 'Shift';
  id: Scalars['String'];
  title: Scalars['String'];
  duration: Scalars['Int'];
  shiftImportance: ShiftImportance;
  coverMonday: Scalars['Int'];
  coverTuesday: Scalars['Int'];
  coverWednesday: Scalars['Int'];
  coverThursday: Scalars['Int'];
  coverFriday: Scalars['Int'];
  coverSaturday: Scalars['Int'];
  coverSunday: Scalars['Int'];
};

export enum ShiftImportance {
  Major = 'MAJOR',
  Average = 'AVERAGE',
  Minor = 'MINOR'
}

export type ShiftPayload = {
  __typename?: 'ShiftPayload';
  result?: Maybe<Shift>;
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Scalars['String']>>;
};

export type DaysPayload = {
  __typename?: 'DaysPayload';
  result?: Maybe<Array<Day>>;
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Scalars['String']>>;
};

export type Day = {
  __typename?: 'Day';
  id: Scalars['String'];
  name: DayEnum;
  active: Scalars['Boolean'];
};

export type DayEnum = {
  __typename?: 'DayEnum';
  name: DayName;
  value: Scalars['Int'];
};

export enum DayName {
  Monday = 'MONDAY',
  Tuesday = 'TUESDAY',
  Wednesday = 'WEDNESDAY',
  Thursday = 'THURSDAY',
  Friday = 'FRIDAY',
  Saturday = 'SATURDAY',
  Sunday = 'SUNDAY'
}

export type EmployeesPayload = {
  __typename?: 'EmployeesPayload';
  result?: Maybe<Array<Employee>>;
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Scalars['String']>>;
};

export type Employee = {
  __typename?: 'Employee';
  id: Scalars['String'];
  name: Scalars['String'];
  contract: Scalars['Int'];
  workingDays?: Maybe<Array<Day>>;
  skills: Array<EmployeeSkill>;
  events: Array<EmployeeEvent>;
};

export type EmployeeSkill = {
  __typename?: 'EmployeeSkill';
  shift: Shift;
  employee: Employee;
  level: ShiftSkillLevel;
};

export enum ShiftSkillLevel {
  NoSkill = 'NO_SKILL',
  Learning = 'LEARNING',
  Master = 'MASTER'
}

export type EmployeeEvent = {
  __typename?: 'EmployeeEvent';
  id: Scalars['String'];
  employee: Employee;
  shift?: Maybe<Shift>;
  startDate: Scalars['Datetime'];
  endDate: Scalars['Datetime'];
  duration: Scalars['Int'];
  type: EventType;
  status: EventStatus;
  nature: EventNature;
  isDesired: Scalars['Boolean'];
};


export enum EventType {
  PaidLeave = 'PAID_LEAVE',
  UnpaidLeave = 'UNPAID_LEAVE',
  Holiday = 'HOLIDAY',
  Illness = 'ILLNESS'
}

export enum EventStatus {
  Pending = 'PENDING',
  Confirmed = 'CONFIRMED',
  Declined = 'DECLINED'
}

export enum EventNature {
  Mandatory = 'MANDATORY',
  Important = 'IMPORTANT',
  Wanted = 'WANTED',
  Prefered = 'PREFERED'
}

export type EmployeeEventsPayload = {
  __typename?: 'EmployeeEventsPayload';
  result?: Maybe<Array<EmployeeEvent>>;
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Scalars['String']>>;
};

export type SchedulePayload = {
  __typename?: 'SchedulePayload';
  result?: Maybe<CompleteSchedule>;
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Scalars['String']>>;
};

export type CompleteSchedule = {
  __typename?: 'CompleteSchedule';
  schedule: Array<ScheduleDay>;
  meta: ScheduleMeta;
};

export type ScheduleDay = {
  __typename?: 'ScheduleDay';
  day: Scalars['String'];
  shifts: Array<ScheduleShift>;
};

export type ScheduleShift = {
  __typename?: 'ScheduleShift';
  shift: Scalars['String'];
  employee: Scalars['String'];
};

export type ScheduleMeta = {
  __typename?: 'ScheduleMeta';
  createdAt: Scalars['Datetime'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createShift?: Maybe<ShiftPayload>;
  updateShift?: Maybe<ShiftPayload>;
  deleteShift: Payload;
  createEmployee?: Maybe<EmployeePayload>;
  updateEmployee?: Maybe<EmployeePayload>;
  deleteEmployee: Payload;
  createEvent?: Maybe<EmployeeEventPayload>;
  updateEvent?: Maybe<EmployeeEventPayload>;
  deleteEvent?: Maybe<Payload>;
  toggleDayActivation?: Maybe<ToggleDayActivationPayload>;
  generateSchedule?: Maybe<SchedulePayload>;
  createOrganization: Scalars['Boolean'];
};


export type MutationCreateShiftArgs = {
  input: CreateShiftInput;
};


export type MutationUpdateShiftArgs = {
  input: UpdateShiftInput;
};


export type MutationDeleteShiftArgs = {
  id: Scalars['String'];
};


export type MutationCreateEmployeeArgs = {
  input: CreateEmployeeInput;
};


export type MutationUpdateEmployeeArgs = {
  input: UpdateEmployeeInput;
};


export type MutationDeleteEmployeeArgs = {
  id: Scalars['String'];
};


export type MutationCreateEventArgs = {
  input: CreateEventInput;
};


export type MutationUpdateEventArgs = {
  input: UpdateEventInput;
};


export type MutationDeleteEventArgs = {
  id: Scalars['String'];
};


export type MutationToggleDayActivationArgs = {
  input: ToggleDayActivationInput;
};


export type MutationGenerateScheduleArgs = {
  input: GenerateScheduleInput;
};

export type CreateShiftInput = {
  title: Scalars['String'];
  duration: Scalars['Int'];
  shiftImportance: ShiftImportance;
  coverMonday: Scalars['Int'];
  coverTuesday: Scalars['Int'];
  coverWednesday: Scalars['Int'];
  coverThursday: Scalars['Int'];
  coverFriday: Scalars['Int'];
  coverSaturday: Scalars['Int'];
  coverSunday: Scalars['Int'];
};

export type UpdateShiftInput = {
  id: Scalars['String'];
  title: Scalars['String'];
  duration: Scalars['Int'];
  shiftImportance: ShiftImportance;
  coverMonday: Scalars['Int'];
  coverTuesday: Scalars['Int'];
  coverWednesday: Scalars['Int'];
  coverThursday: Scalars['Int'];
  coverFriday: Scalars['Int'];
  coverSaturday: Scalars['Int'];
  coverSunday: Scalars['Int'];
};

export type Payload = {
  __typename?: 'Payload';
  result?: Maybe<Scalars['Boolean']>;
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Scalars['String']>>;
};

export type CreateEmployeeInput = {
  name: Scalars['String'];
  contract: Scalars['Int'];
  workingDays: Array<DayName>;
  skills: Array<ShiftSkillInput>;
};

export type ShiftSkillInput = {
  shift: Scalars['String'];
  level: ShiftSkillLevel;
};

export type EmployeePayload = {
  __typename?: 'EmployeePayload';
  result?: Maybe<Employee>;
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Scalars['String']>>;
};

export type UpdateEmployeeInput = {
  id: Scalars['String'];
  name: Scalars['String'];
  contract: Scalars['Int'];
  workingDays: Array<DayName>;
  skills: Array<ShiftSkillInput>;
};

export type CreateEventInput = {
  employee: Scalars['String'];
  shift?: Maybe<Scalars['String']>;
  startDate: Scalars['Datetime'];
  duration: Scalars['Int'];
  type: EventType;
  status: EventStatus;
  nature: EventNature;
  isDesired: Scalars['Boolean'];
};

export type EmployeeEventPayload = {
  __typename?: 'EmployeeEventPayload';
  result?: Maybe<EmployeeEvent>;
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Scalars['String']>>;
};

export type UpdateEventInput = {
  id: Scalars['String'];
  shift?: Maybe<Scalars['String']>;
  startDate: Scalars['Datetime'];
  duration: Scalars['Int'];
  type: EventType;
  status: EventStatus;
  nature: EventNature;
  isDesired: Scalars['Boolean'];
};

export type ToggleDayActivationInput = {
  id: Scalars['String'];
  active: Scalars['Boolean'];
};

export type ToggleDayActivationPayload = {
  __typename?: 'ToggleDayActivationPayload';
  result?: Maybe<Day>;
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Scalars['String']>>;
};

export type GenerateScheduleInput = {
  startDate: Scalars['Datetime'];
  nbWeeks: Scalars['Int'];
  opts?: Maybe<Scalars['Boolean']>;
};
